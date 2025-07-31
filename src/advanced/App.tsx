import React, { useState, useEffect } from 'react';
import {
  Header,
  GridContainer,
  SelectItem,
  SelectorContainer,
  ProductDropdown,
  AddButton,
  StockInfo,
  CartDisplay,
  OrderSummary,
  Manual,
  ManualToggle,
  ManualOverlay,
} from './components';
import { PRODUCT_LIST } from './constants/data';
import { AppStateType, CartItemType, ProductType, CalculationResultType } from './types';

const App: React.FC = () => {
  // 앱 상태
  const [appState, setAppState] = useState<AppStateType>({
    bonusPoints: 0,
    itemCount: 0,
    lastSelectedProduct: null,
    totalAmount: 0,
  });

  // 장바구니 아이템들
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // 매뉴얼 열림 상태
  const [isManualOpen, setIsManualOpen] = useState(false);

  // 선택된 상품
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  // 계산 결과
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
  const handleAddToCart = () => {
    if (!selectedProduct) {
      alert('상품을 선택해주세요.');
      return;
    }

    const product = PRODUCT_LIST.find((p) => p.id === selectedProduct);
    if (!product) {
      alert('상품을 찾을 수 없습니다.');
      return;
    }

    if (product.quantity === 0) {
      alert('품절된 상품입니다.');
      return;
    }

    const existingItem = cartItems.find((item) => item.id === selectedProduct);

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === selectedProduct ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { id: selectedProduct, quantity: 1, product }]);
    }

    setAppState((prev) => ({ ...prev, lastSelectedProduct: selectedProduct }));
  };

  // 장바구니 아이템 수량 변경
  const handleQuantityChange = (productId: string, change: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === productId) {
              const newQuantity = item.quantity + change;
              if (newQuantity <= 0) {
                return null;
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as CartItemType[]
    );
  };

  // 장바구니 아이템 제거
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // 계산 함수 (간단한 버전)
  const calculateCartTotals = (
    items: CartItemType[],
    products: ProductType[]
  ): CalculationResultType => {
    let subtotal = 0;
    let itemCount = 0;
    const itemDiscounts: Array<{ name: string; discount: number }> = [];
    const lowStockItems: string[] = [];

    items.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        itemCount += item.quantity;

        // 재고 부족 체크
        if (product.quantity < 5) {
          lowStockItems.push(product.name);
        }
      }
    });

    // 화요일 할인 체크
    const isTuesday = new Date().getDay() === 2;
    const tuesdayDiscount = isTuesday ? 0.1 : 0;
    const totalAmount = subtotal * (1 - tuesdayDiscount);

    // 기본 포인트 계산
    const basePoints = Math.floor(totalAmount / 1000);
    const finalPoints = isTuesday ? basePoints * 2 : basePoints;

    return {
      totalAmount,
      itemCount,
      subtotal,
      originalTotal: subtotal,
      itemDiscounts,
      lowStockItems,
      discountRate: tuesdayDiscount,
      isTuesday,
      bonusPoints: {
        finalPoints,
        pointsDetail: basePoints > 0 ? ['기본: ' + basePoints + 'p'] : [],
      },
    };
  };

  // 계산 결과 업데이트
  useEffect(() => {
    const result = calculateCartTotals(cartItems, PRODUCT_LIST);
    setCalculationResult(result);
    setAppState((prev) => ({
      ...prev,
      totalAmount: result.totalAmount,
      itemCount: result.itemCount,
      bonusPoints: result.bonusPoints.finalPoints,
    }));
  }, [cartItems]);

  return (
    <>
      <Header />

      <GridContainer>
        <SelectItem>
          <SelectorContainer>
            <ProductDropdown
              value={selectedProduct}
              onChange={setSelectedProduct}
              products={PRODUCT_LIST}
            />
            <AddButton onClick={handleAddToCart} />
            <StockInfo products={PRODUCT_LIST} />
          </SelectorContainer>

          <CartDisplay
            items={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
        </SelectItem>

        <OrderSummary calculationResult={calculationResult} />
      </GridContainer>

      <ManualToggle onToggle={() => setIsManualOpen(true)} />

      <ManualOverlay isOpen={isManualOpen} onClose={() => setIsManualOpen(false)}>
        <Manual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      </ManualOverlay>
    </>
  );
};

export default App;
