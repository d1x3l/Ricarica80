// Fattore fisso calibrato su test reali a ~5°C con ricarica lenta (≤3,8 kW)
const FATTORE_TEMP = 2.00;

export function calcolaTempo80(percAttuale, tempo100min = 0, capacita = 0, potenza = 0, isAuto = true) {
  const tempoBaseMin = isAuto
    ? (80 - percAttuale) / (100 - percAttuale) * tempo100min
    : ((80 - percAttuale) / 100 * capacita / potenza) * 60;
  return tempoBaseMin * FATTORE_TEMP;
}

export function formattaTempo(minutiTotali) {
  const h = Math.floor(minutiTotali / 60);
  const m = Math.round(minutiTotali % 60);
  return h > 0 ? `${h}h ${m}min` : `${m} minuti`;
}

export function calcolaOrario(minutiDaOra) {
  const ora = new Date();
  ora.setMinutes(ora.getMinutes() + Math.round(minutiDaOra));
  return ora.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}