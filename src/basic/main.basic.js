import {
  Header,
  GridContainer,
  SelectItem,
  SelectorContainer,
  ProductDropdown,
  ProductDropdownOptions,
  CartDisplay,
  CartItem,
  AddButton,
  StockInfo,
  OrderSummary,
  Manual,
  ManualToggle,
  ManualOverlay,
} from './components';

import { PRODUCT_LIST } from './constants';

import { lightningSaleTimer, suggestSaleTimer } from './utils/eventTimers';

import {
  getCartChildren,
  initCartClickHandler,
  addToCart,
  updateSelectOptions,
  updateCartUI,
  updateBonusPoints,
  updateStockInfo,
  updatePricesInCart,
  calculateCartTotals,
} from './utils';

// 앱 상태 생성
function createAppState() {
  return {
    bonusPoints: 0,
    itemCount: 0,
    lastSelectedProduct: null,
    totalAmount: 0,
  };
}

// 상태 업데이트
function updateAppState(currentState, newState) {
  return { ...currentState, ...newState };
}

// 계산 및 UI 업데이트 (상태 의존)
function calculateCartState(domElements, currentState, productList) {
  const calculationResult = calculateCartTotals(
    getCartChildren(domElements.cartDisplay),
    productList
  );

  const newState = updateAppState(currentState, {
    totalAmount: calculationResult.totalAmount,
    itemCount: calculationResult.itemCount,
  });

  // UI 업데이트 - 계산 결과 재사용
  updateCartUI(domElements, calculationResult, productList);
  updateBonusPoints(domElements.cartDisplay, calculationResult, productList);
  updateStockInfo(domElements.stockInfo, productList);

  return newState;
}

// DOM 요소들 생성 및 구조화
function createDomElements() {
  const root = document.getElementById('app');
  const header = Header();
  const gridContainer = GridContainer();
  const leftColumn = SelectItem();
  const selectorContainer = SelectorContainer();

  const selectElement = ProductDropdown();
  const stockInfo = StockInfo();
  const addButton = AddButton();

  selectorContainer.appendChild(selectElement);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);

  const cartDisplay = CartDisplay();
  leftColumn.appendChild(cartDisplay);

  const rightColumn = OrderSummary();
  const summaryElement = rightColumn.querySelector('#cart-total');

  const manual = Manual();
  const manualOverlay = ManualOverlay(manual);
  const manualToggle = ManualToggle(manual, manualOverlay);

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manual);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  return {
    selectElement,
    stockInfo,
    addButton,
    cartDisplay,
    summaryElement,
  };
}

// 앱 초기화
function initializeApp(domElements, appState) {
  updateSelectOptions(domElements.selectElement, PRODUCT_LIST, ProductDropdownOptions);
  return calculateCartState(domElements, appState, PRODUCT_LIST);
}

// 타이머 설정
function setupTimers(domElements, appState) {
  lightningSaleTimer(
    () => updateSelectOptions(domElements.selectElement, PRODUCT_LIST, ProductDropdownOptions),
    () => {
      updatePricesInCart(domElements.cartDisplay, domElements.summaryElement, PRODUCT_LIST);
    }
  );

  suggestSaleTimer(
    () => updateSelectOptions(domElements.selectElement, PRODUCT_LIST, ProductDropdownOptions),
    () => {
      updatePricesInCart(domElements.cartDisplay, domElements.summaryElement, PRODUCT_LIST);
    },
    domElements.cartDisplay,
    appState.lastSelectedProduct
  );
}

// 이벤트 리스너 설정
function setupEventListeners(domElements, appState) {
  // 장바구니 클릭 이벤트
  initCartClickHandler(
    domElements.cartDisplay,
    () => {
      appState = calculateCartState(domElements, appState, PRODUCT_LIST);
    },
    () => updateSelectOptions(domElements.selectElement, PRODUCT_LIST, ProductDropdownOptions),
    PRODUCT_LIST
  );

  // 장바구니 추가 버튼 이벤트
  domElements.addButton.addEventListener('click', () => {
    const result = addToCart(
      domElements.selectElement.value,
      domElements.cartDisplay,
      PRODUCT_LIST,
      CartItem
    );
    if (result.success) {
      appState = updateAppState(appState, { lastSelectedProduct: domElements.selectElement.value });
      appState = calculateCartState(domElements, appState, PRODUCT_LIST);
    } else if (result.error) {
      alert(result.error);
    }
  });
}

function main() {
  let appState = createAppState();
  const domElements = createDomElements();

  appState = initializeApp(domElements, appState);

  setupTimers(domElements, appState);
  setupEventListeners(domElements, appState);
}

main();
