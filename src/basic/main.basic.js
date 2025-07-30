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

// 계산 및 UI 업데이트
function calculateCartState(domElements, currentState, productList) {
  const calculationResult = calculateCartTotals(
    getCartChildren(domElements.cartDisplay),
    productList
  );

  const newState = updateAppState(currentState, {
    totalAmount: calculationResult.totalAmount,
    itemCount: calculationResult.itemCount,
  });

  // UI 업데이트
  updateCartUI(domElements, calculationResult, productList);
  updateBonusPoints(
    domElements.cartDisplay,
    calculationResult.totalAmount,
    calculationResult.itemCount,
    productList
  );
  updateStockInfo(domElements.stockInfo, productList);

  return newState;
}

function main() {
  let appState = createAppState();

  // DOM 요소들을 로컬 변수로 관리
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

  // DOM 요소들을 객체로 관리
  const domElements = {
    selectElement,
    stockInfo,
    addButton,
    cartDisplay,
    summaryElement,
  };

  // 초기 설정
  updateSelectOptions(selectElement, PRODUCT_LIST, ProductDropdownOptions);
  appState = calculateCartState(domElements, appState, PRODUCT_LIST);

  // 타이머 설정
  lightningSaleTimer(
    () => updateSelectOptions(selectElement, PRODUCT_LIST, ProductDropdownOptions),
    () => {
      updatePricesInCart(domElements.cartDisplay, domElements.summaryElement, PRODUCT_LIST);
      appState = calculateCartState(domElements, appState, PRODUCT_LIST);
    }
  );

  suggestSaleTimer(
    () => updateSelectOptions(selectElement, PRODUCT_LIST, ProductDropdownOptions),
    () => {
      updatePricesInCart(domElements.cartDisplay, domElements.summaryElement, PRODUCT_LIST);
      appState = calculateCartState(domElements, appState, PRODUCT_LIST);
    },
    domElements.cartDisplay,
    appState.lastSelectedProduct
  );

  // 장바구니 클릭 이벤트 설정
  initCartClickHandler(
    domElements.cartDisplay,
    () => {
      appState = calculateCartState(domElements, appState, PRODUCT_LIST);
    },
    () => updateSelectOptions(selectElement, PRODUCT_LIST, ProductDropdownOptions),
    PRODUCT_LIST
  );

  // 장바구니 추가 버튼 이벤트
  addButton.addEventListener('click', function () {
    const result = addToCart(selectElement.value, domElements.cartDisplay, PRODUCT_LIST, CartItem);
    if (result.success) {
      appState = updateAppState(appState, { lastSelectedProduct: selectElement.value });
      appState = calculateCartState(domElements, appState, PRODUCT_LIST);
    } else if (result.error) {
      alert(result.error);
    }
  });
}

main();
