import React from 'react';
import { CalculationResultType, CartItemType } from '../../types';

export interface OrderSummaryPropsType {
  calculationResult: CalculationResultType;
  cartItems?: CartItemType[];
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryPropsType> = ({
  calculationResult,
  cartItems = [],
  className = '',
}) => {
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const formatDiscount = (discount: number) => {
    return `${discount}%`;
  };

  const buildCartItemsList = () => {
    if (calculationResult.itemCount === 0) return '';

    return (
      <div className="space-y-3">
        {cartItems.map((item) => {
          const itemTotal = item.product.price * item.quantity;
          return (
            <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{formatPrice(itemTotal)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const buildCartSubtotalHtml = () => {
    if (calculationResult.subtotal === 0) return null;

    return (
      <>
        <div className="border-t border-white/10 my-3"></div>
        <div className="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>{formatPrice(calculationResult.subtotal)}</span>
        </div>
      </>
    );
  };

  const buildCartDiscountHtml = () => {
    if (calculationResult.itemDiscounts.length === 0 && !calculationResult.isTuesday) return null;

    return (
      <div className="space-y-2">
        {calculationResult.itemDiscounts.map((discount, index) => (
          <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
            <span>
              {discount.name} ({formatDiscount(discount.discount)})
            </span>
            <span>-{formatPrice(calculationResult.subtotal - calculationResult.totalAmount)}</span>
          </div>
        ))}
        {calculationResult.isTuesday && (
          <div className="flex justify-between text-sm tracking-wide text-blue-400">
            <span>Tuesday Special (10%)</span>
            <span>
              -{formatPrice(calculationResult.originalTotal - calculationResult.totalAmount)}
            </span>
          </div>
        )}
      </div>
    );
  };

  const buildCartShippingHtml = () => {
    return (
      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    );
  };

  const buildDiscountInfoHtml = () => {
    if (calculationResult.discountRate === 0 || calculationResult.itemCount === 0) return null;

    const savedAmount = calculationResult.originalTotal - calculationResult.totalAmount;
    return (
      <div className="bg-green-500/20 rounded-lg p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span className="text-sm font-medium text-green-400">
            {(calculationResult.discountRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="text-2xs text-gray-300">
          {formatPrice(Math.round(savedAmount))} 할인되었습니다
        </div>
      </div>
    );
  };

  const buildBonusPointsHtml = () => {
    if (calculationResult.bonusPoints.finalPoints === 0 || calculationResult.itemCount === 0) {
      return null;
    }

    return (
      <div>
        <div>
          적립 포인트:{' '}
          <span className="font-bold">{calculationResult.bonusPoints.finalPoints}p</span>
        </div>
        <div className="text-2xs opacity-70 mt-1">
          {calculationResult.bonusPoints.pointsDetail.join(', ')}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-black text-white p-8 flex flex-col ${className}`}>
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {calculationResult.itemCount > 0 && (
            <>
              {buildCartItemsList()}
              {buildCartSubtotalHtml()}
              {buildCartDiscountHtml()}
              {buildCartShippingHtml()}
            </>
          )}
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4">
            {buildDiscountInfoHtml()}
          </div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                {formatPrice(calculationResult.totalAmount)}
              </div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              {buildBonusPointsHtml()}
            </div>
          </div>
          {calculationResult.isTuesday && calculationResult.totalAmount > 0 && (
            <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;
