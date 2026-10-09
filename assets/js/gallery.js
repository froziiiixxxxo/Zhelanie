(() => {
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const items = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.querySelector('#gallery-lightbox');
  if (!items.length || !lightbox) return;

  const image = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption span:first-child');
  const counter = lightbox.querySelector('.lightbox-caption span:last-child');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const focusableSelector = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const lockScroll = window.ZhelanieUI?.lockScroll || (() => document.body.classList.add('no-scroll'));
  const unlockScroll = window.ZhelanieUI?.unlockScroll || (() => document.body.classList.remove('no-scroll'));
  let currentItems = items;
  let currentIndex = 0;
  let lastTrigger = null;

  const visibleItems = () => items.filter((item) => !item.hidden);
  const showItem = (index) => {
    currentIndex = (index + currentItems.length) % currentItems.length;
    const currentItem = currentItems[currentIndex];
    const itemImage = currentItem.querySelector('img');
    image.src = itemImage.currentSrc || itemImage.src;
    image.alt = itemImage.alt;
    caption.textContent = currentItem.dataset.caption || itemImage.alt;
    counter.textContent = `Фото ${currentIndex + 1} из ${currentItems.length}`;
  };
  const openLightbox = (item) => {
    currentItems = visibleItems();
    currentIndex = currentItems.indexOf(item);
    if (currentIndex < 0) return;
    lastTrigger = item;
    showItem(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lockScroll('lightbox');
    closeButton.focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    image.src = '';
    unlockScroll('lightbox');
    lastTrigger?.focus();
  };
  const move = (change) => showItem(currentIndex + change);

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    items.forEach((item) => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
  }));
  items.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(item); }
    });
  });
  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeLightbox(); return; }
    if (event.key === 'ArrowLeft') { move(-1); return; }
    if (event.key === 'ArrowRight') { move(1); return; }
    if (event.key !== 'Tab') return;
    const nodes = [...lightbox.querySelectorAll(focusableSelector)];
    const first = nodes[0];
    const last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
