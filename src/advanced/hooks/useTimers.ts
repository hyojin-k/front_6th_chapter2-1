import { useEffect, useCallback } from 'react';
import { PRODUCT_LIST, TIMER_INTERVALS } from '../constants';

export const useTimers = (
  onUpdateProductList: () => void,
  onUpdateCalculation: () => void,
  cartItems: any[],
  lastSelectedProduct: string | null,
  onApplyDiscount?: (productId: string, discountType: 'lightning' | 'suggest') => void
) => {
  // 추천 가능한 상품 찾기
  const findSuggestableProduct = useCallback((lastSelectedProductId: string) => {
    return PRODUCT_LIST.find(
      (product) =>
        product.id !== lastSelectedProductId && product.quantity > 0 && !product.suggestSale
    );
  }, []);

  // 타이머 시작
  useEffect(() => {
    // 번개 세일 타이머
    const lightningDelay = Math.random() * TIMER_INTERVALS.LIGHTNING_DELAY;
    const lightningTimeout = setTimeout(() => {
      const lightningInterval = setInterval(() => {
        const luckyIndex = Math.floor(Math.random() * PRODUCT_LIST.length);
        const luckyItem = PRODUCT_LIST[luckyIndex];
        if (luckyItem.quantity > 0 && !luckyItem.onSale) {
          if (onApplyDiscount) {
            onApplyDiscount(luckyItem.id, 'lightning');
          }
          alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          onUpdateProductList();
          onUpdateCalculation();
        }
      }, TIMER_INTERVALS.LIGHTNING_SALE);

      return () => clearInterval(lightningInterval);
    }, lightningDelay);

    // 추천 세일 타이머
    const suggestDelay = Math.random() * TIMER_INTERVALS.SUGGEST_DELAY;
    const suggestTimeout = setTimeout(() => {
      const suggestInterval = setInterval(() => {
        if (cartItems.length === 0) {
          return;
        }
        if (lastSelectedProduct) {
          const suggestedProduct = findSuggestableProduct(lastSelectedProduct);
          if (suggestedProduct) {
            if (onApplyDiscount) {
              onApplyDiscount(suggestedProduct.id, 'suggest');
            }
            alert(`💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            onUpdateProductList();
            onUpdateCalculation();
          }
        }
      }, TIMER_INTERVALS.SUGGEST_SALE);

      return () => clearInterval(suggestInterval);
    }, suggestDelay);

    return () => {
      clearTimeout(lightningTimeout);
      clearTimeout(suggestTimeout);
    };
  }, [
    cartItems,
    lastSelectedProduct,
    onUpdateProductList,
    onUpdateCalculation,
    onApplyDiscount,
    findSuggestableProduct,
  ]);

  return {
    findSuggestableProduct,
  };
};
