/* Small enhancements only. Menu, language and floating controls remain in their original modules. */
(() => {
  'use strict';
  const ready = () => {
    const bulletin = document.querySelector('#monthly-bulletin');
    if (bulletin) {
      const month = new Date().getMonth();
      bulletin.dataset.season = month >= 8 && month <= 10 ? 'fall' : 'neutral';
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
