export const KEYBOARD = 'p1';
export const MOUSE = 'p2';
export const MONITOR_ARM = 'p3';
export const NOTEBOOK_POUCH = 'p4';
export const LOFI_SPEAKER = `p5`;

// 할인 적용 상수
export const DISCOUNT_RATES = {
  [KEYBOARD]: 0.1,
  [MOUSE]: 0.15,
  [MONITOR_ARM]: 0.2,
  [NOTEBOOK_POUCH]: 0.05,
  [LOFI_SPEAKER]: 0.25,

  BULK: 0.25,
  TUESDAY: 0.1,
  LIGHTNING: 0.2,
  SUGGEST: 0.05,
};

// 할인 적용 최소 수량 상수
export const QUANTITY_THRESHOLDS = {
  BULK_DISCOUNT: 10,
  BULK_30: 30,
  BULK_20: 20,
  BULK_10: 10,
  LOW_STOCK: 5,
};

// 포인트 적립 상수
export const POINT_RATES = {
  DEFAULT: 0.001,
  TUESDAY_MULTIPLIER: 2,
  SET_KEYBOARD_MOUSE: 50,
  SET_KEYBOARD_MOUSE_MONITOR_ARM: 100,
  BULK_10: 20,
  BULK_20: 50,
  BULK_30: 100,
};

// 요일 상수
export const WEEKDAYS = {
  TUESDAY: 2,
};

// 재고 임계값 상수
export const STOCK_THRESHOLDS = {
  WARNING_LEVEL: 50,
};

// 타이머 상수
export const TIMER_INTERVALS = {
  LIGHTNING_SALE: 30000,
  SUGGEST_SALE: 60000,
  LIGHTNING_DELAY: 10000,
  SUGGEST_DELAY: 20000,
};
