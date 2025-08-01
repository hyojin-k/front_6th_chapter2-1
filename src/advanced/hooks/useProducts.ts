import { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { PRODUCT_LIST, DISCOUNT_RATES } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>(PRODUCT_LIST);
  const [selectedProduct, setSelectedProduct] = useState<string>('p1');
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string>('p1');

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
              newPrice = Math.round(product.price * (1 - DISCOUNT_RATES.LIGHTNING));
              newOriginalPrice = product.price;
            } else if (discountType === 'suggest') {
              // 추천할인: 5% 할인
              newPrice = Math.round(product.price * (1 - DISCOUNT_RATES.SUGGEST));
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

  return {
    products,
    selectedProduct,
    lastSelectedProduct,
    selectProduct,
    updateProductList,
    updateProductStock,
    applyProductDiscount,
  };
};
