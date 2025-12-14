let activeDropdown = null;

function openAnyDropdown(button, type, event) {
  event.stopPropagation();

  const dropdown = button.closest('.dropdown');
  const menu = button.nextElementSibling;
  const rect = button.getBoundingClientRect();
  const padding = 10;

  // Fecha qualquer outro aberto
  if (activeDropdown && activeDropdown.menu !== menu) {
    activeDropdown.menu.classList.remove('open');
    activeDropdown.menu.style.display = 'none';
    activeDropdown = null;
  }

  // ===== DROPDOWN MODELO (ABSOLUTE) =====
  if (type === 'modelo') {
    const isOpen = menu.classList.contains('open');

    // Fecha se já estiver aberto
    document.querySelectorAll('.dropdown-menu.open').forEach(m => {
      m.classList.remove('open');
      m.style.display = 'none';
    });

    if (!isOpen) {
      menu.style.display = 'block';
      menu.classList.add('open');
      activeDropdown = { menu };
    }
    return;
  }

  // ===== DROPDOWN AÇÕES (FIXED) =====
  if (type === 'acoes') {

    // Força render para medir
    menu.style.visibility = 'hidden';
    menu.style.display = 'block';

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    // Horizontal (alinha pelo botão)
    let left = rect.right - menuWidth;
    if (left < padding) left = padding;
    if (left + menuWidth + padding > window.innerWidth) {
      left = window.innerWidth - menuWidth - padding;
    }

    // Vertical (abre pra cima se precisar)
    let top = rect.bottom + 6;
    if (top + menuHeight + padding > window.innerHeight) {
      top = rect.top - menuHeight - 6;
    }

    // Aplica posição
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.visibility = 'visible';
    menu.classList.add('open');

    activeDropdown = { menu };
  }
}

// Fecha tudo ao clicar fora
document.addEventListener('click', () => {
  if (activeDropdown) {
    activeDropdown.menu.classList.remove('open');
    activeDropdown.menu.style.display = 'none';
    activeDropdown = null;
  }
});