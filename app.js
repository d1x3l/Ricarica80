// app.js – VERSIONE CORRETTA E DEFINITIVA 02-12-2025
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab, .content').forEach(el => el.classList.remove('active'));
    tab.classList.add('active');                         // ← punto corretto!
    document.getElementById(tab.dataset.tab).classList.add('active');
  };
});

function toggleTemp() {
  document.getElementById('temperatura').style.display =
    document.getElementById('usaTemp').checked ? 'block' : 'none';
}

function impostaCapacita() {
  const input = document.getElementById('capacita');
  if (document.getElementById('modelloAuto').value === "spring") {
    input.value = "26.8";
    input.readOnly = true;
  } else {
    input.value = "";
    input.readOnly = false;
    input.focus();
  }
}

// CURVA 02-12-2025 (test notturno 40→85% in ~6 ore con discesa sotto 3°C)
function getTempFactor(temp, potenza = null) {
  temp = parseFloat(temp);
  const isSlowCharge = potenza !== null && potenza <= 3.8;

  if (temp >= 15) return 1.0;

  if (isSlowCharge) {
    if (temp >= 10) return 1.35;
    if (temp >= 7)  return 1.70;
    if (temp >= 5)  return 2.00;
    if (temp >= 3)  return 2.18;
    if (temp >= 1)  return 2.35;
    if (temp >= -2) return 2.55;
    if (temp >= -5) return 2.80;
    return 3.0 + (temp * -0.08);
  } else {
    if (temp >= 10) return 1.15;
    if (temp >= 5)  return 1.50;
    if (temp >= 3)  return 1.70;
    return 1.90 + (temp * -0.03);
  }
}

function calcolaAutomatico() { calcola(true); }
function calcolaManuale()   { calcola(false); }

function calcola(isAuto) {
  let perc = 0, tempo100min = 0, cap = 0, kw = 0;

  if (isAuto) {
    perc = parseFloat(document.getElementById('percAttualeAuto').value) || 0;
    const ore = parseInt(document.getElementById('ore100').value) || 0;
    const min = parseInt(document.getElementById('min100').value) || 0;
    tempo100min = ore * 60 + min;
  } else {
    perc = parseFloat(document.getElementById('percAttuale').value) || 0;
    cap = parseFloat(document.getElementById('capacita').value) || 0;
    kw  = parseFloat(document.getElementById('potenza').value) || 0;
  }

  const usaTemp = document.getElementById('usaTemp').checked;
  const temp = usaTemp ? document.getElementById('temperatura').value : 25;

  if (perc < 1 || perc >= 100 || (isAuto && tempo100min <= 0) || (!isAuto && (!cap || !kw))) {
    return alert("Controlla i dati inseriti");
  }

  const tempoBaseMin = isAuto
    ? (80 - perc) / (100 - perc) * tempo100min
    : ((80 - perc) / 100 * cap / kw) * 60;

  const fattore = usaTemp ? getTempFactor(temp, isAuto ? null : kw) : 1;
  const tempoFinaleMin = tempoBaseMin * fattore;

  const impatto = usaTemp && fattore > 1.01
    ? `Temperatura ${temp}°C → +${Math.round((fattore-1)*100)}% tempo`
    : '';

  mostraRisultato(tempoFinaleMin, impatto);
}

function mostraRisultato(minutiTotali, impatto) {
  const h = Math.floor(minutiTotali / 60);
  const m = Math.round(minutiTotali % 60);
  const testo = h > 0 ? `${h}h ${m}min` : `${m} minuti`;

  const ora = new Date();
  ora.setMinutes(ora.getMinutes() + Math.round(minutiTotali));
  const orario = ora.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  document.getElementById('tempoRimanente').textContent = testo;
  document.getElementById('orarioFinale').textContent = orario;

  const el = document.getElementById('impattoTemp');
  el.textContent = impatto;
  el.style.display = impatto ? 'block' : 'none';

  document.getElementById('risultato').classList.add('show');
                     }
