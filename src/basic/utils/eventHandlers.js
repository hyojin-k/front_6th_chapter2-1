import { findProductById, findCartItem, appendCartItem } from './cartUtils';
import { findElementById, findQuantityElement, hasClass, setText, getQuantity } from './domHelpers';

/**
 * 이벤트 핸들러 관련 함수들
 */

// 장바구니 클릭 이벤트 설정
export function initCartClickHandler(
  cartContainer,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
  PRODUCT_LIST
) {
  cartContainer.addEventListener('click', (event) => {
    const targetElement = event.target;

    if (hasClass(targetElement, 'quantity-change') || hasClass(targetElement, 'remove-item')) {
      const productId = targetElement.dataset.productId;
      const itemElement = findElementById(productId);
      const product = findProductById(PRODUCT_LIST, productId);

      if (hasClass(targetElement, 'quantity-change')) {
        handleQuantityChange(targetElement, itemElement, product);
      } else if (hasClass(targetElement, 'remove-item')) {
        handleItemRemoval(itemElement, product);
      }

      // 계산 및 UI 업데이트
      executePostActionUpdates(handleCalculateCartStuff, onUpdateSelectOptions);
    }
  });
}

/**
 * 수량 변경 관련 함수들
 */

// 수량 변경 처리
function handleQuantityChange(targetElement, itemElement, product) {
  const quantityChange = parseInt(targetElement.dataset.change);
  const currentQuantity = getQuantity(itemElement);
  const newQuantity = currentQuantity + quantityChange;

  if (shouldRemoveItem(newQuantity)) {
    handleItemRemoval(itemElement, product);
  } else if (isValidQuantityChange(newQuantity, product, currentQuantity)) {
    updateItemQuantity(itemElement, newQuantity, product, quantityChange);
  } else {
    handleInsufficientStock();
  }
}

// 아이템 제거 여부 확인
function shouldRemoveItem(newQuantity) {
  return newQuantity <= 0;
}

// 수량 변경 유효성 검사
function isValidQuantityChange(newQuantity, product, currentQuantity) {
  return newQuantity > 0 && newQuantity <= product.quantity + currentQuantity;
}

// 아이템 수량 업데이트
function updateItemQuantity(itemElement, newQuantity, product, quantityChange) {
  setText(findQuantityElement(itemElement), newQuantity);
  product.quantity -= quantityChange;
}

// 재고 부족 처리
function handleInsufficientStock() {
  alert('재고가 부족합니다.');
}

// 아이템 제거 처리
function handleItemRemoval(itemElement, product) {
  const removedQuantity = getQuantity(itemElement);
  product.quantity += removedQuantity;
  itemElement.remove();
}

/**
 * 공통 업데이트 함수
 */

// 액션 후 업데이트 실행
function executePostActionUpdates(handleCalculateCartStuff, onUpdateSelectOptions) {
  handleCalculateCartStuff();
  onUpdateSelectOptions();
}

/**
 * 장바구니 추가 관련 함수들
 */

// 장바구니 추가 처리 (메인 함수)
export function addToCart(selectedValue, cartElement, productList, CartItem) {
  // 입력값 유효성 검사
  const validationResult = validateAddToCartInputs(selectedValue, productList);
  if (!validationResult.success) {
    return validationResult;
  }

  const itemToAdd = validationResult.product;
  const existingItem = findCartItem(cartElement, itemToAdd.id);

  if (existingItem) {
    return handleExistingItemAddition(existingItem, itemToAdd);
  } else {
    return handleNewItemAddition(itemToAdd, cartElement, CartItem);
  }
}

// 장바구니 추가 입력값 검증
function validateAddToCartInputs(selectedValue, productList) {
  if (!selectedValue) {
    return { success: false };
  }

  const product = findProductById(productList, selectedValue);
  if (!product) {
    return { success: false };
  }

  if (product.quantity <= 0) {
    return { success: false, error: '재고가 부족합니다.' };
  }

  return { success: true, product };
}

// 기존 아이템 수량 증가 처리
function handleExistingItemAddition(existingItem, itemToAdd) {
  const currentQuantity = getQuantity(existingItem);
  const newQuantity = currentQuantity + 1;

  if (newQuantity > itemToAdd.quantity + currentQuantity) {
    return { success: false, error: '재고가 부족합니다.' };
  }

  setText(findQuantityElement(existingItem), newQuantity);
  itemToAdd.quantity--;

  return { success: true };
}

// 새 아이템 추가 처리
function handleNewItemAddition(itemToAdd, cartElement, CartItem) {
  const newItem = CartItem(itemToAdd);
  appendCartItem(cartElement, newItem);
  itemToAdd.quantity--;

  return { success: true };
}
