import { ProductType } from '../types';
import { QUANTITY_THRESHOLDS } from '../constants';

// 상품 ID로 찾기
export const findProductById = (products: ProductType[], id: string): ProductType | undefined => {
  return products.find((product) => product.id === id);
};

// 재고 부족 상품 찾기
export const findLowStockProducts = (products: ProductType[]): ProductType[] => {
  return products.filter((product) => product.quantity <= QUANTITY_THRESHOLDS.LOW_STOCK);
};

// 재고 부족 상품명 목록
export const findLowStockItems = (products: ProductType[]): string[] => {
  return products
    .filter((product) => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK && product.quantity > 0)
    .map((product) => product.name);
};

// 재고 메시지 생성
export const getStockMessage = (products: ProductType[]): string => {
  return products
    .filter((item) => item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK)
    .map((item) => generateStockItemMessage(item))
    .join('\n');
};

// 개별 상품 재고 메시지 생성
const generateStockItemMessage = (item: ProductType): string => {
  if (item.quantity > 0) {
    return `${item.name}: 재고 부족 (${item.quantity}개 남음)`;
  }
  return `${item.name}: 품절`;
};

// 총 재고 계산
export const getTotalStock = (products: ProductType[]): number => {
  return products.reduce((sum, product) => sum + product.quantity, 0);
};

// 할인 상품 찾기
export const findDiscountedProducts = (products: ProductType[]): ProductType[] => {
  return products.filter((product) => product.onSale || product.suggestSale);
};

// 가격 색상 결정
export const getPriceColor = (product: ProductType): string => {
  if (product.onSale) {
    return 'text-red-500';
  }
  if (product.suggestSale) {
    return 'text-blue-500';
  }
  return 'text-black';
};

// 가격 텍스트 생성
export const generatePriceText = (product: ProductType): string => {
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;

  if (currentPrice < originalPrice) {
    return `₩${currentPrice.toLocaleString()} (할인)`;
  }

  return `₩${currentPrice.toLocaleString()}`;
};

// 할인 여부 확인
export const hasDiscount = (product: ProductType): boolean => {
  return product.price < product.originalPrice;
};
