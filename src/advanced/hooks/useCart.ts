import { useState, useCallback } from 'react';
import { CartItemType, ProductType, CalculationResultType } from '../types';
import { calculateCartTotals } from '../utils/calculationUtils';

export const useCart = (
  products: ProductType[],
  updateProductStock: (productId: string, change: number) => void
) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [calculationResult, setCalculationResult] = useState<CalculationResultType>({
    totalAmount: 0,
    itemCount: 0,
    subtotal: 0,
    originalTotal: 0,
    itemDiscounts: [],
    lowStockItems: [],
    discountRate: 0,
    isTuesday: false,
    bonusPoints: { finalPoints: 0, pointsDetail: [] },
  });

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        alert('상품을 찾을 수 없습니다.');
        return false;
      }

      if (product.quantity === 0) {
        alert('품절된 상품입니다.');
        return false;
      }

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === productId);
        if (existingItem) {
          return prev.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prev, { id: productId, quantity: 1, product }];
        }
      });

      // 재고 감소
      updateProductStock(productId, -1);

      return true;
    },
    [products, updateProductStock]
  );

  // 장바구니 아이템 수량 변경
  const updateQuantity = useCallback(
    (productId: string, change: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === productId);
        if (!existingItem) return prev;

        const newQuantity = existingItem.quantity + change;

        // 수량이 0 이하가 되면 아이템 제거
        if (newQuantity <= 0) {
          // 재고 복구
          updateProductStock(productId, existingItem.quantity);
          return prev.filter((item) => item.id !== productId);
        }

        // 재고 확인
        const currentStock = product.quantity + (change > 0 ? 0 : existingItem.quantity);
        if (change > 0 && currentStock < newQuantity) {
          alert('재고가 부족합니다.');
          return prev;
        }

        // 재고 업데이트
        updateProductStock(productId, -change);

        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      });
    },
    [products, updateProductStock]
  );

  // 장바구니 아이템 제거
  const removeItem = useCallback(
    (productId: string) => {
      setCartItems((prev) => {
        const itemToRemove = prev.find((item) => item.id === productId);
        if (itemToRemove) {
          // 재고 복구
          updateProductStock(productId, itemToRemove.quantity);
        }
        return prev.filter((item) => item.id !== productId);
      });
    },
    [updateProductStock]
  );

  // 계산 결과 업데이트
  const updateCalculation = useCallback(() => {
    const result = calculateCartTotals(cartItems, products);
    setCalculationResult(result);
  }, [cartItems, products]);

  return {
    cartItems,
    calculationResult,
    addToCart,
    updateQuantity,
    removeItem,
    updateCalculation,
  };
};
