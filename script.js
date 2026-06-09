const alvo = new Date('2026-06-10T19:00:00-03:00').getTime();

function atualizar() {
  const dif = alvo - Date.now();

  if (dif <= 0) {
    document.getElementById('tarja').style.display = 'none';
    clearInterval(intervalo);
    return;
  }

  const horas = Math.floor(dif / (1000 * 60 * 60));
  const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((dif % (1000 * 60)) / 1000);

  document.getElementById('horas').textContent = String(horas).padStart(2, '0');
  document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
  document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

atualizar();
const intervalo = setInterval(atualizar, 1000);