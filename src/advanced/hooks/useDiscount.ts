import { useCallback } from 'react';
import { DISCOUNT_RATES, QUANTITY_THRESHOLDS } from '../constants';
import { ProductType, CalculationResultType } from '../types';
import {
  calculateIndividualDiscount,
  calculateBulkDiscount,
  calculateTuesdayDiscount,
} from '../utils';

export const useDiscount = () => {
  // 번개세일 할인 적용
  const applyLightningDiscount = useCallback((product: ProductType) => {
    if (!product.onSale) {
      product.onSale = true;
      product.originalPrice = product.price;
      product.price = Math.round(product.price * (1 - DISCOUNT_RATES.LIGHTNING));
    }
  }, []);

  // 추천세일 할인 적용
  const applySuggestDiscount = useCallback((product: ProductType) => {
    if (!product.suggestSale) {
      product.suggestSale = true;
      product.originalPrice = product.price;
      product.price = Math.round(product.price * (1 - DISCOUNT_RATES.SUGGEST));
    }
  }, []);

  // 공통 할인율 계산 함수
  const calculateDiscountRate = useCallback((originalTotal: number, finalTotal: number): number => {
    return originalTotal > 0 ? ((originalTotal - finalTotal) / originalTotal) * 100 : 0;
  }, []);

  // 공통 할인 금액 계산 함수
  const calculateDiscountAmount = useCallback(
    (originalTotal: number, finalTotal: number): number => {
      return originalTotal - finalTotal;
    },
    []
  );

  // OrderSummary 전용 할인 정보 생성
  const generateOrderSummaryDiscountInfo = useCallback(
    (calculationResult: CalculationResultType) => {
      const discounts: Array<{ name: string; rate: number; color: string }> = [];

      // 대량 구매 할인 (30개 이상)
      if (calculationResult.itemCount >= 30) {
        discounts.push({
          name: '🎉 대량구매 할인 (30개 이상)',
          rate: DISCOUNT_RATES.BULK * 100,
          color: 'text-green-400',
        });
      } else if (calculationResult.itemDiscounts.length > 0) {
        // 개별 상품 할인 (10개 이상)
        calculationResult.itemDiscounts.forEach((item) => {
          discounts.push({
            name: `${item.name} (10개↑)`,
            rate: item.rate * 100,
            color: 'text-green-400',
          });
        });
      }

      // 화요일 할인
      if (calculationResult.isTuesday && calculationResult.totalAmount > 0) {
        discounts.push({
          name: '🌟 화요일 추가 할인',
          rate: DISCOUNT_RATES.TUESDAY * 100,
          color: 'text-purple-400',
        });
      }

      return discounts;
    },
    []
  );

  // 할인 적용 가능 여부 확인
  const isDiscountApplicable = useCallback((product: ProductType, quantity: number): boolean => {
    return quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT;
  }, []);

  // 최종 금액 계산
  const calculateFinalAmount = useCallback(
    (subtotal: number, itemCount: number, individualDiscountAmount: number): number => {
      const bulkDiscount = calculateBulkDiscount(itemCount, subtotal);
      const tuesdayDiscount = calculateTuesdayDiscount(subtotal - individualDiscountAmount);

      return tuesdayDiscount.finalAmount;
    },
    []
  );

  return {
    calculateIndividualDiscount,
    calculateBulkDiscount,
    calculateTuesdayDiscount,
    applyLightningDiscount,
    applySuggestDiscount,
    generateOrderSummaryDiscountInfo,
    calculateDiscountRate,
    calculateDiscountAmount,
    isDiscountApplicable,
    calculateFinalAmount,
  };
};
