// 공통 DOM 조작 유틸리티

// Element 찾기 헬퍼들
export function findElementById(id) {
  return document.getElementById(id);
}

export function findElement(parent, selector) {
  return parent.querySelector(selector);
}

export function findElements(parent, selector) {
  return parent.querySelectorAll(selector);
}

// 자주 사용되는 특정 요소 찾기
export function findQuantityElement(cartItem) {
  return findElement(cartItem, '.quantity-number');
}

export function findPriceElement(cartItem) {
  return findElement(cartItem, '.text-lg');
}

export function findNameElement(cartItem) {
  return findElement(cartItem, 'h3');
}

// Content 조작 헬퍼들
export function clearContent(element) {
  if (element) {
    element.innerHTML = '';
  }
}

export function setContent(element, content) {
  if (element) {
    element.innerHTML = content;
  }
}

export function appendContent(element, content) {
  if (element) {
    element.innerHTML += content;
  }
}

export function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

// Style 조작 헬퍼들
export function showElement(element) {
  if (element) {
    element.style.display = 'block';
  }
}

export function hideElement(element) {
  if (element) {
    element.style.display = 'none';
  }
}

export function setBorderColor(element, color) {
  if (element) {
    element.style.borderColor = color;
  }
}

export function setFontWeight(element, weight) {
  if (element) {
    element.style.fontWeight = weight;
  }
}

// Class 조작 헬퍼들
export function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

export function removeClass(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}

export function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

export function hasClass(element, className) {
  return element ? element.classList.contains(className) : false;
}

// 표시/숨김 토글 (클래스 기반)
export function showElementByClass(element) {
  removeClass(element, 'hidden');
}

export function hideElementByClass(element) {
  addClass(element, 'hidden');
}

// DOM 생성 헬퍼들
export function createElement(tagName, className = '', content = '') {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (content) {
    element.innerHTML = content;
  }
  return element;
}

export function appendElement(parent, child) {
  if (parent && child) {
    parent.appendChild(child);
  }
}

// 이벤트 헬퍼들
export function addClickListener(element, handler) {
  if (element) {
    element.addEventListener('click', handler);
  }
}

// 수량 관련 헬퍼들
export function getQuantity(cartItem) {
  const quantityElement = findQuantityElement(cartItem);
  return quantityElement ? parseInt(quantityElement.textContent) : 0;
}

export function setQuantity(cartItem, quantity) {
  const quantityElement = findQuantityElement(cartItem);
  setText(quantityElement, quantity.toString());
}

// 일괄 DOM 조작 헬퍼들
export function updateElementsContent(elements, updateFn) {
  elements.forEach(updateFn);
}

export function updateMultipleElements(updates) {
  updates.forEach(({ element, property, value }) => {
    updateSingleElement(element, property, value);
  });
}

// 단일 요소 업데이트 헬퍼 함수
function updateSingleElement(element, property, value) {
  if (!element || !property || value === undefined) {
    return;
  }

  const updateStrategies = {
    textContent: () => setText(element, value),
    innerHTML: () => setContent(element, value),
    className: () => {
      element.className = value;
    },
  };

  if (updateStrategies[property]) {
    updateStrategies[property]();
    return;
  }

  if (property.startsWith('style.')) {
    const styleProp = property.replace('style.', '');
    element.style[styleProp] = value;
  }
}

// 안전한 DOM 조작 (element 존재 확인)
export function safeUpdate(element, updateFn) {
  if (element && typeof updateFn === 'function') {
    updateFn(element);
  }
}

// 공통 UI 업데이트 패턴들
export function updateCountDisplay(elementId, count, template = (count) => count) {
  const element = findElementById(elementId);
  setText(element, template(count));
}

export function updatePriceDisplay(element, price) {
  setText(element, `₩${price.toLocaleString()}`);
}

export function clearAndAppendContent(element, contentArray) {
  clearContent(element);
  contentArray.forEach((content) => appendContent(element, content));
}
