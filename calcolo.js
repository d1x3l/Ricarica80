// calcolo.js - Versione definitiva 02-12-2025
// Calibrata sui test reali Dacia Spring 3,7 kW + freddo notturno

export function getTempFactor(temp, potenza = null) {
  temp = parseFloat(temp);
  const isSlowCharge = potenza !== null && potenza <= 3.8;

  if (temp >= 15) return 1.0;

  if (isSlowCharge) {
    // CURVA FINALE dopo tuo test notte 40% → 85% in ~6h a ~3°C
    if (temp >= 10) return 1.35;
    if (temp >= 7)  return 1.70;
    if (temp >= 5)  return 2.00;
    if (temp >= 3)  return 2.18;
    if (temp >= 1)  return 2.35;
    if (temp >= -2) return 2.55;
    if (temp >= -5) return 2.80;
    return 3.0 + (temp * -0.08);
  } else {
    // Ricarica veloce o modalità automatica
    if (temp >= 10) return 1.15;
    if (temp >= 7)  return 1.35;
    if (temp >= 3)  return 1.62;
    if (temp >= 0)  return 1.85;
    return 2.1 + (temp * -0.05);
  }
}

export function calcolaTempo80(percAttuale, tempo100min = 0, capacita = 0, potenza = 0, temp = 25, isAuto = true) {
  const tempoBaseMin = isAuto
    ? (80 - percAttuale) / (100 - percAttuale) * tempo100min
    : ((80 - percAttuale) / 100 * capacita / potenza) * 60;

  const fattore = temp < 15 ? getTempFactor(temp, isAuto ? null : potenza) : 1;
  return tempoBaseMin * fattore;
}

export function formattaTempo(minutiTotali) {
  const h = Math.floor(minutiTotali / 60);
  const m = Math.round(minutiTotali % 60);
  return h > 0 ? `${h}h ${m}min` : `${m} minuti`;
}

export function calcolaOrario(minutiDaOra) {
  const ora = new Date();
  ora.setMinutes(ora.getMinutes() + Math.round(minutiDaOra));
  return ora.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'});
}
