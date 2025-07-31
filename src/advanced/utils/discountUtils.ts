import { DISCOUNT_RATES, QUANTITY_THRESHOLDS, WEEKDAYS } from '../constants';
import { ProductType } from '../types';

// 할인 타입 상수
export const DISCOUNT_TYPES = {
  INDIVIDUAL: 'individual',
  BULK: 'bulk',
  TUESDAY: 'tuesday',
  LIGHTNING: 'lightning',
  SUGGEST: 'suggest',
} as const;

// 개별 상품 할인 계산
export function calculateIndividualDiscount(product: ProductType, quantity: number) {
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
export function calculateBulkDiscount(itemCount: number, subtotal: number) {
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
export function calculateTuesdayDiscount(totalAmount: number) {
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
export function applyLightningDiscount(product: ProductType) {
  if (!product.onSale) {
    product.onSale = true;
    product.originalPrice = product.price;
    product.price = Math.round(product.price * (1 - DISCOUNT_RATES.LIGHTNING));
  }
}

// 추천세일 할인 적용
export function applySuggestDiscount(product: ProductType) {
  if (!product.suggestSale) {
    product.suggestSale = true;
    product.originalPrice = product.price;
    product.price = Math.round(product.price * (1 - DISCOUNT_RATES.SUGGEST));
  }
}

// 할인 정보 생성 (표시용)
export function generateDiscountInfo(
  itemCount: number,
  itemDiscounts: Array<{ name: string; discount: number }>,
  isTuesday: boolean,
  totalAmount: number
) {
  const discounts: Array<{
    type: string;
    name: string;
    rate: number;
    color: string;
  }> = [];

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
  if (isTuesday) {
    discounts.push({
      type: DISCOUNT_TYPES.TUESDAY,
      name: '🎉 화요일 특별 할인',
      rate: DISCOUNT_RATES.TUESDAY * 100,
      color: 'text-blue-400',
    });
  }

  return discounts;
}

// 할인 HTML 생성
export function generateDiscountHtml(
  discounts: Array<{ name: string; rate: number; color: string }>
) {
  if (discounts.length === 0) return '';

  return discounts
    .map(
      (discount) =>
        `<div class="text-xs ${discount.color}">${discount.name}: ${discount.rate}% 할인</div>`
    )
    .join('');
}

// 총 할인율 계산
export function calculateTotalDiscountRate(originalTotal: number, finalTotal: number): number {
  return originalTotal > 0 ? ((originalTotal - finalTotal) / originalTotal) * 100 : 0;
}

// 절약 금액 계산
export function calculateSavedAmount(originalTotal: number, finalTotal: number): number {
  return originalTotal - finalTotal;
}

// 할인 적용 가능 여부 확인
export function isDiscountApplicable(product: ProductType, quantity: number): boolean {
  return quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT;
}

// 최종 금액 계산
export function calculateFinalAmount(
  subtotal: number,
  itemCount: number,
  individualDiscountAmount: number
): number {
  const bulkDiscount = calculateBulkDiscount(itemCount, subtotal);
  const tuesdayDiscount = calculateTuesdayDiscount(subtotal - individualDiscountAmount);

  return tuesdayDiscount.finalAmount;
}
