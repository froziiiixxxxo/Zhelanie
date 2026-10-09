(() => {
  document.documentElement.classList.add('js');

  const scrollLocks = new Set();
  const lockScroll = (key) => {
    scrollLocks.add(key);
    document.body.classList.add('no-scroll');
  };
  const unlockScroll = (key) => {
    scrollLocks.delete(key);
    if (!scrollLocks.size) document.body.classList.remove('no-scroll');
  };
  window.ZhelanieUI = { lockScroll, unlockScroll };

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const mobileQuery = window.matchMedia('(max-width: 960px)');
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const toggleLabel = toggle?.querySelector('.visually-hidden');

  const setNavigation = (open) => {
    if (!toggle || !navigation) return;
    const isOpen = Boolean(open && mobileQuery.matches);
    navigation.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggleLabel && (toggleLabel.textContent = isOpen ? 'Закрыть меню' : 'Открыть меню');
    toggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    navigation.setAttribute('aria-hidden', mobileQuery.matches ? String(!isOpen) : 'false');
    if (isOpen) lockScroll('nav'); else unlockScroll('nav');
    if (isOpen) navigation.querySelector('a, button')?.focus();
  };

  if (navigation) setNavigation(false);
  toggle?.addEventListener('click', () => setNavigation(!navigation.classList.contains('is-open')));
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNavigation(false)));
  document.addEventListener('click', (event) => {
    if (mobileQuery.matches && navigation?.classList.contains('is-open') && !navigation.contains(event.target) && !toggle?.contains(event.target)) setNavigation(false);
  });
  document.addEventListener('keydown', (event) => {
    if (!navigation?.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      setNavigation(false);
      toggle?.focus();
      return;
    }
    if (event.key !== 'Tab') return;
    const nodes = [...navigation.querySelectorAll(focusableSelector)];
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobileQuery.addEventListener('change', () => setNavigation(false));

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const modal = document.querySelector('#contact-modal');
  let lastTrigger = null;
  const trapFocus = (event, element) => {
    if (event.key !== 'Tab') return;
    const nodes = [...element.querySelectorAll(focusableSelector)];
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const openModal = (trigger) => {
    if (!modal) return;
    setNavigation(false);
    lastTrigger = trigger;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll('modal');
    modal.querySelector('[data-modal-close]')?.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    unlockScroll('modal');
    lastTrigger?.focus();
  };
  document.querySelectorAll('[data-modal-open]').forEach((trigger) => trigger.addEventListener('click', () => openModal(trigger)));
  modal?.setAttribute('aria-hidden', 'true');
  modal?.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  modal?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
    trapFocus(event, modal);
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }
})();
