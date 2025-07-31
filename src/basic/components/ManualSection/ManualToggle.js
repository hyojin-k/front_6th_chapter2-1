export function ManualToggle(manual, manualOverlay) {
  const manualToggle = document.createElement('button');
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  `;

  manualToggle.onclick = () => {
    manualOverlay.classList.toggle('hidden');
    manual.classList.toggle('translate-x-full');
  };

  return manualToggle;
}
