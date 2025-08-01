import React from 'react';
import { ProductType } from '../../types';

export interface ProductDropdownPropsType {
  value: string;
  onChange: (value: string) => void;
  products: ProductType[];
  disabled?: boolean;
}

const ProductDropdown: React.FC<ProductDropdownPropsType> = ({
  value,
  onChange,
  products,
  disabled = false,
}) => {
  const generateProductName = (product: ProductType): string => {
    return product.name;
  };

  const generatePriceText = (product: ProductType): string => {
    const currentPrice = product.price;
    const originalPrice = product.originalPrice;

    if (currentPrice < originalPrice) {
      return `₩${currentPrice.toLocaleString()} (할인)`;
    }

    return `₩${currentPrice.toLocaleString()}`;
  };

  const formatProductOption = (product: ProductType) => {
    const productName = generateProductName(product);
    const price = generatePriceText(product);

    // 할인 아이콘 추가
    let discountIcon = '';
    if (product.onSale && product.suggestSale) {
      discountIcon = '⚡💝 '; // 번개세일 + 추천할인
    } else if (product.onSale) {
      discountIcon = '⚡ '; // 번개세일
    } else if (product.suggestSale) {
      discountIcon = '💝 '; // 추천할인
    }

    return `${discountIcon}${productName} - ${price}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find((p) => p.id === selectedProductId);

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
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
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
