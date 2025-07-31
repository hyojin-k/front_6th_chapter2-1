import { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { PRODUCT_LIST } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>(PRODUCT_LIST);
  const [selectedProduct, setSelectedProduct] = useState<string>('p1'); // 키보드로 기본값 설정
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string>('p1'); // 마지막 선택된 상품

  // 가격 색상 결정
  const getPriceColor = useCallback((product: ProductType): string => {
    if (product.onSale) {
      return 'text-red-500';
    }
    if (product.suggestSale) {
      return 'text-blue-500';
    }
    return 'text-black';
  }, []);

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
        setLastSelectedProduct(selectedProduct); // 이전 선택을 저장
        setSelectedProduct(productId);
      }
    },
    [products, selectedProduct]
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
              price: newPrice,
              originalPrice: newOriginalPrice,
              onSale: discountType === 'lightning',
              suggestSale: discountType === 'suggest',
            };
          }
          return product;
        })
      );
    },
    []
  );

  // 상품 할인 해제
  const removeProductDiscount = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            price: product.originalPrice,
            onSale: false,
            suggestSale: false,
          };
        }
        return product;
      })
    );
  }, []);

  // 상품 찾기
  const findProductById = useCallback(
    (productId: string): ProductType | undefined => {
      return products.find((product) => product.id === productId);
    },
    [products]
  );

  // 상품 목록 가져오기
  const getProductList = useCallback((): ProductType[] => {
    return products;
  }, [products]);

  // 선택된 상품 가져오기
  const getSelectedProduct = useCallback((): ProductType | null => {
    if (!selectedProduct) return null;
    return products.find((product) => product.id === selectedProduct) || null;
  }, [selectedProduct, products]);

  // 상품 추가
  const addProduct = useCallback((newProduct: ProductType) => {
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  // 상품 삭제
  const removeProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  // 상품 업데이트
  const updateProduct = useCallback((productId: string, updates: Partial<ProductType>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
  }, []);

  // 재고 부족 상품 찾기
  const findLowStockProducts = useCallback((): ProductType[] => {
    return products.filter((product) => product.quantity <= 5);
  }, [products]);

  // 할인 상품 찾기
  const findDiscountedProducts = useCallback((): ProductType[] => {
    return products.filter((product) => product.onSale || product.suggestSale);
  }, [products]);

  return {
    products,
    selectedProduct,
    lastSelectedProduct,
    getPriceColor,
    generateProductName,
    generatePriceText,
    hasDiscount,
    getOriginalPrice,
    getCurrentPrice,
    selectProduct,
    updateProductList,
    updateProductStock,
    applyProductDiscount,
    removeProductDiscount,
    findProductById,
    getProductList,
    getSelectedProduct,
    addProduct,
    removeProduct,
    updateProduct,
    findLowStockProducts,
    findDiscountedProducts,
  };
};
