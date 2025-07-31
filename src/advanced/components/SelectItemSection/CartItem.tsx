import React from 'react';
import { CartItemType } from '../../types';

export interface CartItemPropsType {
  item: CartItemType;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  className?: string;
}

const CartItem: React.FC<CartItemPropsType> = ({
  item,
  onQuantityChange,
  onRemoveItem,
  className = '',
}) => {
  const handleQuantityChange = (change: number) => {
    onQuantityChange(item.id, change);
  };

  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const generatePriceHtml = (product: any, showDiscount = false) => {
    if (showDiscount && product.originalPrice && product.originalPrice > product.price) {
      return `${formatPrice(product.price)}원`;
    }
    return `${formatPrice(product.price)}원`;
  };

  const generateProductName = (product: any) => {
    return product.name;
  };

  return (
    <div
      id={item.id}
      className={`grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0 ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {generateProductName(item.product)}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{generatePriceHtml(item.product, true)}</p>
        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          {generatePriceHtml(item.product, true)}
        </div>
        <button
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
