import { initIndice } from '../pages/indice.js';

document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.includes('indices.html')) {
    initIndice();
  }
});
