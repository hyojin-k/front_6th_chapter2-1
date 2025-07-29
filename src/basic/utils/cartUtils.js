// 장바구니 아이템 추가
export function addCartItem(cartContainer, item) {
  cartContainer.appendChild(item);
}

// 장바구니 아이템 찾기
export function findCartItem(cartContainer, productId) {
  return cartContainer.querySelector(`#${productId}`);
}

// 장바구니의 모든 자식 요소
export function getCartChildren(cartContainer) {
  return cartContainer.children;
}

// 장바구니 클릭 이벤트 설정
export function setupCartClickHandler(
  cartContainer,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
  PRODUCT_LIST,
  QUANTITY_THRESHOLDS
) {
  cartContainer.addEventListener('click', function (event) {
    let tgt = event.target;
    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      let prod = null;
      for (let prdIdx = 0; prdIdx < PRODUCT_LIST.length; prdIdx++) {
        if (PRODUCT_LIST[prdIdx].id === prodId) {
          prod = PRODUCT_LIST[prdIdx];
          break;
        }
      }
      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const qtyElem = itemElem.querySelector('.quantity-number');
        const currentQty = parseInt(qtyElem.textContent);
        const newQty = currentQty + qtyChange;
        if (newQty > 0 && newQty <= prod.quantity + currentQty) {
          qtyElem.textContent = newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          prod.quantity += currentQty;
          itemElem.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const qtyElem = itemElem.querySelector('.quantity-number');
        const remQty = parseInt(qtyElem.textContent);
        prod.quantity += remQty;
        itemElem.remove();
      }
      if (prod && prod.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      }
      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}

// 장바구니의 총 수량 계산
export function calculateTotal(cartContainer) {
  let totalCount = 0;
  const children = cartContainer.children;
  for (let j = 0; j < children.length; j++) {
    const qtyElem = children[j].querySelector('.quantity-number');
    if (qtyElem) {
      totalCount += parseInt(qtyElem.textContent);
    }
  }
  return totalCount;
}
