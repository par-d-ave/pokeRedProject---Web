const RESET_MS = 1500;

function flash(btn: HTMLButtonElement, text: string, original: string): void {
  btn.textContent = text;
  setTimeout(() => {
    btn.textContent = original;
  }, RESET_MS);
}

document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
  const original = btn.textContent ?? 'Copiar código';

  btn.addEventListener('click', async () => {
    const target = document.getElementById(btn.dataset.copyTarget ?? '');
    try {
      await navigator.clipboard.writeText(target?.textContent ?? '');
      flash(btn, '¡Copiado!', original);
    } catch {
      flash(btn, 'Error', original);
    }
  });
});

export {};