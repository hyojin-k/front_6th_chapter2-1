import { findProductById, findCartItem, addCartItem, getCartChildren } from './cartUtils';
import { QUANTITY_THRESHOLDS } from '../constants';

// 장바구니 클릭 이벤트 설정
export function setupCartClickHandler(
  cartContainer,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
  PRODUCT_LIST
) {
  cartContainer.addEventListener('click', function (event) {
    let tgt = event.target;
    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = findProductById(PRODUCT_LIST, prodId);

      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const qtyElem = itemElem.querySelector('.quantity-number');
        const currentQty = parseInt(qtyElem.textContent);
        const newQty = currentQty + qtyChange;
        if (newQty > 0 && newQty <= prod.quantity + currentQty) {
          qtyElem.textContent = newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          prod.quantity += currentQty;
          itemElem.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const qtyElem = itemElem.querySelector('.quantity-number');
        const remQty = parseInt(qtyElem.textContent);
        prod.quantity += remQty;
        itemElem.remove();
      }
      if (prod && prod.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      }
      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}

// 장바구니 추가 처리
export function handleAddToCart(selectedValue, cartElement, productList, CartItem) {
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
    const qtyElem = existingItem.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + 1;

    if (newQty > itemToAdd.quantity + currentQty) {
      return { success: false, error: '재고가 부족합니다.' };
    }

    qtyElem.textContent = newQty;
    itemToAdd.quantity--;
  } else {
    const newItem = CartItem(itemToAdd);
    addCartItem(cartElement, newItem);
    itemToAdd.quantity--;
  }

  return { success: true };
}
