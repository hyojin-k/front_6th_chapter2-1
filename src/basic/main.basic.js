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
  setupCartClickHandler,
  handleAddToCart,
  updateSelectOptions,
  updateCartUI,
  updateBonusPoints,
  updateStockInfo,
  updatePricesInCart,
  calculateCartTotals,
} from './utils';

function createAppState() {
  return {
    bonusPts: 0,
    itemCnt: 0,
    lastSel: null,
    totalAmt: 0,
  };
}

// 상태 업데이트
function updateAppState(currentState, newState) {
  return { ...currentState, ...newState };
}

// 계산 및 UI 업데이트
function recalculateAndUpdate(domElements, currentState, productList) {
  const calculationResult = calculateCartTotals(getCartChildren(domElements.cartDisp), productList);

  const newState = updateAppState(currentState, {
    totalAmt: calculationResult.totalAmt,
    itemCnt: calculationResult.itemCnt,
  });

  // UI 업데이트
  updateCartUI(domElements, calculationResult, productList);
  updateBonusPoints(
    domElements.cartDisp,
    calculationResult.totalAmt,
    calculationResult.itemCnt,
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

  const sel = ProductDropdown();
  const stockInfo = StockInfo();
  const addBtn = AddButton();

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);

  const cartDisp = CartDisplay();
  leftColumn.appendChild(cartDisp);

  const rightColumn = OrderSummary();
  const sum = rightColumn.querySelector('#cart-total');

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
    sel,
    stockInfo,
    addBtn,
    cartDisp,
    sum,
  };

  // 초기 설정
  updateSelectOptions(sel, PRODUCT_LIST, ProductDropdownOptions);
  appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);

  // 타이머 설정
  lightningSaleTimer(
    () => updateSelectOptions(sel, PRODUCT_LIST, ProductDropdownOptions),
    () => {
      updatePricesInCart(domElements.cartDisp, domElements.sum, PRODUCT_LIST);
      appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);
    }
  );

  suggestSaleTimer(
    () => updateSelectOptions(sel, PRODUCT_LIST, ProductDropdownOptions),
    () => {
      updatePricesInCart(domElements.cartDisp, domElements.sum, PRODUCT_LIST);
      appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);
    },
    domElements.cartDisp,
    appState.lastSel
  );

  // 장바구니 클릭 이벤트 설정
  setupCartClickHandler(
    domElements.cartDisp,
    () => {
      appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);
    },
    () => updateSelectOptions(sel, PRODUCT_LIST, ProductDropdownOptions),
    PRODUCT_LIST
  );

  // 장바구니 추가 버튼 이벤트
  addBtn.addEventListener('click', function () {
    const result = handleAddToCart(sel.value, domElements.cartDisp, PRODUCT_LIST, CartItem);
    if (result.success) {
      appState = updateAppState(appState, { lastSel: sel.value });
      appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);
    } else if (result.error) {
      alert(result.error);
    }
  });
}

main();
