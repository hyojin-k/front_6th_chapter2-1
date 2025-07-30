import { findProductById, findCartItem, appendCartItem } from './cartUtils';

// 장바구니 클릭 이벤트 설정
export function initCartClickHandler(
  cartContainer,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
  PRODUCT_LIST
) {
  cartContainer.addEventListener('click', function (event) {
    let targetElement = event.target;
    if (
      targetElement.classList.contains('quantity-change') ||
      targetElement.classList.contains('remove-item')
    ) {
      const productId = targetElement.dataset.productId;
      const itemElement = document.getElementById(productId);
      const product = findProductById(PRODUCT_LIST, productId);

      if (targetElement.classList.contains('quantity-change')) {
        const quantityChange = parseInt(targetElement.dataset.change);
        const quantityElement = itemElement.querySelector('.quantity-number');
        const currentQuantity = parseInt(quantityElement.textContent);
        const newQuantity = currentQuantity + quantityChange;
        if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
          quantityElement.textContent = newQuantity;
          product.quantity -= quantityChange;
        } else if (newQuantity <= 0) {
          product.quantity += currentQuantity;
          itemElement.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (targetElement.classList.contains('remove-item')) {
        const quantityElement = itemElement.querySelector('.quantity-number');
        const removedQuantity = parseInt(quantityElement.textContent);
        product.quantity += removedQuantity;
        itemElement.remove();
      }
      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}

// 장바구니 추가 처리
export function addToCart(selectedValue, cartElement, productList, CartItem) {
  if (!selectedValue) {
    return { success: false };
  }

  const itemToAdd = findProductById(productList, selectedValue);
  if (!itemToAdd) {
    return { success: false };
  }

  if (itemToAdd.quantity <= 0) {
    return { success: false, error: '재고가 부족합니다.' };
  }

  const existingItem = findCartItem(cartElement, itemToAdd.id);
  if (existingItem) {
    const quantityElement = existingItem.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + 1;

    if (newQuantity > itemToAdd.quantity + currentQuantity) {
      return { success: false, error: '재고가 부족합니다.' };
    }

    quantityElement.textContent = newQuantity;
    itemToAdd.quantity--;
  } else {
    const newItem = CartItem(itemToAdd);
    appendCartItem(cartElement, newItem);
    itemToAdd.quantity--;
  }

  return { success: true };
}
