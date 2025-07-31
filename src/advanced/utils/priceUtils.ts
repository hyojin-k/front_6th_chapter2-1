import { ProductType } from '../types';

// 상품 아이콘 생성
export function generateProductIcon(product: ProductType): string {
  const icons = {
    p1: '⌨️',
    p2: '🖱️',
    p3: '🖥️',
    p4: '💼',
    p5: '🔊',
  };
  return icons[product.id as keyof typeof icons] || '📦';
}

// 가격 색상 결정
export function getPriceColor(product: ProductType): string {
  if (product.onSale && product.suggestSale) {
    return 'text-purple-600 font-bold'; // 번개세일 + 추천할인
  } else if (product.onSale) {
    return 'text-red-600 font-bold'; // 번개세일
  } else if (product.suggestSale) {
    return 'text-blue-600 font-bold'; // 추천할인
  }
  return 'text-black';
}

// 가격 HTML 생성
export function generatePriceHtml(product: ProductType): string {
  const priceColor = getPriceColor(product);
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;

  if (currentPrice < originalPrice) {
    return `
      <span class="${priceColor}">₩${currentPrice.toLocaleString()}</span>
      <span class="text-gray-500 line-through text-sm">₩${originalPrice.toLocaleString()}</span>
    `;
  }

  return `<span class="${priceColor}">₩${currentPrice.toLocaleString()}</span>`;
}

// 상품명 생성
export function generateProductName(product: ProductType): string {
  return product.name;
}

// 가격 텍스트 생성
export function generatePriceText(product: ProductType): string {
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;

  if (currentPrice < originalPrice) {
    return `₩${currentPrice.toLocaleString()} (할인)`;
  }

  return `₩${currentPrice.toLocaleString()}`;
}

// 할인 여부 확인
export function hasDiscount(product: ProductType): boolean {
  return product.price < product.originalPrice;
}

// 원가 가져오기
export function getOriginalPrice(product: ProductType): number {
  return product.originalPrice;
}

// 현재 가격 가져오기
export function getCurrentPrice(product: ProductType): number {
  return product.price;
}
