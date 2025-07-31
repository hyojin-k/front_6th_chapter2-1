// 상품 관련 타입
export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

// 장바구니 아이템 타입
export interface CartItemType {
  id: string;
  quantity: number;
  product: ProductType;
}

// 할인 정보 타입
export interface DiscountInfoType {
  type: string;
  name: string;
  rate: number;
  color: string;
}

// 계산 결과 타입
export interface CalculationResultType {
  totalAmount: number;
  itemCount: number;
  subtotal: number;
  originalTotal: number;
  itemDiscounts: DiscountInfoType[];
  lowStockItems: string[];
  discountRate: number;
  isTuesday: boolean;
  bonusPoints: BonusPointsInfoType;
}

// 보너스 포인트 정보 타입
export interface BonusPointsInfoType {
  finalPoints: number;
  pointsDetail: string[];
}

// 앱 상태 타입
export interface AppStateType {
  bonusPoints: number;
  itemCount: number;
  lastSelectedProduct: string | null;
  totalAmount: number;
}

// 상품 ID 상수 타입
export type ProductIdType = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

// 할인율 상수 타입
export interface DiscountRatesType {
  [key: string]: number;
  BULK: number;
  TUESDAY: number;
  LIGHTNING: number;
  SUGGEST: number;
}

// 수량 임계값 타입
export interface QuantityThresholdsType {
  BULK_DISCOUNT: number;
  BULK_30: number;
  BULK_20: number;
  BULK_10: number;
  LOW_STOCK: number;
}

// 포인트율 타입
export interface PointRatesType {
  DEFAULT: number;
  TUESDAY_MULTIPLIER: number;
  SET_KEYBOARD_MOUSE: number;
  SET_KEYBOARD_MOUSE_MONITOR_ARM: number;
  BULK_10: number;
  BULK_20: number;
  BULK_30: number;
}

// 요일 타입
export interface WeekdaysType {
  TUESDAY: number;
}

// 재고 임계값 타입
export interface StockThresholdsType {
  WARNING_LEVEL: number;
}

// 타이머 간격 타입
export interface TimerIntervalsType {
  LIGHTNING_SALE: number;
  SUGGEST_SALE: number;
  LIGHTNING_DELAY: number;
  SUGGEST_DELAY: number;
}

// 개별 할인 계산 결과 타입
export interface IndividualDiscountResultType {
  applicable: boolean;
  rate: number;
}

// 대량 할인 계산 결과 타입
export interface BulkDiscountResultType {
  applicable: boolean;
  rate: number;
  finalAmount: number;
}

// 화요일 할인 계산 결과 타입
export interface TuesdayDiscountResultType {
  applicable: boolean;
  finalAmount: number;
  isTuesday: boolean;
}

// 상품 조합 보너스 계산 결과 타입
export interface CombinationBonusResultType {
  bonusPoints: number;
  pointsDetail: string[];
}

// 대량 구매 보너스 계산 결과 타입
export interface BulkPurchaseBonusResultType {
  bonusPoints: number;
  pointsDetail: string[];
}

// 장바구니 아이템별 계산 결과 타입
export interface CartItemCalculationType {
  quantity: number;
  itemTotal: number;
  discountedTotal: number;
  discount: DiscountInfoType | null;
}

// 상품 개수 정보 타입
export interface ProductCountType {
  product: ProductType;
  quantity: number;
}

// 상품 개수 맵 타입
export interface ProductCountsType {
  [productId: string]: number;
}

// 재고 메시지 타입
export interface StockMessageType {
  message: string;
  hasLowStock: boolean;
  outOfStock: boolean;
}

// 타이머 콜백 타입
export type TimerCallbackType = () => void;

// 이벤트 핸들러 타입
export type EventHandlerType = (event: React.MouseEvent | React.ChangeEvent) => void;

// 유틸리티 함수 타입들
export type FindProductByIdType = (
  productList: ProductType[],
  id: string
) => ProductType | undefined;

export type CalculateCartTotalsType = (
  cartItems: CartItemType[],
  productList: ProductType[]
) => CalculationResultType;

export type CalculateBonusPointsType = (
  cartItems: CartItemType[],
  totalAmount: number,
  itemCount: number,
  productList: ProductType[]
) => BonusPointsInfoType;

export type CalculateIndividualDiscountType = (
  product: ProductType,
  quantity: number
) => IndividualDiscountResultType;

export type CalculateBulkDiscountType = (
  itemCount: number,
  subtotal: number
) => BulkDiscountResultType;

export type CalculateTuesdayDiscountType = (totalAmount: number) => TuesdayDiscountResultType;

export type GetStockMessageType = (productList: ProductType[]) => StockMessageType;

export type FindLowStockItemsType = (productList: ProductType[]) => string[];

export type GetProductCountsType = (
  cartItems: CartItemType[],
  productList: ProductType[]
) => ProductCountsType;

// 타이머 관련 타입
export interface TimerConfigType {
  lightningSaleTimer: (updateOptions: TimerCallbackType, updatePrices: TimerCallbackType) => void;
  suggestSaleTimer: (
    updateOptions: TimerCallbackType,
    updatePrices: TimerCallbackType,
    cartDisplay: CartItemType[],
    lastSelectedProduct: string | null
  ) => void;
}

// 이벤트 핸들러 타입
export interface EventHandlersType {
  onCartItemQuantityChange: (productId: string, change: number) => void;
  onCartItemRemove: (productId: string) => void;
  onAddToCart: () => void;
  onProductSelect: (productId: string) => void;
  onManualToggle: () => void;
  onManualClose: () => void;
}

// 컨텍스트 타입
export interface AppContextType {
  state: AppStateType;
  products: ProductType[];
  cartItems: CartItemType[];
  calculationResult: CalculationResultType;
  handlers: EventHandlersType;
  isManualOpen: boolean;
}
