import { ProductType, CartItemType, ProductCountsType } from '../types';
import { DISCOUNT_RATES, QUANTITY_THRESHOLDS, WEEKDAYS } from '../constants';

// 개별 상품 할인 계산
export const calculateIndividualDiscount = (product: ProductType, quantity: number) => {
  if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
    const discountRate = DISCOUNT_RATES[product.id] || 0;
    return {
      rate: discountRate,
      amount: product.price * quantity * discountRate,
      applicable: discountRate > 0,
    };
  }
  return { rate: 0, amount: 0, applicable: false };
};

// 대량 구매 할인 계산
export const calculateBulkDiscount = (itemCount: number, subtotal: number) => {
  const discountConfig = getBulkDiscountConfig(itemCount);
  if (!discountConfig) {
    return { rate: 0, amount: 0, finalAmount: subtotal, applicable: false };
  }

  const discountedTotal = subtotal * (1 - discountConfig.rate);
  return {
    rate: discountConfig.rate,
    amount: subtotal - discountedTotal,
    finalAmount: discountedTotal,
    applicable: true,
  };
};

// 대량 할인 설정 가져오기
const getBulkDiscountConfig = (itemCount: number) => {
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    return { rate: DISCOUNT_RATES.BULK };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
    return { rate: 0.2 };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
    return { rate: 0.1 };
  }
  return null;
};

// 화요일 할인 계산
export const calculateTuesdayDiscount = (totalAmount: number) => {
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
};

// 상품 수량 계산
export const getProductCounts = (
  cartItems: CartItemType[],
  productList: ProductType[]
): ProductCountsType => {
  return cartItems.reduce((counts, cartItem) => {
    const product = productList.find((p) => p.id === cartItem.id);
    if (product) {
      counts[product.id] = (counts[product.id] || 0) + cartItem.quantity;
    }
    return counts;
  }, {} as ProductCountsType);
};

// 총 수량 계산
export const calculateTotal = (cartItems: CartItemType[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// 할인율 계산
export const calculateDiscountRate = (originalTotal: number, finalTotal: number): number => {
  return originalTotal > 0 ? ((originalTotal - finalTotal) / originalTotal) * 100 : 0;
};

// 할인 금액 계산
export const calculateDiscountAmount = (originalTotal: number, finalTotal: number): number => {
  return originalTotal - finalTotal;
};
