import { findProductById, getCartChildren } from './cartUtils';
import { calculateBonusPoints, getStockMessage, getTotalStock } from './calculationUtils';
import { generatePriceHtml, generateProductName } from './priceUtils';
import { generateDiscountInfo, generateDiscountHtml, calculateSavedAmount } from './discountUtils';
import {
  findElementById,
  findElement,
  findElements,
  findPriceElement,
  findNameElement,
  clearContent,
  setContent,
  appendContent,
  setText,
  showElement,
  hideElement,
  setBorderColor,
  setFontWeight,
  showElementByClass,
  hideElementByClass,
  hasClass,
  appendElement,
  getQuantity,
  updatePriceDisplay,
} from './domHelpers';
import { STOCK_THRESHOLDS, QUANTITY_THRESHOLDS } from '../constants';

/**
 * 상품 선택 관련 UI 업데이트 함수들
 */

// 상품 드롭다운 옵션 업데이트
export function updateSelectOptions(selectElement, productList, ProductDropdownOptions) {
  const totalStock = getTotalStock(productList);

  clearContent(selectElement);

  productList.map(ProductDropdownOptions).forEach((option) => appendElement(selectElement, option));

  const borderColor = totalStock < STOCK_THRESHOLDS.WARNING_LEVEL ? 'orange' : '';
  setBorderColor(selectElement, borderColor);
}

// 재고 정보 UI 업데이트
export function updateStockInfo(stockInfoElement, productList) {
  const stockMessage = getStockMessage(productList);
  setText(stockInfoElement, stockMessage);
}

/**
 * 장바구니 관련 UI 업데이트 함수들
 */

// 장바구니 UI 업데이트 (메인 함수)
export function updateCartUI(domElements, calculationResult, productList) {
  const { totalAmount, itemCount, discountRate, originalTotal, isTuesday } = calculationResult;

  updateCartItemCount(itemCount);
  updateCartSummaryDetails(domElements, calculationResult, productList);
  updateCartTotalAmount(domElements, totalAmount);
  updateCartDiscountInfo(discountRate, totalAmount, originalTotal);
  updateCartTuesdayDisplay(isTuesday, totalAmount);
}

// 장바구니 아이템 개수 업데이트
function updateCartItemCount(itemCount) {
  const itemCountElement = findElementById('item-count');
  setText(itemCountElement, `🛍️ ${itemCount} items in cart`);
}

// 장바구니 요약 상세 정보 업데이트
function updateCartSummaryDetails(domElements, calculationResult, productList) {
  const { subtotal, itemCount, itemDiscounts, isTuesday, totalAmount } = calculationResult;
  const summaryDetails = findElementById('summary-details');
  clearContent(summaryDetails);

  if (subtotal > 0) {
    const cartItems = getCartChildren(domElements.cartDisplay);

    // 아이템 목록 추가
    appendContent(summaryDetails, buildCartItemsList(cartItems, productList));

    // 소계 추가
    appendContent(summaryDetails, buildCartSubtotalHtml(subtotal));

    // 할인 정보 추가
    appendContent(
      summaryDetails,
      buildCartDiscountHtml(itemCount, itemDiscounts, isTuesday, totalAmount)
    );

    // 배송비 정보 추가
    appendContent(summaryDetails, buildCartShippingHtml());
  }
}

// 장바구니 총 금액 업데이트
function updateCartTotalAmount(domElements, totalAmount) {
  const totalDiv = findElement(domElements.summaryElement, '.text-2xl');
  updatePriceDisplay(totalDiv, Math.round(totalAmount));
}

// 장바구니 할인 정보 박스 업데이트
function updateCartDiscountInfo(discountRate, totalAmount, originalTotal) {
  const discountInfoDiv = findElementById('discount-info');
  clearContent(discountInfoDiv);

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = calculateSavedAmount(originalTotal, totalAmount);
    setContent(discountInfoDiv, buildDiscountInfoHtml(discountRate, savedAmount));
  }
}

