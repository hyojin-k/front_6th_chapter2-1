import React from 'react';
import { CartItemType } from '../../types';
import CartItem from './CartItem';

export interface CartDisplayPropsType {
  items: CartItemType[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  className?: string;
}

const CartDisplay: React.FC<CartDisplayPropsType> = ({
  items,
  onQuantityChange,
  onRemoveItem,
  className = '',
}) => {
  if (items.length === 0) {
    return (
      <div id="cart-items" className={`text-center py-8 text-gray-500 ${className}`}>
        장바구니가 비어있습니다.
      </div>
    );
  }

  return (
    <div id="cart-items" className={className}>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

export default React.memo(CartDisplay);
