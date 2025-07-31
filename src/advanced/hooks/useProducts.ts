import { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { PRODUCT_LIST } from '../constants/data';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([...PRODUCT_LIST]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  // 상품 선택
  const selectProduct = useCallback((productId: string) => {
    setSelectedProduct(productId);
  }, []);

  // 상품 목록 업데이트 (타이머에서 호출)
  const updateProductList = useCallback(() => {
    setProducts([...PRODUCT_LIST]);
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
            if (discountType === 'lightning' && !product.onSale) {
              return {
                ...product,
                onSale: true,
                originalPrice: product.price,
                price: Math.round(product.price * 0.8), // 20% 할인
              };
            } else if (discountType === 'suggest' && !product.suggestSale) {
              return {
                ...product,
                suggestSale: true,
                originalPrice: product.price,
                price: Math.round(product.price * 0.95), // 5% 할인
              };
            }
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
  };
};
