import React from 'react';
import { CalculationResultType } from '../../types';

export interface OrderSummaryPropsType {
  calculationResult: CalculationResultType;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryPropsType> = ({ calculationResult, className = '' }) => {
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const formatDiscount = (discount: number) => {
    return `${discount}%`;
  };

  return (
    <div className={`bg-black text-white p-8 flex flex-col ${className}`}>
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Subtotal</span>
            <div className="text-sm tracking-tight">{formatPrice(calculationResult.subtotal)}</div>
          </div>
          {calculationResult.itemDiscounts.length > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Discounts</span>
              <div className="text-sm tracking-tight text-green-400">
                -{formatPrice(calculationResult.subtotal - calculationResult.totalAmount)}
              </div>
            </div>
          )}
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Items</span>
            <div className="text-sm tracking-tight">{calculationResult.itemCount} items</div>
          </div>
        </div>
        <div className="mt-auto">
          {calculationResult.itemDiscounts.length > 0 && (
            <div id="discount-info" className="mb-4">
              <div className="text-xs text-blue-400">
                {calculationResult.itemDiscounts.map((discount, index) => (
                  <div key={index}>
                    {discount.name}: {formatDiscount(discount.discount)} 할인
                  </div>
                ))}
              </div>
            </div>
          )}
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                {formatPrice(calculationResult.totalAmount)}
              </div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: {calculationResult.bonusPoints.finalPoints}p
            </div>
          </div>
          {calculationResult.isTuesday && (
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
