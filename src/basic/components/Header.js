export function Header() {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = /*html*/ `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    `;

  return header;
}
