// Tempo (em segundos) até liberar a página.
const VSL_DELAY_SECONDS = 120;

(function () {
    const gate = document.getElementById('vsl-gate');
    if (!gate) return;

    const html = document.documentElement;
    const body = document.body;

    // Aplica lock em um único frame, evitando reflow forçado.
    function lock() {
        requestAnimationFrame(() => {
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
            try { if (window.__lenis) window.__lenis.stop(); } catch (e) {}
        });
    }

    function unlock() {
        requestAnimationFrame(() => {
            html.style.overflow = '';
            body.style.overflow = '';
            try { if (window.__lenis) window.__lenis.start(); } catch (e) {}
            gate.classList.add('is-unlocked');
        });
    }

    lock();
    window.scrollTo(0, 0);

    setTimeout(unlock, VSL_DELAY_SECONDS * 1000);
})();
