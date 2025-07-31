import {
  POINT_RATES,
  WEEKDAYS,
  QUANTITY_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
} from '../constants';
import {
  ProductType,
  CartItemType,
  CalculationResultType,
  BonusPointsInfoType,
  ProductCountsType,
  DiscountInfoType,
} from '../types';

/**
 * 재고 관련 함수들
 */

// 총 재고 계산
export function getTotalStock(productList: ProductType[]): number {
  return productList.reduce((sum, product) => sum + product.quantity, 0);
}

// 재고 부족 상품 확인
function findLowStockItems(productList: ProductType[]): string[] {
  return productList
    .filter((product) => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK && product.quantity > 0)
    .map((product) => product.name);
}

// 재고 메시지 생성
export function getStockMessage(productList: ProductType[]): string {
  let stockMsg = '';
  productList.forEach((item) => {
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.quantity > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  });
  return stockMsg;
}

/**
 * 수량 계산 함수들
 */

// 장바구니의 총 수량 계산
export function calculateTotal(cartItems: CartItemType[]): number {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// 장바구니에 있는 각 상품의 개수 계산
export function getProductCounts(
  cartItems: CartItemType[],
  productList: ProductType[]
): ProductCountsType {
  return cartItems.reduce((counts, cartItem) => {
    const product = productList.find((p) => p.id === cartItem.id);
    if (product) {
      counts[product.id] = (counts[product.id] || 0) + cartItem.quantity;
    }
    return counts;
  }, {} as ProductCountsType);
}

/**
 * 장바구니 계산 관련 함수들
 */

// 장바구니 아이템별 계산 및 개별 할인 적용
function calculateCartItemTotals(cartItems: CartItemType[], productList: ProductType[]) {
  const itemCalculations = cartItems
    .map((cartItem) => {
      const product = productList.find((p) => p.id === cartItem.id);
      if (!product) return null;

      const quantity = cartItem.quantity;
      const itemTotal = product.price * quantity;
      const individualDiscount = calculateIndividualDiscount(product, quantity);

      return {
        quantity,
        itemTotal,
        discountedTotal: itemTotal * (1 - individualDiscount.rate),
        discount: individualDiscount.applicable
          ? {
              name: product.name,
              discount: individualDiscount.rate * 100,
            }
          : null,
      };
    })
    .filter((item) => item !== null) as Array<{
    quantity: number;
    itemTotal: number;
    discountedTotal: number;
    discount: { name: string; discount: number } | null;
  }>;

  return itemCalculations.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + item.discountedTotal,
      itemCount: acc.itemCount + item.quantity,
      subtotal: acc.subtotal + item.itemTotal,
      itemDiscounts: item.discount ? [...acc.itemDiscounts, item.discount] : acc.itemDiscounts,
    }),
    {
      totalAmount: 0,
      itemCount: 0,
      subtotal: 0,
      itemDiscounts: [] as Array<{ name: string; discount: number }>,
    }
  );
}

// 개별 상품 할인 계산
function calculateIndividualDiscount(product: ProductType, quantity: number) {
  let applicable = false;
  let rate = 0;

  // 개별 상품 할인 (5개 이상 구매 시 10% 할인)
  if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
    applicable = true;
    rate = 0.1;
  }

  return { applicable, rate };
}

// 대량 구매 할인 적용 (래퍼 함수) - basic 버전 로직 적용
function applyBulkDiscount(totalAmount: number, subtotal: number, itemCount: number) {
  const bulkDiscount = calculateBulkDiscount(itemCount, subtotal);

  if (bulkDiscount.applicable) {
    return {
      finalAmount: bulkDiscount.finalAmount,
      discountRate: bulkDiscount.rate,
    };
  }

  // 기존 개별 할인율 계산
  const individualDiscountRate = (subtotal - totalAmount) / subtotal;
  return { finalAmount: totalAmount, discountRate: individualDiscountRate };
}

// 대량 할인 계산
function calculateBulkDiscount(itemCount: number, subtotal: number) {
  let applicable = false;
  let rate = 0;
  let finalAmount = subtotal;

  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    applicable = true;
    rate = 0.3;
    finalAmount = subtotal * 0.7;
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
    applicable = true;
    rate = 0.2;
    finalAmount = subtotal * 0.8;
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
    applicable = true;
    rate = 0.1;
    finalAmount = subtotal * 0.9;
  }

  return { applicable, rate, finalAmount };
}

// 화요일 할인 적용 (래퍼 함수) - basic 버전 로직 적용
function applyTuesdayDiscount(totalAmount: number, originalTotal: number) {
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);

  if (tuesdayDiscount.applicable) {
    const discountRate = 1 - tuesdayDiscount.finalAmount / originalTotal;
    return {
      finalAmount: tuesdayDiscount.finalAmount,
      discountRate,
      isTuesday: tuesdayDiscount.isTuesday,
    };
  }

  // 화요일이 아닌 경우
  const discountRate = (originalTotal - totalAmount) / originalTotal;
  return { finalAmount: totalAmount, discountRate, isTuesday: tuesdayDiscount.isTuesday };
}

