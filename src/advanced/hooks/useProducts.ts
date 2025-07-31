import { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { PRODUCT_LIST } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>(PRODUCT_LIST);
  const [selectedProduct, setSelectedProduct] = useState<string>('p1'); // 키보드로 초기 설정

  // 상품 아이콘 생성
  const generateProductIcon = useCallback((product: ProductType): string => {
    const icons = {
      p1: '⌨️',
      p2: '🖱️',
      p3: '🖥️',
      p4: '💼',
      p5: '🔊',
    };
    return icons[product.id as keyof typeof icons] || '📦';
  }, []);

  // 가격 색상 결정
  const getPriceColor = useCallback((product: ProductType): string => {
    if (product.onSale && product.suggestSale) {
      return 'text-purple-600 font-bold'; // 번개세일 + 추천할인
    } else if (product.onSale) {
      return 'text-red-600 font-bold'; // 번개세일
    } else if (product.suggestSale) {
      return 'text-blue-600 font-bold'; // 추천할인
    }
    return 'text-black';
  }, []);

  // 가격 HTML 생성
  const generatePriceHtml = useCallback(
    (product: ProductType): string => {
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
    },
    [getPriceColor]
  );

  // 상품명 생성
  const generateProductName = useCallback((product: ProductType): string => {
    return product.name;
  }, []);

  // 가격 텍스트 생성
  const generatePriceText = useCallback((product: ProductType): string => {
    const currentPrice = product.price;
    const originalPrice = product.originalPrice;

    if (currentPrice < originalPrice) {
      return `₩${currentPrice.toLocaleString()} (할인)`;
    }

    return `₩${currentPrice.toLocaleString()}`;
  }, []);

  // 할인 여부 확인
  const hasDiscount = useCallback((product: ProductType): boolean => {
    return product.price < product.originalPrice;
  }, []);

  // 원가 가져오기
  const getOriginalPrice = useCallback((product: ProductType): number => {
    return product.originalPrice;
  }, []);

  // 현재 가격 가져오기
  const getCurrentPrice = useCallback((product: ProductType): number => {
    return product.price;
  }, []);

  // 상품 선택
  const selectProduct = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (product && product.quantity > 0) {
        setSelectedProduct(productId);
      }
    },
    [products]
  );

  // 상품 목록 업데이트
  const updateProductList = useCallback((newProductList: ProductType[]) => {
    setProducts(newProductList);
  }, []);

  // 상품 재고 업데이트
  const updateProductStock = useCallback((productId: string, change: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    );
  }, []);

  // 상품 할인 적용
  const applyProductDiscount = useCallback(
    (productId: string, discountType: 'lightning' | 'suggest') => {
      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            let newPrice = product.price;
            let newOriginalPrice = product.originalPrice;

            if (discountType === 'lightning') {
              // 번개세일: 20% 할인
              newPrice = Math.round(product.price * 0.8);
              newOriginalPrice = product.price;
            } else if (discountType === 'suggest') {
              // 추천할인: 5% 할인
              newPrice = Math.round(product.price * 0.95);
              newOriginalPrice = product.price;
            }

            return {
              ...product,
              onSale: discountType === 'lightning',
              suggestSale: discountType === 'suggest',
              price: newPrice,
              originalPrice: newOriginalPrice,
            };
          }
          return product;
        })
      );
    },
    []
  );

  return {
    products,
    selectedProduct,
    selectProduct,
    updateProductList,
    updateProductStock,
    applyProductDiscount,
    // 가격 관련 함수들도 외부에서 사용할 수 있도록 노출
    generateProductIcon,
    getPriceColor,
    generatePriceHtml,
    generateProductName,
    generatePriceText,
    hasDiscount,
    getOriginalPrice,
    getCurrentPrice,
  };
};
