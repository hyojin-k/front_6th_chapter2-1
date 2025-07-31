import {
  ProductType,
  CartItemType,
  CalculationResultType,
  BonusPointsInfoType,
  IndividualDiscountResultType,
  BulkDiscountResultType,
  TuesdayDiscountResultType,
  StockMessageType,
  ProductCountsType,
  CartItemCalculationType,
  TimerCallbackType,
} from '../types/index';

// 상품 관련 유틸리티 함수 타입
export type FindProductById = (productList: ProductType[], id: string) => ProductType | undefined;

// 장바구니 관련 유틸리티 함수 타입
export type AddToCart = (
  productId: string,
  cartItems: CartItemType[],
  productList: ProductType[]
) => { success: boolean; error?: string };

export type UpdateCartItemQuantity = (
  productId: string,
  change: number,
  cartItems: CartItemType[]
) => CartItemType[];

export type RemoveCartItem = (productId: string, cartItems: CartItemType[]) => CartItemType[];

export type GetCartItemQuantity = (cartItem: CartItemType) => number;

// 계산 관련 유틸리티 함수 타입
export type CalculateCartTotals = (
  cartItems: CartItemType[],
  productList: ProductType[]
) => CalculationResultType;

export type CalculateBonusPoints = (
  cartItems: CartItemType[],
  totalAmount: number,
  itemCount: number,
  productList: ProductType[]
) => BonusPointsInfoType;

export type CalculateIndividualDiscount = (
  product: ProductType,
  quantity: number
) => IndividualDiscountResultType;

export type CalculateBulkDiscount = (itemCount: number, subtotal: number) => BulkDiscountResultType;

export type CalculateTuesdayDiscount = (totalAmount: number) => TuesdayDiscountResultType;

export type CalculateCartItemTotals = (
  cartItems: CartItemType[],
  productList: ProductType[]
) => {
  totalAmount: number;
  itemCount: number;
  subtotal: number;
  itemDiscounts: Array<{ name: string; discount: number }>;
};

export type CalculateCombinationBonus = (
  cartItems: CartItemType[],
  productList: ProductType[]
) => { bonusPoints: number; pointsDetail: string[] };

export type CalculateBulkPurchaseBonus = (itemCount: number) => {
  bonusPoints: number;
  pointsDetail: string[];
};

// 재고 관련 유틸리티 함수 타입
export type GetTotalStock = (productList: ProductType[]) => number;

export type FindLowStockItems = (productList: ProductType[]) => string[];

export type GetStockMessage = (productList: ProductType[]) => StockMessageType;

// 상품 개수 관련 유틸리티 함수 타입
export type GetProductCounts = (
  cartItems: CartItemType[],
  productList: ProductType[]
) => ProductCountsType;

// 가격 관련 유틸리티 함수 타입
export type GeneratePriceHtml = (product: ProductType, showDiscount?: boolean) => string;

export type GenerateProductName = (product: ProductType) => string;

export type FormatPrice = (price: number) => string;

// 타이머 관련 유틸리티 함수 타입
export type LightningSaleTimer = (
  updateOptions: TimerCallbackType,
  updatePrices: TimerCallbackType
) => void;

export type SuggestSaleTimer = (
  updateOptions: TimerCallbackType,
  updatePrices: TimerCallbackType,
  cartItems: CartItemType[],
  lastSelectedProduct: string | null
) => void;

// 이벤트 핸들러 타입
export type InitCartClickHandler = (
  cartItems: CartItemType[],
  onCartUpdate: () => void,
  onOptionsUpdate: () => void,
  productList: ProductType[]
) => void;

// 상태 업데이트 함수 타입
export type UpdateAppState = <T extends Partial<AppStateType>>(
  currentState: AppStateType,
  newState: T
) => AppStateType & T;

// 앱 상태 타입 (utils/types.ts에서 사용)
export interface AppStateType {
  bonusPoints: number;
  itemCount: number;
  lastSelectedProduct: string | null;
  totalAmount: number;
}
