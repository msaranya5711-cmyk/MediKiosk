/* ---------------------------------------------------------------
   MEDICATION LOCAL STORAGE HELPERS
----------------------------------------------------------------*/
export function medicationLogKey(patientToken) {
  return `medikiosk.medlog.${patientToken || "anon"}`;
}

export function loadLocalMedicationLog(patientToken) {
  try {
    const raw = window.localStorage.getItem(medicationLogKey(patientToken));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalMedicationEntry(patientToken, date, taken) {
  const entries = loadLocalMedicationLog(patientToken).filter((e) => e.date !== date);
  entries.push({ date, taken });
  try {
    window.localStorage.setItem(medicationLogKey(patientToken), JSON.stringify(entries));
  } catch {
    // Storage may be unavailable (private browsing, quota)
  }
  return entries;
}
