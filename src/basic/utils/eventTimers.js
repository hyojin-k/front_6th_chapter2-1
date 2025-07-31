import { PRODUCT_LIST, TIMER_INTERVALS } from '../constants';
import { applyLightningDiscount, applySuggestDiscount } from './discountUtils';

export const lightningSaleTimer = (onUpdateSelectOptions, doUpdatePricesInCart) => {
  const lightningDelay = Math.random() * TIMER_INTERVALS.LIGHTNING_DELAY;
  setTimeout(() => {
    setInterval(() => {
      const luckyIndex = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyIndex];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        applyLightningDiscount(luckyItem);
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_INTERVALS.LIGHTNING_SALE);
  }, lightningDelay);
};

export const suggestSaleTimer = (
  onUpdateSelectOptions,
  doUpdatePricesInCart,
  cartDisplay,
  lastSelectedProduct
) => {
  const suggestDelay = Math.random() * TIMER_INTERVALS.SUGGEST_DELAY;
  setTimeout(() => {
    setInterval(() => {
      if (cartDisplay.children.length === 0) {
        return;
      }
      if (lastSelectedProduct) {
        const suggestedProduct = findSuggestableProduct(lastSelectedProduct);
        if (suggestedProduct) {
          applySuggestDiscount(suggestedProduct);
          alert(`💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_INTERVALS.SUGGEST_SALE);
  }, suggestDelay);
};

// 추천 가능한 상품 찾기
function findSuggestableProduct(lastSelectedProductId) {
  return PRODUCT_LIST.find(
    (product) =>
      product.id !== lastSelectedProductId && product.quantity > 0 && !product.suggestSale
  );
}
