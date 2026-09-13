/* ---------------------------------------------------------------
   SPECIALTIES — used to let a patient filter nearby facilities by
   "who can treat this," and to match the AI assistant's suggested
   department. Keywords are matched against a facility's OSM name/
   tags client-side, since most OSM hospital entries don't carry a
   structured healthcare:speciality tag we can query reliably.
----------------------------------------------------------------*/
export const SPECIALTIES = [
  { id: "general", label: "General / Any", keywords: [] },
  { id: "emergency", label: "Emergency / Trauma", keywords: ["emergency", "trauma", "casualty"] },
  { id: "cardiology", label: "Heart (Cardiology)", keywords: ["heart", "cardiac", "cardio"] },
  { id: "orthopedics", label: "Bones (Orthopedics)", keywords: ["ortho", "bone", "joint"] },
  { id: "pediatrics", label: "Child (Pediatrics)", keywords: ["child", "paediatric", "pediatric", "kids"] },
  { id: "gynecology", label: "Women's health", keywords: ["women", "gynaec", "gynec", "maternity", "obstetric"] },
  { id: "ent", label: "Ear, Nose & Throat", keywords: ["ent", "ear", "nose", "throat"] },
  { id: "dental", label: "Dental", keywords: ["dental", "dentist", "tooth"] },
  { id: "eye", label: "Eye (Ophthalmology)", keywords: ["eye", "ophthalm", "vision"] },
  { id: "dermatology", label: "Skin (Dermatology)", keywords: ["skin", "derma"] },
  { id: "neurology", label: "Brain & Nerves", keywords: ["neuro", "brain"] },
  { id: "psychiatry", label: "Mental health", keywords: ["mental", "psychiatr", "psychology"] },
];

// Maps the AI assistant's free-text suggested department onto one of the
// filter chips above, so "Cardiology" from a chat suggestion pre-selects
// the right filter when the patient moves to Find Care.
export function matchSpecialtyId(freeText) {
  if (!freeText) return "general";
  const lower = freeText.toLowerCase();
  const hit = SPECIALTIES.find((s) => s.id !== "general" && s.keywords.some((k) => lower.includes(k)));
  return hit ? hit.id : "general";
}

export function facilityMatchesSpecialty(hospital, specialtyId) {
  if (specialtyId === "general") return true;
  const spec = SPECIALTIES.find((s) => s.id === specialtyId);
  if (!spec) return true;
  const haystack = `${hospital.name} ${hospital.rawSpecialty || ""}`.toLowerCase();
  return spec.keywords.some((k) => haystack.includes(k));
}
