/* ---------------------------------------------------------------
   PHARMACY / MEDICINE CATALOG SEED & HELPERS
----------------------------------------------------------------*/
export const MEDICINE_CATEGORIES = [
  "All",
  "Pain & Fever",
  "Cold & Cough",
  "Stomach care",
  "Diabetes care",
  "Heart care",
  "First aid",
  "Vitamins & supplements",
  "Baby & mother care",
  "Devices",
];

export const MEDICINE_CATALOG_SEED = [
  { id: "med-paracetamol", name: "Paracetamol 500mg", category: "Pain & Fever", packSize: "Strip of 10 tablets", price: 25, rx: false },
  { id: "med-ibuprofen", name: "Ibuprofen 400mg", category: "Pain & Fever", packSize: "Strip of 10 tablets", price: 35, rx: false },
  { id: "med-ors", name: "ORS Rehydration Sachets", category: "Stomach care", packSize: "Box of 10 sachets", price: 60, rx: false },
  { id: "med-antacid", name: "Antacid Syrup", category: "Stomach care", packSize: "170ml bottle", price: 95, rx: false },
  { id: "med-coughsyrup", name: "Cough Syrup (dry cough)", category: "Cold & Cough", packSize: "100ml bottle", price: 110, rx: false },
  { id: "med-cetirizine", name: "Cetirizine 10mg", category: "Cold & Cough", packSize: "Strip of 10 tablets", price: 30, rx: false },
  { id: "med-metformin", name: "Metformin 500mg", category: "Diabetes care", packSize: "Strip of 15 tablets", price: 45, rx: true },
  { id: "med-glucostrips", name: "Glucometer test strips", category: "Diabetes care", packSize: "Box of 25 strips", price: 450, rx: false },
  { id: "med-amlodipine", name: "Amlodipine 5mg", category: "Heart care", packSize: "Strip of 10 tablets", price: 40, rx: true },
  { id: "med-bpmonitor", name: "Digital BP monitor", category: "Devices", packSize: "1 unit", price: 1499, rx: false },
  { id: "med-thermometer", name: "Digital thermometer", category: "Devices", packSize: "1 unit", price: 199, rx: false },
  { id: "med-bandage", name: "Adhesive bandages", category: "First aid", packSize: "Box of 20", price: 55, rx: false },
  { id: "med-antiseptic", name: "Antiseptic liquid", category: "First aid", packSize: "100ml bottle", price: 75, rx: false },
  { id: "med-multivitamin", name: "Daily multivitamin", category: "Vitamins & supplements", packSize: "Bottle of 30 tablets", price: 220, rx: false },
  { id: "med-calcium", name: "Calcium + Vitamin D3", category: "Vitamins & supplements", packSize: "Strip of 15 tablets", price: 140, rx: false },
  { id: "med-babyors", name: "Infant ORS", category: "Baby & mother care", packSize: "Box of 6 sachets", price: 70, rx: false },
];

export const EMPTY_MEDICINE_FORM = {
  name: "",
  category: "Pain & Fever",
  packSize: "",
  price: "",
  rx: false,
};

// Turns a medicine name into a stable-ish unique id, deduped against
// whatever's already in the catalog (handles re-adding similar names).
export function slugifyMedicineId(name, existingIds) {
  const base = "med-" + name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let id = base || `med-${Date.now()}`;
  let n = 2;
  while (existingIds.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}
