import { findProductById } from './cartUtils';
import {
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  POINT_RATES,
} from '../constants';

// 총 재고 계산
export function getTotalStock(productList) {
  return productList.reduce((sum, product) => sum + product.quantity, 0);
}

// 장바구니의 총 수량 계산
export function calculateTotal(cartContainer) {
  let totalCount = 0;
  const children = cartContainer.children;
  for (let j = 0; j < children.length; j++) {
    const qtyElem = children[j].querySelector('.quantity-number');
    if (qtyElem) {
      totalCount += parseInt(qtyElem.textContent);
    }
  }
  return totalCount;
}

// 장바구니에 있는 각 상품의 개수 계산
export function getProductCounts(cartItems, productList) {
  const counts = {};
  for (const cartItem of cartItems) {
    const product = findProductById(productList, cartItem.id);
    if (product) {
      counts[product.id] = (counts[product.id] || 0) + 1;
    }
  }
  return counts;
}

// 장바구니 총합 계산
export function calculateCartTotals(cartItems, productList) {
  let totalAmt = 0;
  let itemCnt = 0;
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 재고 확인
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].quantity < 5 && productList[idx].quantity > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }

  // 장바구니 아이템 계산
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(productList, cartItem.id);

    if (!product) continue;

    const qtyElem = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.price * quantity;
    let discount = 0;

    itemCnt += quantity;
    subTot += itemTotal;

    // 할인 적용
    if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
      discount = DISCOUNT_RATES[product.id] || 0;
      if (discount > 0) {
        itemDiscounts.push({ name: product.name, discount: discount * 100 });
      }
    }

    totalAmt += itemTotal * (1 - discount);
  }

  // 대량 할인 적용
  const originalTotal = subTot;
  let discRate = 0;

  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_30) {
    totalAmt = (subTot * 75) / 100;
    discRate = DISCOUNT_RATES.BULK;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && totalAmt > 0) {
    totalAmt = (totalAmt * 90) / 100;
    discRate = 1 - totalAmt / originalTotal;
  }

  return {
    totalAmt,
    itemCnt,
    subTot,
    originalTotal,
    itemDiscounts,
    lowStockItems,
    discRate,
    isTuesday,
  };
}

// 보너스 포인트 계산
export function calculateBonusPoints(cartItems, totalAmt, itemCnt, productList) {
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(totalAmt / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합 확인
  const productCounts = getProductCounts(cartItems, productList);
  const hasKeyboard = productCounts[KEYBOARD] > 0;
  const hasMouse = productCounts[MOUSE] > 0;
  const hasMonitorArm = productCounts[MONITOR_ARM] > 0;

  if (hasKeyboard && hasMouse) {
    finalPoints += POINT_RATES.SET_KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINT_RATES.SET_KEYBOARD_MOUSE_MONITOR_ARM;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_30) {
    finalPoints += POINT_RATES.BULK_30;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BULK_20) {
    finalPoints += POINT_RATES.BULK_20;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BULK_10) {
    finalPoints += POINT_RATES.BULK_10;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { finalPoints, pointsDetail };
}

// 재고 메시지 생성
export function getStockMessage(productList) {
  let stockMsg = '';
  productList.forEach(function (item) {
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.quantity > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  });
  return stockMsg;
}
