import { useEffect, useCallback } from 'react';
import { CartItemType, ProductType } from '../types';
import { PRODUCT_LIST } from '../constants';

export const useTimers = (
  updateProductList: (newProductList: ProductType[]) => void,
  updateCalculation: () => void,
  cartItems: CartItemType[],
  lastSelectedProduct: string,
  onApplyDiscount: (productId: string, discountType: 'lightning' | 'suggest') => void
) => {
  // 번개세일 타이머
  const startLightningSaleTimer = useCallback(() => {
    const randomDelay = Math.random() * 10000; // 0~10초
    const lightningSaleTimer = setTimeout(() => {
      const availableProducts = PRODUCT_LIST.filter((product) => product.quantity > 0);
      if (availableProducts.length > 0) {
        const randomProduct =
          availableProducts[Math.floor(Math.random() * availableProducts.length)];
        onApplyDiscount(randomProduct.id, 'lightning');
        alert(`⚡ 번개세일! ${randomProduct.name} 20% 할인!`);
      }
    }, randomDelay);

    return lightningSaleTimer;
  }, [onApplyDiscount]);

  // 추천할인 타이머
  const startSuggestSaleTimer = useCallback(() => {
    const randomDelay = Math.random() * 20000; // 0~20초
    const suggestSaleTimer = setTimeout(() => {
      const availableProducts = PRODUCT_LIST.filter((product) => product.quantity > 0);
      if (availableProducts.length > 0) {
        const otherProducts = availableProducts.filter(
          (product) => product.id !== lastSelectedProduct
        );
        if (otherProducts.length > 0) {
          const randomProduct = otherProducts[Math.floor(Math.random() * otherProducts.length)];
          onApplyDiscount(randomProduct.id, 'suggest');
          alert(`💝 추천할인! ${randomProduct.name} 5% 추가 할인!`);
        }
      }
    }, randomDelay);

    return suggestSaleTimer;
  }, [lastSelectedProduct, onApplyDiscount]);

  useEffect(() => {
    // 초기 타이머 시작
    const lightningTimer = startLightningSaleTimer();
    const suggestTimer = startSuggestSaleTimer();

    // 30초마다 번개세일
    const lightningInterval = setInterval(() => {
      const availableProducts = PRODUCT_LIST.filter((product) => product.quantity > 0);
      if (availableProducts.length > 0) {
        const randomProduct =
          availableProducts[Math.floor(Math.random() * availableProducts.length)];
        onApplyDiscount(randomProduct.id, 'lightning');
        alert(`⚡ 번개세일! ${randomProduct.name} 20% 할인!`);
      }
    }, 30000);

    // 60초마다 추천할인
    const suggestInterval = setInterval(() => {
      const availableProducts = PRODUCT_LIST.filter((product) => product.quantity > 0);
      if (availableProducts.length > 0) {
        const otherProducts = availableProducts.filter(
          (product) => product.id !== lastSelectedProduct
        );
        if (otherProducts.length > 0) {
          const randomProduct = otherProducts[Math.floor(Math.random() * otherProducts.length)];
          onApplyDiscount(randomProduct.id, 'suggest');
          alert(`💝 추천할인! ${randomProduct.name} 5% 추가 할인!`);
        }
      }
    }, 60000);

    // 계산 결과 업데이트
    updateCalculation();

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestTimer);
      clearInterval(lightningInterval);
      clearInterval(suggestInterval);
    };
  }, [
    startLightningSaleTimer,
    startSuggestSaleTimer,
    updateCalculation,
    lastSelectedProduct,
    onApplyDiscount,
  ]);
};
