(() => {
  document.documentElement.classList.add('js');

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const setNavigation = (open) => {
    if (!toggle || !navigation) return;
    navigation.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    document.body.classList.toggle('no-scroll', open && mobileQuery.matches);
  };

  toggle?.addEventListener('click', () => setNavigation(!navigation.classList.contains('is-open')));
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNavigation(false)));
  document.addEventListener('click', (event) => {
    if (mobileQuery.matches && navigation?.classList.contains('is-open') && !navigation.contains(event.target) && !toggle?.contains(event.target)) setNavigation(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {
      setNavigation(false);
      toggle?.focus();
    }
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
    lastTrigger = trigger;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.querySelector('[data-modal-close]')?.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastTrigger?.focus();
  };
  document.querySelectorAll('[data-modal-open]').forEach((trigger) => trigger.addEventListener('click', () => openModal(trigger)));
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
