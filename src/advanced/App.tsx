import React, { useCallback } from 'react';
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
import { useCart, useProducts, useTimers, useManual } from './hooks';

const App: React.FC = () => {
  // 커스텀 훅들 사용
  const {
    products,
    selectedProduct,
    lastSelectedProduct,
    selectProduct,
    updateProductList,
    applyProductDiscount,
    updateProductStock,
  } = useProducts();

  const { cartItems, calculationResult, addToCart, updateQuantity, removeItem, updateCalculation } =
    useCart(products, updateProductStock);

  const { isManualOpen, openManual, closeManual } = useManual();

  // 타이머 설정
  useTimers(
    updateProductList,
    updateCalculation,
    cartItems,
    selectedProduct,
    lastSelectedProduct,
    applyProductDiscount
  );

  // 장바구니에 상품 추가 핸들러 (메모이제이션)
  const handleAddToCart = useCallback(() => {
    const success = addToCart(selectedProduct);
    if (success) {
      // 성공적으로 추가된 경우 추가 로직이 필요하면 여기에 작성
    }
  }, [selectedProduct, addToCart]);

  // 장바구니 아이템 수량 변경 핸들러 (메모이제이션)
  const handleQuantityChange = useCallback(
    (productId: string, change: number) => {
      updateQuantity(productId, change);
    },
    [updateQuantity]
  );

  // 장바구니 아이템 제거 핸들러 (메모이제이션)
  const handleRemoveItem = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  // 상품 선택 핸들러 (메모이제이션)
  const handleProductSelect = useCallback(
    (productId: string) => {
      selectProduct(productId);
    },
    [selectProduct]
  );

  return (
    <>
      <Header itemCount={calculationResult.itemCount} />

      <GridContainer>
        <SelectItem>
          <SelectorContainer>
            <ProductDropdown
              value={selectedProduct}
              onChange={handleProductSelect}
              products={products}
            />
            <AddButton onClick={handleAddToCart} />
            <StockInfo products={products} />
          </SelectorContainer>

          <CartDisplay
            items={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
        </SelectItem>

        <OrderSummary
          calculationResult={calculationResult}
          cartItems={cartItems}
          products={products}
        />
      </GridContainer>

      <ManualToggle onToggle={openManual} />

      <ManualOverlay isOpen={isManualOpen} onClose={closeManual}>
        <Manual isOpen={isManualOpen} onClose={closeManual} />
      </ManualOverlay>
    </>
  );
};

export default React.memo(App);
