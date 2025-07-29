import { DISCOUNT_RATES, PRODUCT_LIST, TIMER_INTERVALS } from '../constants';

export const lightningSaleTimer = (onUpdateSelectOptions, doUpdatePricesInCart) => {
  const lightningDelay = Math.random() * TIMER_INTERVALS.LIGHTNING_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.price = Math.round((luckyItem.originalPrice * 80) / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_INTERVALS.LIGHTNING_SALE);
  }, lightningDelay);
};

export const suggestSaleTimer = (
  onUpdateSelectOptions,
  doUpdatePricesInCart,
  cartDisp,
  lastSel
) => {
  const suggestDelay = Math.random() * TIMER_INTERVALS.SUGGEST_DELAY;
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < PRODUCT_LIST.length; k++) {
          if (PRODUCT_LIST[k].id !== lastSel) {
            if (PRODUCT_LIST[k].quantity > 0) {
              if (!PRODUCT_LIST[k].suggestSale) {
                suggest = PRODUCT_LIST[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round((suggest.price * (100 - DISCOUNT_RATES.SUGGEST)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_INTERVALS.SUGGEST_SALE);
  }, suggestDelay);
};
