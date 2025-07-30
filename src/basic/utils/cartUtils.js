// 상품 ID로 상품 찾기
export function findProductById(productList, id) {
  return productList.find((product) => product.id === id);
}

// 장바구니 아이템 추가
export function appendCartItem(cartContainer, item) {
  cartContainer.appendChild(item);
}

// 장바구니 아이템 찾기
export function findCartItem(cartContainer, productId) {
  return cartContainer.querySelector(`#${productId}`);
}

// 장바구니의 모든 자식 요소
export function getCartChildren(cartContainer) {
  return cartContainer.children;
}