// 장바구니 화요일 특가 표시 업데이트
function updateCartTuesdayDisplay(isTuesday, totalAmount) {
  const tuesdaySpecial = findElementById('tuesday-special');
  if (isTuesday && totalAmount > 0) {
    showElementByClass(tuesdaySpecial);
  } else {
    hideElementByClass(tuesdaySpecial);
  }
}

/**
 * 장바구니 HTML 생성 헬퍼 함수들
 */

// 장바구니 아이템 목록 HTML 생성
function buildCartItemsList(cartItems, productList) {
  return Array.from(cartItems)
    .map((cartItem) => {
      const product = findProductById(productList, cartItem.id);
      if (!product) return null;

      const quantity = getQuantity(cartItem);
      const itemTotal = product.price * quantity;

      return `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    })
    .filter((html) => html !== null)
    .join('');
}

// 소계 HTML 생성
function buildCartSubtotalHtml(subtotal) {
  return `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
  `;
}

// 할인 HTML 생성
function buildCartDiscountHtml(itemCount, itemDiscounts, isTuesday, totalAmount) {
  const discounts = generateDiscountInfo(itemCount, itemDiscounts, isTuesday, totalAmount);
  return generateDiscountHtml(discounts);
}

// 배송비 HTML 생성
function buildCartShippingHtml() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

// 할인 정보 박스 HTML 생성
function buildDiscountInfoHtml(discountRate, savedAmount) {
  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
    </div>
  `;
}

/**
 * 포인트 및 부가 정보 업데이트 함수들
 */

// 보너스 포인트 UI 업데이트
export function updateBonusPoints(cartElement, totalAmount, itemCount, productList) {
  const cartItems = getCartChildren(cartElement);
  const bonusResult = calculateBonusPoints(cartItems, totalAmount, itemCount, productList);

  const pointsElement = findElementById('loyalty-points');
  if (pointsElement) {
    if (cartItems.length === 0) {
      hideElement(pointsElement);
    } else if (bonusResult.finalPoints > 0) {
      setContent(pointsElement, buildBonusPointsHtml(bonusResult));
      showElement(pointsElement);
    } else {
      setText(pointsElement, '적립 포인트: 0p');
      showElement(pointsElement);
    }
  }
}

// 보너스 포인트 HTML 생성
function buildBonusPointsHtml(bonusResult) {
  return `
    <div>적립 포인트: <span class="font-bold">${bonusResult.finalPoints}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${bonusResult.pointsDetail.join(', ')}</div>
  `;
}

/**
 * 장바구니 가격 업데이트 함수들
 */

// 장바구니 가격 업데이트 (세일 적용) - 메인 함수
export function updatePricesInCart(cartElement, sumElement, productList) {
  updateCartItemPrices(cartElement, productList);
  updateCartItemStyles(cartElement, productList);
}

// 장바구니 아이템 가격 업데이트
function updateCartItemPrices(cartElement, productList) {
  const cartItems = getCartChildren(cartElement);

  Array.from(cartItems)
    .map((cartItem) => ({
      cartItem,
      product: findProductById(productList, cartItem.id),
    }))
    .filter(({ product }) => product)
    .forEach(({ cartItem, product }) => {
      const priceDiv = findPriceElement(cartItem);
      const nameDiv = findNameElement(cartItem);

      setContent(priceDiv, generatePriceHtml(product));
      setText(nameDiv, generateProductName(product));
    });
}

// 장바구니 아이템 스타일 업데이트
function updateCartItemStyles(cartElement, productList) {
  const cartItems = getCartChildren(cartElement);

  Array.from(cartItems)
    .map((cartItem) => ({
      cartItem,
      product: findProductById(productList, cartItem.id),
      quantity: getQuantity(cartItem),
    }))
    .filter(({ product }) => product)
    .forEach(({ cartItem, quantity }) => {
      // 가격 표시 스타일 업데이트
      const priceElements = findElements(cartItem, '.text-lg, .text-xs');
      priceElements.forEach((element) => {
        if (hasClass(element, 'text-lg')) {
          const fontWeight = quantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT ? 'bold' : 'normal';
          setFontWeight(element, fontWeight);
        }
      });
    });
}
