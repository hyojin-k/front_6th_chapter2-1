export function ProductDropdownOptions(item) {
  const option = document.createElement('option');
  option.value = item.id;
  let discountText = '';
  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  if (item.quantity === 0) {
    option.textContent = `${item.name} - ${item.price}원 (품절)${discountText}`;
    option.disabled = true;
    option.className = 'text-gray-400';
  } else {
    if (item.onSale && item.suggestSale) {
      option.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (25% SUPER SALE!)`;
      option.className = 'text-purple-600 font-bold';
    } else if (item.onSale) {
      option.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (20% SALE!)`;
      option.className = 'text-red-500 font-bold';
    } else if (item.suggestSale) {
      option.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (5% 추천할인!)`;
      option.className = 'text-blue-500 font-bold';
    } else {
      option.textContent = `${item.name} - ${item.price}원${discountText}`;
    }
  }

  return option;
}