// 화요일 할인 계산
function calculateTuesdayDiscount(totalAmount: number) {
  const today = new Date().getDay();
  const isTuesday = today === WEEKDAYS.TUESDAY;
  const applicable = isTuesday;
  const finalAmount = applicable ? totalAmount * 0.9 : totalAmount;

  return { applicable, finalAmount, isTuesday };
}

// 할인 정보 생성
function generateDiscountInfo(
  itemCount: number,
  itemDiscounts: Array<{ name: string; discount: number }>,
  isTuesday: boolean,
  totalAmount: number,
  subtotal: number,
  finalAmount: number
) {
  const discountInfo: Array<{ type: string; name: string; rate: number; color: string }> = [];

  // 개별 상품 할인 정보 추가
  itemDiscounts.forEach((discount) => {
    discountInfo.push({
      type: 'individual',
      name: discount.name,
      rate: discount.discount,
      color: 'text-blue-400',
    });
  });

  // 화요일 할인 정보 추가
  if (isTuesday) {
    discountInfo.push({
      type: 'tuesday',
      name: '화요일 할인',
      rate: 10,
      color: 'text-green-400',
    });
  }

  return discountInfo;
}

// 장바구니 총합 계산 (메인 함수) - basic 버전 로직 적용
export function calculateCartTotals(
  cartItems: CartItemType[],
  productList: ProductType[]
): CalculationResultType {
  const lowStockItems = findLowStockItems(productList);
  const itemTotals = calculateCartItemTotals(cartItems, productList);
  const originalTotal = itemTotals.subtotal;

  const bulkDiscountResult = applyBulkDiscount(
    itemTotals.totalAmount,
    itemTotals.subtotal,
    itemTotals.itemCount
  );
  const tuesdayDiscountResult = applyTuesdayDiscount(bulkDiscountResult.finalAmount, originalTotal);

  // 보너스 포인트도 함께 계산하여 중복 계산 방지
  const bonusPoints = calculateBonusPoints(
    cartItems,
    tuesdayDiscountResult.finalAmount,
    itemTotals.itemCount,
    productList
  );

  const itemDiscounts: DiscountInfoType[] = itemTotals.itemDiscounts.map((discount) => ({
    type: 'individual',
    name: discount.name,
    rate: discount.discount / 100,
    color: 'blue',
  }));

  return {
    totalAmount: tuesdayDiscountResult.finalAmount,
    itemCount: itemTotals.itemCount,
    subtotal: itemTotals.subtotal,
    originalTotal,
    itemDiscounts,
    lowStockItems,
    discountRate: tuesdayDiscountResult.discountRate,
    isTuesday: tuesdayDiscountResult.isTuesday,
    bonusPoints,
  };
}

/**
 * 포인트 계산 관련 함수들
 */

// 보너스 포인트 계산 (PRD에 맞게 수정)
export function calculateBonusPoints(
  cartItems: CartItemType[],
  totalAmount: number,
  itemCount: number,
  productList: ProductType[]
): BonusPointsInfoType {
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  // 기본 포인트 계산 (0.1% = 1,000원당 1포인트)
  const basePoints = Math.floor(totalAmount * 0.001);
  let finalPoints = 0;
  const pointsDetail: string[] = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배 포인트
  if (new Date().getDay() === WEEKDAYS.TUESDAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합 보너스 포인트
  finalPoints += calculateCombinationBonus(cartItems, productList, pointsDetail);

  // 대량 구매 보너스 포인트
  finalPoints += calculateBulkPurchaseBonus(itemCount, pointsDetail);

  const result: BonusPointsInfoType = { finalPoints, pointsDetail };

  return result;
}

// 상품 조합 보너스 포인트 계산
function calculateCombinationBonus(
  cartItems: CartItemType[],
  productList: ProductType[],
  pointsDetail: string[]
): number {
  const productCounts = getProductCounts(cartItems, productList);
  const hasKeyboard = productCounts[KEYBOARD] > 0;
  const hasMouse = productCounts[MOUSE] > 0;
  const hasMonitorArm = productCounts[MONITOR_ARM] > 0;

  let bonusPoints = 0;

  // 키보드 + 마우스 조합
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINT_RATES.SET_KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 조합');
  }

  // 키보드 + 마우스 + 모니터암 조합
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINT_RATES.SET_KEYBOARD_MOUSE_MONITOR_ARM;
    pointsDetail.push('키보드+마우스+모니터암 조합');
  }

  return bonusPoints;
}

// 대량 구매 보너스 포인트 계산
function calculateBulkPurchaseBonus(itemCount: number, pointsDetail: string[]): number {
  let bonusPoints = 0;

  if (itemCount >= QUANTITY_THRESHOLDS.BULK_30) {
    bonusPoints += POINT_RATES.BULK_30;
    pointsDetail.push('대량구매 30개+');
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_20) {
    bonusPoints += POINT_RATES.BULK_20;
    pointsDetail.push('대량구매 20개+');
  } else if (itemCount >= QUANTITY_THRESHOLDS.BULK_10) {
    bonusPoints += POINT_RATES.BULK_10;
    pointsDetail.push('대량구매 10개+');
  }

  return bonusPoints;
}
