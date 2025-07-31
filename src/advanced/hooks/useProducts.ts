import { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { PRODUCT_LIST } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>(PRODUCT_LIST);
  const [selectedProduct, setSelectedProduct] = useState<string>('p1');

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
            return {
              ...product,
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
    selectProduct,
    updateProductList,
    updateProductStock,
    applyProductDiscount,
  };
};
