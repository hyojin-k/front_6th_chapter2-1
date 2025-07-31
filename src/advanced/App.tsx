import React, { useEffect } from 'react';
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
    selectProduct,
    updateProductList,
    applyProductDiscount,
    updateProductStock,
  } = useProducts();

  const { cartItems, calculationResult, addToCart, updateQuantity, removeItem, updateCalculation } =
    useCart(products, updateProductStock);

  const { isManualOpen, openManual, closeManual } = useManual();

  // 타이머 설정
  useTimers(updateProductList, updateCalculation, cartItems, selectedProduct, applyProductDiscount);

  // 계산 결과 업데이트
  useEffect(() => {
    updateCalculation();
  }, [cartItems, updateCalculation]);

  // 장바구니에 상품 추가 핸들러
  const handleAddToCart = () => {
    if (!selectedProduct) {
      alert('상품을 선택해주세요.');
      return;
    }

    const success = addToCart(selectedProduct);
    if (success) {
      // 성공적으로 추가된 경우 추가 로직이 필요하면 여기에 작성
    }
  };

  // 장바구니 아이템 수량 변경 핸들러
  const handleQuantityChange = (productId: string, change: number) => {
    updateQuantity(productId, change);
  };

  // 장바구니 아이템 제거 핸들러
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  // 상품 선택 핸들러
  const handleProductSelect = (productId: string) => {
    selectProduct(productId);
  };

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

        <OrderSummary calculationResult={calculationResult} cartItems={cartItems} />
      </GridContainer>

      <ManualToggle onToggle={openManual} />

      <ManualOverlay isOpen={isManualOpen} onClose={closeManual}>
        <Manual isOpen={isManualOpen} onClose={closeManual} />
      </ManualOverlay>
    </>
  );
};

export default App;
