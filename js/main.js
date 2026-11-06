// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  });
});

// Тень шапки при прокрутке
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Текущий год в подвале
document.getElementById('year').textContent = new Date().getFullYear();

// Логотип: плавно вверх страницы
document.querySelector('.logo').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
});

// Если меню не помещается в строку (например, после автоперевода страницы
// на русский пункты становятся длиннее) — переключаем шапку на бургер.
// Ширину меню меряем на невидимой копии, чтобы не дёргать само меню.
const headerInner = header.querySelector('.header__inner');
const logo = header.querySelector('.logo');
const measure = (tight) => {
  const probe = nav.cloneNode(true);
  probe.removeAttribute('id');
  probe.classList.remove('is-open');
  probe.classList.toggle('nav--tight', tight);
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;';
  document.body.appendChild(probe);
  const w = probe.scrollWidth;
  probe.remove();
  return w;
};
const fitNav = () => {
  if (window.innerWidth <= 1100) { // там бургер включает CSS
    header.classList.remove('is-compact', 'is-tight');
    return;
  }
  const cs = getComputedStyle(headerInner);
  const free = headerInner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    - logo.offsetWidth - parseFloat(cs.columnGap || 24);
  const fits = measure(false) <= free;
  const fitsTight = fits || measure(true) <= free;
  // сначала пробуем ужать расстояния между пунктами, и только потом — бургер
  header.classList.toggle('is-tight', !fits && fitsTight);
  header.classList.toggle('is-compact', !fitsTight);
};
fitNav();
window.addEventListener('resize', fitNav);
if (document.fonts) document.fonts.ready.then(fitNav);
// Переводчик браузера меняет тексты уже после загрузки — следим за ними
new MutationObserver(fitNav).observe(nav, { childList: true, characterData: true, subtree: true });
new MutationObserver(fitNav).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
