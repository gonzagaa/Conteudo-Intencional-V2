// ============================================================
// Inicialização única: timer, AOS, Swiper, Lenis, Panda lazy
// Tudo aqui roda com defer -> depois do DOM parsed, em ordem.
// ============================================================

// ---------- Timer da oferta ----------
(function initTimer() {
  const alvo = new Date('2026-06-10T19:00:00-03:00').getTime();
  const elHoras = document.getElementById('horas');
  const elMin = document.getElementById('minutos');
  const elSeg = document.getElementById('segundos');
  if (!elHoras || !elMin || !elSeg) return;

  let intervalo;

  function atualizar() {
    const dif = alvo - Date.now();

    if (dif <= 0) {
      const tarja = document.getElementById('tarja');
      if (tarja) tarja.style.display = 'none';
      const preco = document.getElementById('preco');
      if (preco) preco.textContent = '59,90';
      const obs = document.getElementById('obs-oferta');
      if (obs) obs.style.display = 'none';
      clearInterval(intervalo);
      return;
    }

    const horas = Math.floor(dif / (1000 * 60 * 60));
    const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((dif % (1000 * 60)) / 1000);

    elHoras.textContent = String(horas).padStart(2, '0');
    elMin.textContent = String(minutos).padStart(2, '0');
    elSeg.textContent = String(segundos).padStart(2, '0');
  }

  atualizar();
  intervalo = setInterval(atualizar, 1000);
})();

// ---------- AOS ----------
(function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 700,
    easing: 'ease-out-quart',
    once: true,
    offset: 50,
    delay: 0,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
})();

// ---------- Lenis (só desktop, evita custo no mobile) ----------
(function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
  if (isTouch) return;

  const lenis = new Lenis({
    smooth: true,
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.__lenis = lenis;
})();

// ---------- Swiper (só inicializa quando o slider entra no viewport) ----------
(function initSwiperLazy() {
  const el = document.querySelector('.checkout-depoimentos-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  let started = false;
  function start() {
    if (started) return;
    started = true;
    new Swiper(el, {
      loop: true,
      speed: 600,
      grabCursor: true,
      spaceBetween: 16,
      slidesPerView: 1,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.checkout-depoimentos-swiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1080: { slidesPerView: 2, spaceBetween: 24, centeredSlides: true },
      },
    });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      });
    }, { rootMargin: '300px' });
    io.observe(el);
  } else {
    start();
  }
})();

// ---------- Panda iframe lazy (injeta src após load) ----------
(function injectPandaIframe() {
  const iframe = document.querySelector('#vsl-gate iframe[data-src]');
  if (!iframe) return;

  function go() {
    if (iframe.src) return;
    iframe.src = iframe.dataset.src;
  }

  if (document.readyState === 'complete') {
    setTimeout(go, 150);
  } else {
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(go, { timeout: 1500 });
      } else {
        setTimeout(go, 300);
      }
    }, { once: true });
  }
})();
