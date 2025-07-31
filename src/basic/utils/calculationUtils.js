import {
  POINT_RATES,
  WEEKDAYS,
  QUANTITY_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
} from '../constants';
import { findProductById } from './cartUtils';
import { getQuantity } from './domHelpers';
import {
  calculateIndividualDiscount,
  calculateBulkDiscount,
  calculateTuesdayDiscount,
} from './discountUtils';

/**
 * 재고 관련 함수들
 */

// 총 재고 계산
export function getTotalStock(productList) {
  return productList.reduce((sum, product) => sum + product.quantity, 0);
}

// 재고 부족 상품 확인
function findLowStockItems(productList) {
  return productList
    .filter((product) => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK && product.quantity > 0)
    .map((product) => product.name);
}

// 재고 메시지 생성
export function getStockMessage(productList) {
  let stockMsg = '';
  productList.forEach((item) => {
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

/**
 * 수량 계산 함수들
 */

// 장바구니의 총 수량 계산
export function calculateTotal(cartContainer) {
  return Array.from(cartContainer.children)
    .map((child) => child.querySelector('.quantity-number'))
    .filter((qtyElem) => qtyElem)
    .reduce((total, qtyElem) => total + parseInt(qtyElem.textContent), 0);
}

// 장바구니에 있는 각 상품의 개수 계산
export function getProductCounts(cartItems, productList) {
  return Array.from(cartItems)
    .map((cartItem) => {
      const product = findProductById(productList, cartItem.id);
      if (!product) return null;

      const quantity = getQuantity(cartItem);
      return { product, quantity };
    })
    .filter((item) => item !== null)
    .reduce((counts, { product, quantity }) => {
      counts[product.id] = (counts[product.id] || 0) + quantity;
      return counts;
    }, {});
}

/**
 * 장바구니 계산 관련 함수들
 */

// 장바구니 아이템별 계산 및 개별 할인 적용
function calculateCartItemTotals(cartItems, productList) {
  const itemCalculations = Array.from(cartItems)
    .map((cartItem) => {
      const product = findProductById(productList, cartItem.id);
      if (!product) return null;

      // DOM 조회를 한 번만 수행하고 결과 재사용
      const quantityElement = cartItem.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
      const itemTotal = product.price * quantity;
      const individualDiscount = calculateIndividualDiscount(product, quantity);

      return {
        quantity,
        itemTotal,
        discountedTotal: itemTotal * (1 - individualDiscount.rate),
        discount: individualDiscount.applicable
          ? {
              name: product.name,
              discount: individualDiscount.rate * 100,
            }
          : null,
      };
    })
    .filter((item) => item !== null);

  return itemCalculations.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + item.discountedTotal,
      itemCount: acc.itemCount + item.quantity,
      subtotal: acc.subtotal + item.itemTotal,
      itemDiscounts: item.discount ? [...acc.itemDiscounts, item.discount] : acc.itemDiscounts,
    }),
    { totalAmount: 0, itemCount: 0, subtotal: 0, itemDiscounts: [] }
  );
}

// 대량 구매 할인 적용 (래퍼 함수)
function applyBulkDiscount(totalAmount, subtotal, itemCount) {
  const bulkDiscount = calculateBulkDiscount(itemCount, subtotal);

  if (bulkDiscount.applicable) {
    return {
      finalAmount: bulkDiscount.finalAmount,
      discountRate: bulkDiscount.rate,
    };
  }

  // 기존 개별 할인율 계산
  const individualDiscountRate = (subtotal - totalAmount) / subtotal;
  return { finalAmount: totalAmount, discountRate: individualDiscountRate };
}

// 화요일 할인 적용 (래퍼 함수)
function applyTuesdayDiscount(totalAmount, originalTotal) {
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);

  if (tuesdayDiscount.applicable) {
    const discountRate = 1 - tuesdayDiscount.finalAmount / originalTotal;
    return {
      finalAmount: tuesdayDiscount.finalAmount,
      discountRate,
      isTuesday: tuesdayDiscount.isTuesday,
    };
  }

  // 화요일이 아닌 경우
  const discountRate = (originalTotal - totalAmount) / originalTotal;
  return { finalAmount: totalAmount, discountRate, isTuesday: tuesdayDiscount.isTuesday };
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

  // 보너스 포인트도 함께 계산하여 중복 계산 방지
  const bonusPoints = calculateBonusPoints(
    cartItems,
    tuesdayDiscountResult.finalAmount,
    itemTotals.itemCount,
    productList
  );

  return {
    totalAmount: tuesdayDiscountResult.finalAmount,
    itemCount: itemTotals.itemCount,
    subtotal: itemTotals.subtotal,
    originalTotal,
    itemDiscounts: itemTotals.itemDiscounts,
    lowStockItems,
    discountRate: tuesdayDiscountResult.discountRate,
    isTuesday: tuesdayDiscountResult.isTuesday,
    bonusPoints,
  };
}

/**
 * 포인트 계산 관련 함수들
 */

// 보너스 포인트 계산
export function calculateBonusPoints(cartItems, totalAmount, itemCount, productList) {
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  // 기본 포인트 계산
  const basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배 포인트
  if (new Date().getDay() === WEEKDAYS.TUESDAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합 보너스 포인트
  finalPoints += calculateCombinationBonus(cartItems, productList, pointsDetail);

  // 대량 구매 보너스 포인트
  finalPoints += calculateBulkPurchaseBonus(itemCount, pointsDetail);

  return { finalPoints, pointsDetail };
}

// 상품 조합 보너스 포인트 계산
function calculateCombinationBonus(cartItems, productList, pointsDetail) {
  const productCounts = getProductCounts(cartItems, productList);
  const hasKeyboard = productCounts[KEYBOARD] > 0;
  const hasMouse = productCounts[MOUSE] > 0;
  const hasMonitorArm = productCounts[MONITOR_ARM] > 0;

  let bonusPoints = 0;

  if (hasKeyboard && hasMouse) {
    bonusPoints += POINT_RATES.SET_KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINT_RATES.SET_KEYBOARD_MOUSE_MONITOR_ARM;
    pointsDetail.push('풀세트 구매 +100p');
  }

  return bonusPoints;
}

// 대량 구매 보너스 포인트 계산
function calculateBulkPurchaseBonus(itemCount, pointsDetail) {
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    pointsDetail.push('대량구매(30개+) +100p');
    return POINT_RATES.BULK_30;
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
    pointsDetail.push('대량구매(20개+) +50p');
    return POINT_RATES.BULK_20;
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
    pointsDetail.push('대량구매(10개+) +20p');
    return POINT_RATES.BULK_10;
  }

  return 0;
}
