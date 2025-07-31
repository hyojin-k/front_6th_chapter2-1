import React from 'react';
import { ProductType } from '../../types';
import { generateProductName, generatePriceText } from '../../utils/priceUtils';

export interface ProductDropdownPropsType {
  value: string;
  onChange: (value: string) => void;
  products: ProductType[];
  className?: string;
  disabled?: boolean;
}

const ProductDropdown: React.FC<ProductDropdownPropsType> = ({
  value,
  onChange,
  products,
  className = '',
  disabled = false,
}) => {
  const formatProductOption = (product: ProductType) => {
    const productName = generateProductName(product);
    const price = generatePriceText(product);
    return `${productName} - ${price}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find((p) => p.id === selectedProductId);

    // 품절된 상품은 선택할 수 없음
    if (selectedProduct && selectedProduct.quantity === 0) {
      return;
    }

    onChange(selectedProductId);
  };

  return (
    <select
      id="product-select"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${className}`}
    >
      {products.map((product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {formatProductOption(product)}
          {product.quantity === 0 ? ' (품절)' : ''}
        </option>
      ))}
    </select>
  );
};

export default ProductDropdown;
