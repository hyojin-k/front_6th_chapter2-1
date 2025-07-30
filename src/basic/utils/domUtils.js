import { findProductById, getCartChildren } from './cartUtils';
import { calculateBonusPoints, getStockMessage, getTotalStock } from './calculationUtils';

// 상품 드롭다운 옵션 업데이트
export function updateSelectOptions(selectElement, productList, ProductDropdownOptions) {
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

// 장바구니 UI 업데이트
export function updateCartUI(domElements, calculationResult, productList) {
  const {
    totalAmount,
    itemCount,
    subtotal,
    originalTotal,
    itemDiscounts,
    discountRate,
    isTuesday,
  } = calculationResult;

  // 아이템 개수 업데이트
  document.getElementById('item-count').textContent = `🛍️ ${itemCount} items in cart`;

  // 요약 상세 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subtotal > 0) {
    const cartItems = getCartChildren(domElements.cartDisplay);
    for (let i = 0; i < cartItems.length; i++) {
      const product = findProductById(productList, cartItems[i].id);
      if (!product) continue;

      const quantityElement = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
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
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 추가
    if (itemCount >= 30) {
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

    if (isTuesday && totalAmount > 0) {
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
  const totalDiv = domElements.summaryElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  // 할인 정보 업데이트
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 화요일 특가 표시
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

// 보너스 포인트 UI 업데이트
export function updateBonusPoints(cartElement, totalAmount, itemCount, productList) {
  const cartItems = getCartChildren(cartElement);
  const bonusResult = calculateBonusPoints(cartItems, totalAmount, itemCount, productList);

  const pointsElement = document.getElementById('loyalty-points');
  if (pointsElement) {
    if (cartItems.length === 0) {
      pointsElement.style.display = 'none';
    } else if (bonusResult.finalPoints > 0) {
      pointsElement.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusResult.finalPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${bonusResult.pointsDetail.join(', ')}</div>
      `;
      pointsElement.style.display = 'block';
    } else {
      pointsElement.textContent = '적립 포인트: 0p';
      pointsElement.style.display = 'block';
    }
  }
}

// 재고 정보 UI 업데이트
export function updateStockInfo(stockInfoElement, productList) {
  const stockMsg = getStockMessage(productList);
  stockInfoElement.textContent = stockMsg;
}

// 장바구니 가격 업데이트 (세일 적용)
export function updatePricesInCart(cartElement, sumElement, productList) {
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

  // 장바구니 항목의 스타일 업데이트
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(productList, cartItem.id);

    if (!product) continue;

    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);

    // 가격 표시 스타일 업데이트
    const priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });
  }
}
