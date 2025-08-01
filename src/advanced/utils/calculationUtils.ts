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
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    const discountRate = DISCOUNT_RATES.BULK;
    const discountedTotal = subtotal * (1 - discountRate);
    return {
      rate: discountRate,
      amount: subtotal - discountedTotal,
      finalAmount: discountedTotal,
      applicable: true,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
    const discountRate = 0.2;
    const discountedTotal = subtotal * 0.8;
    return {
      rate: discountRate,
      amount: subtotal - discountedTotal,
      finalAmount: discountedTotal,
      applicable: true,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
    const discountRate = 0.1;
    const discountedTotal = subtotal * 0.9;
    return {
      rate: discountRate,
      amount: subtotal - discountedTotal,
      finalAmount: discountedTotal,
      applicable: true,
    };
  }
  return { rate: 0, amount: 0, finalAmount: subtotal, applicable: false };
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
