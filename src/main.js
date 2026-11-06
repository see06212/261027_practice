import './style.css';

const pageViews = [...document.querySelectorAll('[data-view]')];
const pageLinks = [...document.querySelectorAll('[data-page]')];
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function showPage(page, { updateHistory = false, scroll = true } = {}) {
  const knownPage = pageViews.some((view) => view.dataset.view === page);
  const activePage = knownPage && page !== 'home' ? page : 'home';

  pageViews.forEach((view) => {
    view.hidden = view.dataset.view !== activePage;
  });

  pageLinks.forEach((link) => {
    const isActive = link.dataset.page === activePage;
    if (link.closest('.site-nav')) {
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  });

  menuToggle?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');

  if (updateHistory) history.pushState({ page: activePage }, '', `#${activePage}`);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showPage(link.dataset.page, { updateHistory: true });
  });
});

window.addEventListener('popstate', () => {
  showPage(window.location.hash.slice(1) || 'home', { scroll: false });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});

showPage(window.location.hash.slice(1) || 'home', { scroll: false });

const slides = [...document.querySelectorAll('.highlight-slide')];
const dotsContainer = document.querySelector('.carousel-dots');
const carousel = document.querySelector('.home-highlights');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentSlide = 0;
let autoplayTimer;
let isPaused = false;

function displaySlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isCurrent = slideIndex === currentSlide;
    slide.classList.toggle('is-current', isCurrent);
    slide.setAttribute('aria-hidden', String(!isCurrent));
  });
  [...(dotsContainer?.children || [])].forEach((dot, dotIndex) => {
    dot.classList.toggle('is-current', dotIndex === currentSlide);
    dot.setAttribute('aria-current', String(dotIndex === currentSlide));
  });
}

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show highlight ${index + 1}`);
  dot.addEventListener('click', () => displaySlide(index));
  dotsContainer?.append(dot);
});

document.querySelector('.carousel-prev')?.addEventListener('click', () => displaySlide(currentSlide - 1));
document.querySelector('.carousel-next')?.addEventListener('click', () => displaySlide(currentSlide + 1));

function startAutoplay() {
  window.clearInterval(autoplayTimer);
  if (reducedMotion || isPaused || slides.length < 2) return;
  autoplayTimer = window.setInterval(() => displaySlide(currentSlide + 1), 6500);
}

carousel?.addEventListener('mouseenter', () => { isPaused = true; startAutoplay(); });
carousel?.addEventListener('mouseleave', () => { isPaused = false; startAutoplay(); });
carousel?.addEventListener('focusin', () => { isPaused = true; startAutoplay(); });
carousel?.addEventListener('focusout', (event) => {
  if (!carousel.contains(event.relatedTarget)) { isPaused = false; startAutoplay(); }
});
document.addEventListener('visibilitychange', () => {
  isPaused = document.hidden;
  startAutoplay();
});
displaySlide(0);
startAutoplay();

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
