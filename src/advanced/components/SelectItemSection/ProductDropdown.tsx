import React from 'react';
import { ProductType } from '../../types';

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
  return (
    <select
      id="product-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${className}`}
    >
      <option value="">상품을 선택하세요</option>
      {products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name} - {product.price.toLocaleString()}원
        </option>
      ))}
    </select>
  );
};

export default ProductDropdown;
