export function ProductDropdown() {
  const select = document.createElement('select');
  select.id = 'product-select';
  select.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  return select;
}
