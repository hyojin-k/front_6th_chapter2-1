import React from 'react';
import { calculateCartTotals } from '../../utils/calculationUtils';
import { CalculationResultType, CartItemType, ProductType } from '../../types';

export interface OrderSummaryPropsType {
  calculationResult: CalculationResultType;
  cartItems: CartItemType[];
  productList: ProductType[];
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryPropsType> = ({
  cartItems,
  productList,
  className = '',
}) => {
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const formatDiscount = (discount: number) => {
    return `${discount}%`;
  };

  // 디버깅을 위한 콘솔 로그
  console.log('OrderSummary - cartItems:', cartItems);
  console.log('OrderSummary - productList:', productList);

  // basic 버전의 계산 로직 사용
  const calculationResult: CalculationResultType = calculateCartTotals(cartItems, productList);

  console.log('OrderSummary - calculationResult:', calculationResult);

  // 테스트용 기본값 설정
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

  // 총 할인율 계산
  const totalDiscountRate =
    result.subtotal > 0 ? ((result.subtotal - result.totalAmount) / result.subtotal) * 100 : 0;
  const totalDiscountAmount = result.subtotal - result.totalAmount;

  // basic 버전의 할인 정보 생성 로직 적용
  const generateDiscountInfo = () => {
    const discounts: Array<{ name: string; rate: number; color: string }> = [];

    // 대량 구매 할인 (30개 이상)
    if (result.itemCount >= 30) {
      discounts.push({
        name: '🎉 대량구매 할인 (30개 이상)',
        rate: 25,
        color: 'text-green-400',
      });
    } else if (result.itemDiscounts.length > 0) {
      // 개별 상품 할인 (10개 이상)
      result.itemDiscounts.forEach((item) => {
        discounts.push({
          name: `${item.name} (10개↑)`,
          rate: item.rate * 100,
          color: 'text-green-400',
        });
      });
    }

    // 화요일 할인
    if (result.isTuesday && result.totalAmount > 0) {
      discounts.push({
        name: '🌟 화요일 추가 할인',
        rate: 10,
        color: 'text-purple-400',
      });
    }

    return discounts;
  };

  const discountInfo = generateDiscountInfo();

  return (
    <div className={`bg-black text-white p-8 flex flex-col ${className}`}>
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Subtotal</span>
            <div className="text-sm tracking-tight">{formatPrice(result.subtotal)}</div>
          </div>

          {/* 배송비 표시 */}
          <div className="flex justify-between items-baseline">
            <span className="text-sm uppercase tracking-wider">Shipping</span>
            <div className="text-sm tracking-tight">Free</div>
          </div>
        </div>

        {/* 총 할인율 영역 (녹색 박스) */}
        {totalDiscountRate > 0 && (
          <div className="mt-4 p-3 bg-green-600 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">총 할인율</span>
              <span className="text-lg font-bold">{totalDiscountRate.toFixed(1)}%</span>
            </div>
            <div className="text-sm">{formatPrice(totalDiscountAmount)} 할인되었습니다</div>
          </div>
        )}

        <div className="mt-auto">
          {/* 할인 내역 상세 표시 - basic 버전과 동일한 구조 */}
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

          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">{formatPrice(result.totalAmount)}</div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: {result.bonusPoints.finalPoints}p
            </div>
            {/* 포인트 상세 내역 */}
            {result.bonusPoints.pointsDetail.length > 0 && (
              <div className="text-xs text-gray-400 mt-1 text-right">
                {result.bonusPoints.pointsDetail.join(', ')}
              </div>
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
