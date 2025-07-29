import {
  Header,
  GridContainer,
  SelectorContainer,
  SelectItem,
  AddToCartBtn,
  CartItem,
  CartDisplay,
  ProductDropdown,
  ProductDropdownOptions,
  StockInfo,
  OrderSummary,
  Manual,
  ManualToggle,
  ManualOverlay,
} from './components';
import {
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  NOTEBOOK_POUCH,
  LOFI_SPEAKER,
  PRODUCT_LIST,
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  POINT_RATES,
  TIMER_INTERVALS,
} from './constants';
import { lightningSaleTimer, suggestSaleTimer } from './utils/eventTimers';
import {
  addCartItem,
  findCartItem,
  getCartChildren,
  setupCartClickHandler,
  calculateTotal,
  findProductById,
  getProductCounts,
} from './utils';

// 애플리케이션 상태를 생성하는 팩토리 함수
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
  const addBtn = AddToCartBtn();

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
  updateSelectOptions(sel, PRODUCT_LIST);
  appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);

  // 타이머 설정
  lightningSaleTimer(
    () => updateSelectOptions(sel, PRODUCT_LIST),
    () => {
      updatePricesInCart(domElements.cartDisp, domElements.sum, PRODUCT_LIST);
      appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);
    }
  );

  suggestSaleTimer(
    () => updateSelectOptions(sel, PRODUCT_LIST),
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
    () => updateSelectOptions(sel, PRODUCT_LIST),
    PRODUCT_LIST,
    QUANTITY_THRESHOLDS
  );

  // 장바구니 추가 버튼 이벤트
  addBtn.addEventListener('click', function () {
    const result = handleAddToCart(sel.value, domElements.cartDisp, PRODUCT_LIST);
    if (result.success) {
      appState = updateAppState(appState, { lastSel: sel.value });
      appState = recalculateAndUpdate(domElements, appState, PRODUCT_LIST);
    } else if (result.error) {
      alert(result.error);
    }
  });
}

// 상품 드롭다운 옵션 업데이트
function updateSelectOptions(selectElement, productList) {
  const totalStock = getTotalStock(productList);

  selectElement.innerHTML = '';

  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const opt = ProductDropdownOptions(item);
    selectElement.appendChild(opt);
  }

  if (totalStock < 50) {
    selectElement.style.borderColor = 'orange';
  } else {
    selectElement.style.borderColor = '';
  }
}

// 총 재고 계산
function getTotalStock(productList) {
  return productList.reduce((sum, product) => sum + product.quantity, 0);
}

// 장바구니 총합 계산
function calculateCartTotals(cartItems, productList) {
  let totalAmt = 0;
  let itemCnt = 0;
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 재고 확인
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].quantity < 5 && productList[idx].quantity > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }

  // 장바구니 아이템 계산
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(productList, cartItem.id);

    if (!product) continue;

    const qtyElem = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.price * quantity;
    let discount = 0;

    itemCnt += quantity;
    subTot += itemTotal;

    // 가격 표시 스타일 업데이트
    const priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });

    // 할인 적용
    if (quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
      discount = DISCOUNT_RATES[product.id] || 0;
      if (discount > 0) {
        itemDiscounts.push({ name: product.name, discount: discount * 100 });
      }
    }

    totalAmt += itemTotal * (1 - discount);
  }

  // 대량 할인 적용
  const originalTotal = subTot;
  let discRate = 0;

  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_30) {
    totalAmt = (subTot * 75) / 100;
    discRate = DISCOUNT_RATES.BULK;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && totalAmt > 0) {
    totalAmt = (totalAmt * 90) / 100;
    discRate = 1 - totalAmt / originalTotal;
  }

  return {
    totalAmt,
    itemCnt,
    subTot,
    originalTotal,
    itemDiscounts,
    lowStockItems,
    discRate,
    isTuesday,
  };
}

// UI 업데이트
function updateCartUI(domElements, calculationResult, productList) {
  const { totalAmt, itemCnt, subTot, originalTotal, itemDiscounts, discRate, isTuesday } =
    calculationResult;

  // 아이템 개수 업데이트
  document.getElementById('item-count').textContent = `🛍️ ${itemCnt} items in cart`;

  // 요약 상세 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    const cartItems = getCartChildren(domElements.cartDisp);
    for (let i = 0; i < cartItems.length; i++) {
      const product = findProductById(productList, cartItems[i].id);
      if (!product) continue;

      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = product.price * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 추가
    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday && totalAmt > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 총 금액 업데이트
  const totalDiv = domElements.sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }

  // 할인 정보 업데이트
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 화요일 특가 표시
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday && totalAmt > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

// 보너스 포인트 계산
function calculateBonusPoints(cartItems, totalAmt, itemCnt, productList) {
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(totalAmt / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합 확인
  const productCounts = getProductCounts(cartItems, productList);
  const hasKeyboard = productCounts[KEYBOARD] > 0;
  const hasMouse = productCounts[MOUSE] > 0;
  const hasMonitorArm = productCounts[MONITOR_ARM] > 0;

  if (hasKeyboard && hasMouse) {
    finalPoints += POINT_RATES.SET_KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINT_RATES.SET_KEYBOARD_MOUSE_MONITOR_ARM;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_30) {
    finalPoints += POINT_RATES.BULK_30;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BULK_20) {
    finalPoints += POINT_RATES.BULK_20;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BULK_10) {
    finalPoints += POINT_RATES.BULK_10;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { finalPoints, pointsDetail };
}

// 보너스 포인트 UI 업데이트
function updateBonusPoints(cartElement, totalAmt, itemCnt, productList) {
  const cartItems = getCartChildren(cartElement);
  const bonusResult = calculateBonusPoints(cartItems, totalAmt, itemCnt, productList);

  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (cartItems.length === 0) {
      ptsTag.style.display = 'none';
    } else if (bonusResult.finalPoints > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusResult.finalPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${bonusResult.pointsDetail.join(', ')}</div>
      `;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
}

// 재고 정보 생성
function getStockMessage(productList) {
  let stockMsg = '';
  productList.forEach(function (item) {
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

// 재고 정보 UI 업데이트
function updateStockInfo(stockInfoElement, productList) {
  const stockMsg = getStockMessage(productList);
  stockInfoElement.textContent = stockMsg;
}

// 장바구니 가격 업데이트
function updatePricesInCart(cartElement, sumElement, productList) {
  const cartItems = getCartChildren(cartElement);

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(productList, itemId);

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
          <span class="text-purple-600">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
          <span class="text-red-500">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
          <span class="text-blue-500">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }
}

// 장바구니 추가 처리
function handleAddToCart(selectedValue, cartElement, productList) {
  if (!selectedValue) {
    return { success: false };
  }

  const itemToAdd = findProductById(productList, selectedValue);
  if (!itemToAdd) {
    return { success: false };
  }

  if (itemToAdd.quantity <= 0) {
    return { success: false, error: '재고가 부족합니다.' };
  }

  const existingItem = findCartItem(cartElement, itemToAdd.id);
  if (existingItem) {
    const qtyElem = existingItem.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + 1;

    if (newQty > itemToAdd.quantity + currentQty) {
      return { success: false, error: '재고가 부족합니다.' };
    }

    qtyElem.textContent = newQty;
    itemToAdd.quantity--;
  } else {
    const newItem = CartItem(itemToAdd);
    addCartItem(cartElement, newItem);
    itemToAdd.quantity--;
  }

  return { success: true };
}

main();
