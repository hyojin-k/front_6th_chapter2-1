export function ManualOverlay(manual) {
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  manualOverlay.onclick = (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manual.classList.add('translate-x-full');
    }
  };
  return manualOverlay;
}
