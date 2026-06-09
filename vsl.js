// Tempo (em segundos) até liberar a página. Trocar para 120 = 2 minutos.
const VSL_DELAY_SECONDS = 10;

(function () {
    const gate = document.getElementById('vsl-gate');
    if (!gate) return;

    const html = document.documentElement;
    const body = document.body;

    function lock() {
        try { if (typeof lenis !== 'undefined' && lenis) lenis.stop(); } catch (e) {}
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
    }

    function unlock() {
        try { if (typeof lenis !== 'undefined' && lenis) lenis.start(); } catch (e) {}
        html.style.overflow = '';
        body.style.overflow = '';
        gate.classList.add('is-unlocked');
    }

    lock();
    window.scrollTo(0, 0);

    setTimeout(unlock, VSL_DELAY_SECONDS * 1000);
})();
