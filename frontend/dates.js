/* ---------------------------------------------------------------
   DATE UTILITIES
----------------------------------------------------------------*/
export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISODate(d) {
  return d.toISOString().slice(0, 10);
}
