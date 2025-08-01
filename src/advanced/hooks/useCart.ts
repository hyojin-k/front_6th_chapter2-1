import { useState, useCallback, useMemo } from 'react';
import {
  CartItemType,
  ProductType,
  CalculationResultType,
  BonusPointsInfoType,
  ProductCountsType,
  DiscountInfoType,
} from '../types';
import {
  POINT_RATES,
  WEEKDAYS,
  QUANTITY_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  DISCOUNT_RATES,
} from '../constants';

export const useCart = (
  products: ProductType[],
  updateProductStock: (productId: string, change: number) => void
) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // 장바구니 관련 유틸리티 함수들
  const findProductById = useCallback(
    (productList: ProductType[], id: string): ProductType | undefined => {
      return productList.find((product) => product.id === id);
    },
    []
  );

  const appendCartItem = useCallback((cartContainer: HTMLElement, item: HTMLElement): void => {
    cartContainer.appendChild(item);
  }, []);

  const findCartItem = useCallback(
    (cartContainer: HTMLElement, productId: string): Element | null => {
      return cartContainer.querySelector(`#${productId}`);
    },
    []
  );

  const getCartChildren = useCallback((cartContainer: HTMLElement): HTMLCollection => {
    return cartContainer.children;
  }, []);

  // 재고 관련 함수들
  const getTotalStock = useCallback((productList: ProductType[]): number => {
    return productList.reduce((sum, product) => sum + product.quantity, 0);
  }, []);

  const findLowStockItems = useCallback((productList: ProductType[]): string[] => {
    return productList
      .filter((product) => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK && product.quantity > 0)
      .map((product) => product.name);
  }, []);

  const getStockMessage = useCallback((productList: ProductType[]): string => {
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
  }, []);

  // 수량 계산 함수들
  const calculateTotal = useCallback((cartItems: CartItemType[]): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, []);

  const getProductCounts = useCallback(
    (cartItems: CartItemType[], productList: ProductType[]): ProductCountsType => {
      return cartItems.reduce((counts, cartItem) => {
        const product = productList.find((p) => p.id === cartItem.id);
        if (product) {
          counts[product.id] = (counts[product.id] || 0) + cartItem.quantity;
        }
        return counts;
      }, {} as ProductCountsType);
    },
    []
  );

  // 개별 상품 할인 계산
  const calculateIndividualDiscount = useCallback((product: ProductType, quantity: number) => {
    let applicable = false;
    let rate = 0;

    // 개별 상품 할인 (5개 이상 구매 시 10% 할인)
    if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
      applicable = true;
      rate = DISCOUNT_RATES[product.id] || 0;
    }

    return { applicable, rate };
  }, []);

  // 장바구니 아이템별 계산 및 개별 할인 적용
  const calculateCartItemTotals = useCallback(
    (cartItems: CartItemType[], productList: ProductType[]) => {
      const itemCalculations = cartItems
        .map((cartItem) => {
          const product = productList.find((p) => p.id === cartItem.id);
          if (!product) return null;

          const quantity = cartItem.quantity;
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
        .filter((item) => item !== null) as Array<{
        quantity: number;
        itemTotal: number;
        discountedTotal: number;
        discount: { name: string; discount: number } | null;
      }>;

      return itemCalculations.reduce(
        (acc, item) => ({
          totalAmount: acc.totalAmount + item.discountedTotal,
          itemCount: acc.itemCount + item.quantity,
          subtotal: acc.subtotal + item.itemTotal,
          itemDiscounts: item.discount ? [...acc.itemDiscounts, item.discount] : acc.itemDiscounts,
        }),
        {
          totalAmount: 0,
          itemCount: 0,
          subtotal: 0,
          itemDiscounts: [] as Array<{ name: string; discount: number }>,
        }
      );
    },
    [calculateIndividualDiscount]
  );

  // 대량 할인 계산
  const calculateBulkDiscount = useCallback((itemCount: number, subtotal: number) => {
    let applicable = false;
    let rate = 0;
    let finalAmount = subtotal;

    if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
      applicable = true;
      rate = DISCOUNT_RATES.BULK;
      finalAmount = subtotal * (1 - DISCOUNT_RATES.BULK);
    } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
      applicable = true;
      rate = 0.2;
      finalAmount = subtotal * 0.8;
    } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
      applicable = true;
      rate = 0.1;
      finalAmount = subtotal * 0.9;
    }

    return { applicable, rate, finalAmount };
  }, []);

  // 대량 구매 할인 적용
  const applyBulkDiscount = useCallback(
    (totalAmount: number, subtotal: number, itemCount: number) => {
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
    },
    [calculateBulkDiscount]
  );

  // 화요일 할인 계산
  const calculateTuesdayDiscount = useCallback((totalAmount: number) => {
    const today = new Date().getDay();
    const isTuesday = today === WEEKDAYS.TUESDAY;
    const applicable = isTuesday;
    const finalAmount = applicable ? totalAmount * (1 - DISCOUNT_RATES.TUESDAY) : totalAmount;

    return { applicable, finalAmount, isTuesday };
  }, []);

  // 화요일 할인 적용
  const applyTuesdayDiscount = useCallback(
    (totalAmount: number, originalTotal: number) => {
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
    },
    [calculateTuesdayDiscount]
  );

  // 상품 조합 보너스 포인트 계산
  const calculateCombinationBonus = useCallback(
    (cartItems: CartItemType[], productList: ProductType[], pointsDetail: string[]): number => {
      const productCounts = getProductCounts(cartItems, productList);
      const hasKeyboard = productCounts[KEYBOARD] > 0;
      const hasMouse = productCounts[MOUSE] > 0;
      const hasMonitorArm = productCounts[MONITOR_ARM] > 0;

      let bonusPoints = 0;

      // 키보드 + 마우스 조합
      if (hasKeyboard && hasMouse) {
        bonusPoints += POINT_RATES.SET_KEYBOARD_MOUSE;
        pointsDetail.push('키보드+마우스 조합');
      }

      // 키보드 + 마우스 + 모니터암 조합
      if (hasKeyboard && hasMouse && hasMonitorArm) {
        bonusPoints += POINT_RATES.SET_KEYBOARD_MOUSE_MONITOR_ARM;
        pointsDetail.push('키보드+마우스+모니터암 조합');
      }

      return bonusPoints;
    },
    [getProductCounts]
  );

  // 대량 구매 보너스 포인트 계산
  const calculateBulkPurchaseBonus = useCallback(
    (itemCount: number, pointsDetail: string[]): number => {
      let bonusPoints = 0;

      if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
        bonusPoints += POINT_RATES.BULK_30;
        pointsDetail.push('대량구매 30개+');
      } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
        bonusPoints += POINT_RATES.BULK_20;
        pointsDetail.push('대량구매 20개+');
      } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
        bonusPoints += POINT_RATES.BULK_10;
        pointsDetail.push('대량구매 10개+');
      }

      return bonusPoints;
    },
    []
  );

  // 보너스 포인트 계산
  const calculateBonusPoints = useCallback(
    (
      cartItems: CartItemType[],
      totalAmount: number,
      itemCount: number,
      productList: ProductType[]
    ): BonusPointsInfoType => {
      if (cartItems.length === 0) {
        return { finalPoints: 0, pointsDetail: [] };
      }

      // 기본 포인트 계산 (0.1% = 1,000원당 1포인트)
      const basePoints = Math.floor(totalAmount * POINT_RATES.DEFAULT);
      let finalPoints = 0;
      const pointsDetail: string[] = [];

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

      const result: BonusPointsInfoType = { finalPoints, pointsDetail };

      return result;
    },
    [calculateCombinationBonus, calculateBulkPurchaseBonus]
  );

  // 장바구니 총합 계산 (메인 함수)
  const calculateCartTotals = useCallback(
    (cartItems: CartItemType[], productList: ProductType[]): CalculationResultType => {
      const lowStockItems = findLowStockItems(productList);
      const itemTotals = calculateCartItemTotals(cartItems, productList);
      const originalTotal = itemTotals.subtotal;

      const bulkDiscountResult = applyBulkDiscount(
        itemTotals.totalAmount,
        itemTotals.subtotal,
        itemTotals.itemCount
      );
      const tuesdayDiscountResult = applyTuesdayDiscount(
        bulkDiscountResult.finalAmount,
        originalTotal
      );

      // 보너스 포인트도 함께 계산하여 중복 계산 방지
      const bonusPoints = calculateBonusPoints(
        cartItems,
        tuesdayDiscountResult.finalAmount,
        itemTotals.itemCount,
        productList
      );

      const itemDiscounts: DiscountInfoType[] = itemTotals.itemDiscounts.map((discount) => ({
        type: 'individual',
        name: discount.name,
        rate: discount.discount / 100,
        color: 'blue',
      }));

      return {
        totalAmount: tuesdayDiscountResult.finalAmount,
        itemCount: itemTotals.itemCount,
        subtotal: itemTotals.subtotal,
        originalTotal,
        itemDiscounts,
        lowStockItems,
        discountRate: tuesdayDiscountResult.discountRate,
        isTuesday: tuesdayDiscountResult.isTuesday,
        bonusPoints,
      };
    },
    [
      findLowStockItems,
      calculateCartItemTotals,
      applyBulkDiscount,
      applyTuesdayDiscount,
      calculateBonusPoints,
    ]
  );

  // 계산 결과를 메모이제이션
  const calculationResult = useMemo(() => {
    return calculateCartTotals(cartItems, products);
  }, [cartItems, products, calculateCartTotals]);

  // 상품 찾기 함수 메모이제이션
  const findProduct = useCallback(
    (productId: string) => {
      return products.find((p) => p.id === productId);
    },
    [products]
  );

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      const product = findProduct(productId);
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
    [findProduct, updateProductStock]
  );

  // 장바구니 아이템 수량 변경
  const updateQuantity = useCallback(
    (productId: string, change: number) => {
      const product = findProduct(productId);
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
    [findProduct, updateProductStock]
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

  const updateCalculation = useCallback(() => {}, []);

  return {
    cartItems,
    calculationResult,
    addToCart,
    updateQuantity,
    removeItem,
    updateCalculation,
    // 계산 관련 함수들도 외부에서 사용할 수 있도록 노출
    getTotalStock,
    getStockMessage,
    calculateTotal,
    getProductCounts,
    calculateBonusPoints,
    // 장바구니 유틸리티 함수들
    findProductById,
    appendCartItem,
    findCartItem,
    getCartChildren,
  };
};
