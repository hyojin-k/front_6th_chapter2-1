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

// 재고 부족 상품 확인
function findLowStockItems(productList) {
  const lowStockItems = [];
  for (let productIndex = 0; productIndex < productList.length; productIndex++) {
    if (productList[productIndex].quantity < 5 && productList[productIndex].quantity > 0) {
      lowStockItems.push(productList[productIndex].name);
    }
  }
  return lowStockItems;
}

// 장바구니 아이템별 계산 및 개별 할인 적용
function calculateCartItemTotals(cartItems, productList) {
  let totalAmount = 0;
  let itemCount = 0;
  let subtotal = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(productList, cartItem.id);

    if (!product) continue;

    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);
    const itemTotal = product.price * quantity;
    let discount = 0;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 상품 할인 적용
    if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
      discount = DISCOUNT_RATES[product.id] || 0;
      if (discount > 0) {
        itemDiscounts.push({ name: product.name, discount: discount * 100 });
      }
    }

    totalAmount += itemTotal * (1 - discount);
  }

  return { totalAmount, itemCount, subtotal, itemDiscounts };
}

// 대량 구매 할인 적용
function applyBulkDiscount(totalAmount, subtotal, itemCount) {
  let finalAmount = totalAmount;
  let discountRate = 0;

  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    finalAmount = (subtotal * 75) / 100;
    discountRate = DISCOUNT_RATES.BULK;
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  return { finalAmount, discountRate };
}

// 화요일 할인 적용
function applyTuesdayDiscount(totalAmount, originalTotal) {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  let finalAmount = totalAmount;
  let discountRate = 0;

  if (isTuesday && totalAmount > 0) {
    finalAmount = (totalAmount * 90) / 100;
    discountRate = 1 - finalAmount / originalTotal;
  } else {
    discountRate = (originalTotal - totalAmount) / originalTotal;
  }

  return { finalAmount, discountRate, isTuesday };
}

// 장바구니 총합 계산 (메인 함수)
export function calculateCartTotals(cartItems, productList) {
  const lowStockItems = findLowStockItems(productList);
  const itemTotals = calculateCartItemTotals(cartItems, productList);
  const originalTotal = itemTotals.subtotal;

  const bulkDiscountResult = applyBulkDiscount(
    itemTotals.totalAmount,
    itemTotals.subtotal,
    itemTotals.itemCount
  );
  const tuesdayDiscountResult = applyTuesdayDiscount(bulkDiscountResult.finalAmount, originalTotal);

  return {
    totalAmount: tuesdayDiscountResult.finalAmount,
    itemCount: itemTotals.itemCount,
    subtotal: itemTotals.subtotal,
    originalTotal,
    itemDiscounts: itemTotals.itemDiscounts,
    lowStockItems,
    discountRate: tuesdayDiscountResult.discountRate,
    isTuesday: tuesdayDiscountResult.isTuesday,
  };
}

// 보너스 포인트 계산
export function calculateBonusPoints(cartItems, totalAmount, itemCount, productList) {
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(totalAmount / 1000);
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
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    finalPoints += POINT_RATES.BULK_30;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
    finalPoints += POINT_RATES.BULK_20;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
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
