// 상품 아이콘 생성
function generateProductIcon(product) {
  if (product.onSale && product.suggestSale) {
    return '⚡💝';
  } else if (product.onSale) {
    return '⚡';
  } else if (product.suggestSale) {
    return '💝';
  }
  return '';
}

// 가격 표시 색상 결정
function getPriceColor(product) {
  if (product.onSale && product.suggestSale) {
    return 'text-purple-600';
  } else if (product.onSale) {
    return 'text-red-500';
  } else if (product.suggestSale) {
    return 'text-blue-500';
  }
  return '';
}

// 가격 HTML 생성 (할인 가격 포함)
export function generatePriceHtml(product, useOriginalPriceProperty = false) {
  const originalPriceKey = useOriginalPriceProperty ? 'originalPrice' : 'originalVal';
  const priceKey = useOriginalPriceProperty ? 'price' : 'val';

  if (product.onSale || product.suggestSale) {
    const colorClass = getPriceColor(product);
    return `<span class="line-through text-gray-400">₩${product[originalPriceKey].toLocaleString()}</span> <span class="${colorClass}">₩${product[priceKey].toLocaleString()}</span>`;
  }
  return `₩${product[priceKey].toLocaleString()}`;
}

// 상품명 생성 (아이콘 포함)
export function generateProductName(product) {
  const icon = generateProductIcon(product);
  return `${icon}${product.name}`;
}

// 가격 텍스트만 생성 (HTML 태그 없이)
export function generatePriceText(product, useOriginalPriceProperty = false) {
  const priceKey = useOriginalPriceProperty ? 'price' : 'val';
  return `₩${product[priceKey].toLocaleString()}`;
}

// 할인 여부 확인
export function hasDiscount(product) {
  return product.onSale || product.suggestSale;
}

// 원가 가져오기
export function getOriginalPrice(product, useOriginalPriceProperty = false) {
  const originalPriceKey = useOriginalPriceProperty ? 'originalPrice' : 'originalVal';
  return product[originalPriceKey];
}

// 현재 가격 가져오기
export function getCurrentPrice(product, useOriginalPriceProperty = false) {
  const priceKey = useOriginalPriceProperty ? 'price' : 'val';
  return product[priceKey];
}
