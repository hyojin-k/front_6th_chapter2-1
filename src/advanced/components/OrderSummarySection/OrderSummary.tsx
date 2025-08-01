import React from 'react';
import { CalculationResultType, CartItemType, ProductType } from '../../types';
import { useDiscount } from '../../hooks/useDiscount';

export interface OrderSummaryPropsType {
  calculationResult: CalculationResultType;
  cartItems: CartItemType[];
  products: ProductType[];
}

const OrderSummary: React.FC<OrderSummaryPropsType> = ({
  calculationResult,
  cartItems,
  products,
}) => {
  const { calculateDiscountRate, calculateDiscountAmount, generateOrderSummaryDiscountInfo } =
    useDiscount();

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const formatDiscount = (discount: number) => {
    return `${discount}%`;
  };

  const result = calculationResult || {
    totalAmount: 0,
    itemCount: 0,
    subtotal: 0,
    originalTotal: 0,
    itemDiscounts: [],
    lowStockItems: [],
    discountRate: 0,
    isTuesday: false,
    bonusPoints: { finalPoints: 0, pointsDetail: [] },
  };

  // 할인 정보 계산
  const totalDiscountRate = calculateDiscountRate(result.subtotal, result.totalAmount);
  const totalDiscountAmount = calculateDiscountAmount(result.subtotal, result.totalAmount);
  const discountInfo = generateOrderSummaryDiscountInfo(result);

  return (
    <div className="bg-black text-white p-10 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>

      <div className="flex-1 flex flex-col">
        {/* 상품 목록 표시 */}
        {cartItems.length > 0 && (
          <div id="cart-items" className="mb-6 space-y-3">
            {cartItems.map((cartItem) => {
              const product = products.find((p) => p.id === cartItem.id);
              if (!product) return null;

              return (
                <div key={cartItem.id} className="flex justify-between items-baseline">
                  <span className="text-sm tracking-wide">
                    {product.name} x {cartItem.quantity}
                  </span>
                  <span className="text-sm tracking-tight">
                    {formatPrice(product.price * cartItem.quantity)}
                  </span>
                </div>
              );
            })}
            <div className="border-t border-white/10 pt-3"></div>
          </div>
        )}

        <div id="summary-details" className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Subtotal</span>
            <div className="text-sm tracking-tight">{formatPrice(result.subtotal)}</div>
          </div>
          {/* 할인 내역 상세 표시 */}
          {discountInfo.length > 0 && (
            <div id="discount-info" className="mb-4">
              <div className="space-y-2">
                {discountInfo.map((discount, index) => (
                  <div
                    key={index}
                    className={`flex justify-between text-sm tracking-wide ${discount.color}`}
                  >
                    <span className="text-xs">{discount.name}</span>
                    <span className="text-xs">-{formatDiscount(discount.rate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 배송비 표시 */}
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Shipping</span>
            <div className="text-sm tracking-tight">Free</div>
          </div>
        </div>

        {/* 총 할인율 영역 */}
        {totalDiscountRate > 0 && (
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">총 할인율</span>
              <span className="text-lg font-bold">{totalDiscountRate.toFixed(1)}%</span>
            </div>
            <div className="text-sm">{formatPrice(totalDiscountAmount)} 할인되었습니다</div>
          </div>
        )}

        <div className="mt-auto">
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">{formatPrice(result.totalAmount)}</div>
            </div>
            {cartItems.length > 0 && (
              <>
                <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
                  적립 포인트: {result.bonusPoints.finalPoints}p
                </div>
                {/* 포인트 상세 내역 */}
                {result.bonusPoints.pointsDetail.length > 0 && (
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {result.bonusPoints.pointsDetail.join(', ')}
                  </div>
                )}
              </>
            )}
          </div>
          {result.isTuesday && (
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
