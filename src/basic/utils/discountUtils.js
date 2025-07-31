import { DISCOUNT_RATES, QUANTITY_THRESHOLDS, WEEKDAYS } from '../constants';

// 할인 타입 상수
export const DISCOUNT_TYPES = {
  INDIVIDUAL: 'individual',
  BULK: 'bulk',
  TUESDAY: 'tuesday',
  LIGHTNING: 'lightning',
  SUGGEST: 'suggest',
};

// 개별 상품 할인 계산
export function calculateIndividualDiscount(product, quantity) {
  if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
    const discountRate = DISCOUNT_RATES[product.id] || 0;
    return {
      rate: discountRate,
      amount: product.price * quantity * discountRate,
      applicable: discountRate > 0,
    };
  }
  return { rate: 0, amount: 0, applicable: false };
}

// 대량 구매 할인 계산
export function calculateBulkDiscount(itemCount, subtotal) {
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    const discountRate = DISCOUNT_RATES.BULK;
    const discountedTotal = subtotal * (1 - discountRate);
    return {
      rate: discountRate,
      amount: subtotal - discountedTotal,
      finalAmount: discountedTotal,
      applicable: true,
    };
  }
  return { rate: 0, amount: 0, finalAmount: subtotal, applicable: false };
}

// 화요일 할인 계산
export function calculateTuesdayDiscount(totalAmount) {
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;

  if (isTuesday && totalAmount > 0) {
    const discountRate = DISCOUNT_RATES.TUESDAY;
    const discountedAmount = totalAmount * (1 - discountRate);
    return {
      rate: discountRate,
      amount: totalAmount - discountedAmount,
      finalAmount: discountedAmount,
      applicable: true,
      isTuesday: true,
    };
  }
  return { rate: 0, amount: 0, finalAmount: totalAmount, applicable: false, isTuesday };
}

// 번개세일 할인 적용
export function applyLightningDiscount(product) {
  if (!product.onSale) {
    product.onSale = true;
    product.originalVal = product.val;
    product.val = Math.round(product.val * (1 - DISCOUNT_RATES.LIGHTNING));
  }
}

// 추천세일 할인 적용
export function applySuggestDiscount(product) {
  if (!product.suggestSale) {
    product.suggestSale = true;
    product.originalVal = product.val;
    product.val = Math.round(product.val * (1 - DISCOUNT_RATES.SUGGEST));
  }
}

// 할인 정보 생성 (표시용)
export function generateDiscountInfo(itemCount, itemDiscounts, isTuesday, totalAmount) {
  const discounts = [];

  // 대량 구매 할인
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    discounts.push({
      type: DISCOUNT_TYPES.BULK,
      name: '🎉 대량구매 할인 (30개 이상)',
      rate: DISCOUNT_RATES.BULK * 100,
      color: 'text-green-400',
    });
  } else if (itemDiscounts.length > 0) {
    // 개별 상품 할인
    itemDiscounts.forEach((item) => {
      discounts.push({
        type: DISCOUNT_TYPES.INDIVIDUAL,
        name: `${item.name} (10개↑)`,
        rate: item.discount,
        color: 'text-green-400',
      });
    });
  }

  // 화요일 할인
  if (isTuesday && totalAmount > 0) {
    discounts.push({
      type: DISCOUNT_TYPES.TUESDAY,
      name: '🌟 화요일 추가 할인',
      rate: DISCOUNT_RATES.TUESDAY * 100,
      color: 'text-purple-400',
    });
  }

  return discounts;
}

// 할인 HTML 생성
export function generateDiscountHtml(discounts) {
  return discounts
    .map(
      (discount) => `
    <div class="flex justify-between text-sm tracking-wide ${discount.color}">
      <span class="text-xs">${discount.name}</span>
      <span class="text-xs">-${discount.rate}%</span>
    </div>
  `
    )
    .join('');
}

// 총 할인율 계산
export function calculateTotalDiscountRate(originalTotal, finalTotal) {
  if (originalTotal <= 0) return 0;
  return (originalTotal - finalTotal) / originalTotal;
}

// 할인된 금액 계산
export function calculateSavedAmount(originalTotal, finalTotal) {
  return Math.max(0, originalTotal - finalTotal);
}

// 할인 적용 가능 여부 확인
export function isDiscountApplicable(product, quantity) {
  const individualDiscount = calculateIndividualDiscount(product, quantity);
  return individualDiscount.applicable || product.onSale || product.suggestSale;
}

// 모든 할인을 적용한 최종 금액 계산
export function calculateFinalAmount(subtotal, itemCount, individualDiscountAmount) {
  let currentTotal = subtotal - individualDiscountAmount;

  // 대량 구매 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCount, subtotal);
  if (bulkDiscount.applicable) {
    currentTotal = bulkDiscount.finalAmount;
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount(currentTotal);
  if (tuesdayDiscount.applicable) {
    currentTotal = tuesdayDiscount.finalAmount;
  }

  return {
    finalAmount: currentTotal,
    totalSaved: subtotal - currentTotal,
    discountRate: calculateTotalDiscountRate(subtotal, currentTotal),
  };
}
