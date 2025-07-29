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
} from './utils';

let bonusPts = 0;
let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;

let cartDisp;
function main() {
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  const root = document.getElementById('app');

  const header = Header();

  const gridContainer = GridContainer();
  const leftColumn = SelectItem();
  const selectorContainer = SelectorContainer();

  sel = ProductDropdown();
  stockInfo = StockInfo();
  addBtn = AddToCartBtn();

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisp = CartDisplay();
  leftColumn.appendChild(cartDisp);

  const rightColumn = OrderSummary();

  sum = rightColumn.querySelector('#cart-total');

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

  // 초기 재고
  let initStock = 0;
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    initStock += PRODUCT_LIST[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  lightningSaleTimer(onUpdateSelectOptions, doUpdatePricesInCart);
  suggestSaleTimer(onUpdateSelectOptions, doUpdatePricesInCart, cartDisp, lastSel);

  // 장바구니 클릭 이벤트 설정
  setupCartClickHandler(
    cartDisp,
    handleCalculateCartStuff,
    onUpdateSelectOptions,
    PRODUCT_LIST,
    QUANTITY_THRESHOLDS
  );
}

let sum;

// 상품 드롭다운 옵션 업데이트
function onUpdateSelectOptions() {
  let totalStock;
  sel.innerHTML = '';
  totalStock = 0;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    const _p = PRODUCT_LIST[idx];
    totalStock = totalStock + _p.q;
  }
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    (function () {
      const item = PRODUCT_LIST[i];
      const opt = ProductDropdownOptions(item);
      sel.appendChild(opt);
    })();
  }
  if (totalStock < 50) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

// 장바구니 계산
function handleCalculateCartStuff() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  let originalTotal;
  let bulkDisc;
  let itemDisc;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;
  let pts;
  let hasP1;
  let hasP2;
  let loyaltyDiv;
  totalAmt = 0;
  itemCnt = 0;
  originalTotal = totalAmt;
  cartItems = getCartChildren(cartDisp);
  subTot = 0;
  bulkDisc = subTot;
  itemDiscounts = [];
  lowStockItems = [];

  // 재고 확인
  for (idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].q < 5 && PRODUCT_LIST[idx].q > 0) {
      lowStockItems.push(PRODUCT_LIST[idx].name);
    }
  }
  // 장바구니 확인
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }

      const qtyElem = cartItems[i].querySelector('.quantity-number');
      let q;
      let itemTot;
      let disc;
      q = parseInt(qtyElem.textContent);
      // 상품별 가격 계산
      itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      // 상품 합계 계산
      subTot += itemTot;
      const itemDiv = cartItems[i];
      console.log('itemDiv', itemDiv[i]);
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      console.log('priceElems', priceElems);
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      // 할인 적용
      if (q >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
        const curItemId = curItem.id;
        disc = DISCOUNT_RATES[curItemId];

        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      // 할인 적용 후 총 합계 계산
      totalAmt += itemTot * (1 - disc);
    })();
  }
  // 할인 적용
  let discRate = 0;
  originalTotal = subTot;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_30) {
    totalAmt = (subTot * 75) / 100;
    discRate = DISCOUNT_RATES.BULK;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = (totalAmt * 90) / 100;
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ui 업데이트
  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  // 총 합계 계산
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
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
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
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
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 확인
  stockMsg = '';
  for (let stockIdx = 0; stockIdx < PRODUCT_LIST.length; stockIdx++) {
    const item = PRODUCT_LIST[stockIdx];
    if (item.q < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}
var doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;
  const cartItems = getCartChildren(cartDisp);
  if (cartItems.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(totalAmt / 1000);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartItems;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < PRODUCT_LIST.length; pIdx++) {
      if (PRODUCT_LIST[pIdx].id === node.id) {
        product = PRODUCT_LIST[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === MOUSE) {
      hasMouse = true;
    } else if (product.id === MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_RATES.SET_KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_RATES.SET_KEYBOARD_MOUSE_MONITOR_ARM;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_30) {
    finalPoints = finalPoints + POINT_RATES.BULK_30;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= QUANTITY_THRESHOLDS.BULK_20) {
      finalPoints = finalPoints + POINT_RATES.BULK_20;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= QUANTITY_THRESHOLDS.BULK_10) {
        finalPoints = finalPoints + POINT_RATES.BULK_10;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPts = finalPoints;
  let ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};
function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < PRODUCT_LIST.length; i++) {
    currentProduct = PRODUCT_LIST[i];
    sum += currentProduct.q;
  }
  return sum;
}
var handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  let messageOptimizer;
  infoMsg = '';
  totalStock = onGetStockTotal();
  if (totalStock < QUANTITY_THRESHOLDS.BULK_30) {
  }
  PRODUCT_LIST.forEach(function (item) {
    if (item.q < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  let totalCount = calculateTotal(cartDisp);
  const cartItems = getCartChildren(cartDisp);
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < PRODUCT_LIST.length; productIdx++) {
      if (PRODUCT_LIST[productIdx].id === itemId) {
        product = PRODUCT_LIST[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();
addBtn.addEventListener('click', function () {
  let selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < PRODUCT_LIST.length; j++) {
    if (PRODUCT_LIST[j].id === selItem) {
      itemToAdd = PRODUCT_LIST[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = findCartItem(cartDisp, itemToAdd.id);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = CartItem(itemToAdd);
      addCartItem(cartDisp, newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});
