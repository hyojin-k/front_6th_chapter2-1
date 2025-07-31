import { ProductType } from '../types';

// 상품 ID로 상품 찾기
export function findProductById(productList: ProductType[], id: string): ProductType | undefined {
  return productList.find((product) => product.id === id);
}

// 장바구니 아이템 추가
export function appendCartItem(cartContainer: HTMLElement, item: HTMLElement): void {
  cartContainer.appendChild(item);
}

// 장바구니 아이템 찾기
export function findCartItem(cartContainer: HTMLElement, productId: string): Element | null {
  return cartContainer.querySelector(`#${productId}`);
}

// 장바구니의 모든 자식 요소
export function getCartChildren(cartContainer: HTMLElement): HTMLCollection {
  return cartContainer.children;
}
