import React from 'react';
import { CartItemType } from '../../types';
import CartItem from './CartItem';

export interface CartDisplayPropsType {
  items: CartItemType[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartDisplay: React.FC<CartDisplayPropsType> = ({ items, onQuantityChange, onRemoveItem }) => {
  return (
    <div id="cart-items">
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
