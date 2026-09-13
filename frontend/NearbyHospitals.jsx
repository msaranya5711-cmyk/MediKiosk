import { useState } from "react";
import { MapPin, Filter, Stethoscope, Phone, Navigation, CalendarClock, CheckCircle2 } from "lucide-react";
import { TiltCard } from "../common/TiltCard.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { Chip } from "../common/Chip.jsx";
import { SPECIALTIES, matchSpecialtyId, facilityMatchesSpecialty } from "../../constants/specialties.js";
import { haversineKm } from "../../utils/geo.js";
import { C, glassStyle } from "../../constants/theme.js";

function HospitalCard({ hospital, onBook }) {
  return (
    <TiltCard className="p-4" maxTilt={2} radius={18}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{hospital.name}</div>
          {hospital.address && <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{hospital.address}</div>}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: C.primaryDeep }}>{hospital.distanceKm.toFixed(1)} km away</span>
            {hospital.emergency && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.alertPale, color: C.alert }}>24/7 Emergency</span>
            )}
            {hospital.type === "clinic" && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.accentPale, color: C.accent }}>Clinic</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
          <Stethoscope size={18} color={C.primaryDeep} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {hospital.phone ? (
          <a href={`tel:${hospital.phone.replace(/[^\d+]/g, "")}`}>
            <GhostButton icon={Phone}>Call</GhostButton>
          </a>
        ) : (
          <a href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lon}`} target="_blank" rel="noreferrer">
            <GhostButton icon={Navigation}>Directions</GhostButton>
          </a>
        )}
        <PrimaryButton icon={CalendarClock} onClick={() => onBook(hospital)}>Book appointment</PrimaryButton>
      </div>
    </TiltCard>
  );
}

export function NearbyHospitals({ suggestedSpecialty }) {
  const [status, setStatus] = useState("idle");
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [radiusKm] = useState(8);
  const [specialty, setSpecialty] = useState(() => matchSpecialtyId(suggestedSpecialty));
  const [bookingFor, setBookingFor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: "", time: "", reason: "" });
  const [bookingSent, setBookingSent] = useState(false);

  const findNearby = () => {
    setError("");
    setStatus("locating");

    if (!navigator.geolocation) {
      setError("Location isn't supported in this browser. Please ask kiosk staff for the nearest hospital.");
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus("loading");
        try {
          const radiusM = radiusKm * 1000;
          const query = `[out:json][timeout:25];(
            node["amenity"="hospital"](around:${radiusM},${latitude},${longitude});
            way["amenity"="hospital"](around:${radiusM},${latitude},${longitude});
            node["amenity"="clinic"](around:${radiusM},${latitude},${longitude});
            way["amenity"="clinic"](around:${radiusM},${latitude},${longitude});
          );out center 40;`;

          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          });
          if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
          const data = await res.json();

          const results = (data.elements || [])
            .map((el) => {
              const lat = el.lat ?? el.center?.lat;
              const lon = el.lon ?? el.center?.lon;
              if (lat == null || lon == null) return null;
              const tags = el.tags || {};
              const addressParts = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]].filter(Boolean);
              return {
                id: `${el.type}-${el.id}`,
                name: tags.name || (tags.amenity === "clinic" ? "Unnamed clinic" : "Unnamed hospital"),
                type: tags.amenity,
                phone: tags.phone || tags["contact:phone"] || null,
                address: addressParts.length ? addressParts.join(", ") : null,
                emergency: tags.emergency === "yes",
                rawSpecialty: [tags["healthcare:speciality"], tags.healthcare, tags.department].filter(Boolean).join(" "),
                distanceKm: haversineKm(latitude, longitude, lat, lon),
                lat,
                lon,
              };
            })
            .filter(Boolean)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, 20);

          setHospitals(results);
          setStatus("ready");
        } catch (err) {
          console.error("Nearby hospital lookup failed:", err);
          setError("Couldn't reach the hospital directory right now. Please check your connection and try again.");
          setStatus("error");
        }
      },
      (geoErr) => {
        setStatus("error");
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError("Location access is blocked. Allow location permission for this site and try again.");
        } else {
          setError("Couldn't get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const openBooking = (hospital) => {
    setBookingFor(hospital);
    setBookingForm({ name: "", time: "", reason: "" });
    setBookingSent(false);
  };

  const submitBooking = () => {
    if (!bookingForm.name.trim() || !bookingForm.time.trim()) return;
    setBookingSent(true);
  };

  const specialtyMatches = specialty === "general" ? hospitals : hospitals.filter((h) => facilityMatchesSpecialty(h, specialty));
  const usedFallback = specialty !== "general" && hospitals.length > 0 && specialtyMatches.length === 0;
  const visibleHospitals = usedFallback ? hospitals : specialtyMatches;

  return (
    <div className="mk-screen max-w-2xl mx-auto px-6 py-10">
      <div className="text-center mb-6">
        <MapPin size={26} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-3" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Find nearby care</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          We'll use your device's location to find hospitals and clinics near you.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2.5 justify-center">
          <Filter size={13} color={C.inkSoft} />
          <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>Who do you need to see?</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SPECIALTIES.map((s) => (
            <Chip key={s.id} active={specialty === s.id} onClick={() => setSpecialty(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      {status === "idle" && (
        <div className="flex justify-center">
          <PrimaryButton onClick={findNearby} icon={MapPin}>Use my location</PrimaryButton>
        </div>
      )}
      {status === "locating" && (
        <div className="text-center text-sm" style={{ color: C.inkSoft }}>Getting your location…</div>
      )}
      {status === "loading" && (
        <div className="text-center text-sm" style={{ color: C.inkSoft }}>Searching nearby hospitals & clinics…</div>
      )}

      {error && (
        <div className="text-sm font-semibold px-4 py-3 rounded-xl mt-4 text-center" style={{ background: C.alertPale, color: C.alert }}>
          {error}
        </div>
      )}
      {status === "error" && (
        <div className="flex justify-center mt-4">
          <GhostButton onClick={findNearby} icon={MapPin}>Try again</GhostButton>
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs" style={{ color: C.inkSoft }}>
              {visibleHospitals.length} found within {radiusKm}km
              {specialty !== "general" && !usedFallback && ` · matching "${SPECIALTIES.find((s) => s.id === specialty)?.label}"`}
            </div>
            <GhostButton onClick={findNearby} icon={MapPin}>Refresh</GhostButton>
          </div>
          {usedFallback && (
            <div className="text-xs px-3 py-2 rounded-lg mb-3" style={{ background: C.accentPale, color: C.ink }}>
              No nearby listing was clearly tagged for that department — showing all nearby facilities instead. Call ahead to confirm they can treat you.
            </div>
          )}
          {visibleHospitals.length === 0 ? (
            <div className="text-sm text-center py-10" style={{ color: C.inkSoft }}>
              No hospitals or clinics found nearby. Please ask kiosk staff for help.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleHospitals.map((h) => (
                <HospitalCard key={h.id} hospital={h} onBook={openBooking} />
              ))}
            </div>
          )}
        </>
      )}

      {bookingFor && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-4" style={{ background: "rgba(32,36,31,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={glassStyle({ background: "#FFFFFF" })}>
            {!bookingSent ? (
              <>
                <div className="text-sm font-semibold" style={{ color: C.ink }}>Request an appointment</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>{bookingFor.name}</div>
                <div className="space-y-3 mt-4">
                  <input
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${C.line}`, background: "#FFFFFF", color: C.ink }}
                  />
                  <input
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm((f) => ({ ...f, time: e.target.value }))}
                    placeholder="Preferred date & time"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${C.line}`, background: "#FFFFFF", color: C.ink }}
                  />
                  <textarea
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm((f) => ({ ...f, reason: e.target.value }))}
                    placeholder="Reason for visit (optional)"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ border: `1.5px solid ${C.line}`, background: "#FFFFFF", color: C.ink }}
                  />
                </div>
                <div className="flex gap-2 mt-5">
                  <GhostButton onClick={() => setBookingFor(null)}>Cancel</GhostButton>
                  <PrimaryButton full onClick={submitBooking} disabled={!bookingForm.name.trim() || !bookingForm.time.trim()}>Send request</PrimaryButton>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={32} color={C.success} className="mx-auto" />
                <div className="text-sm font-semibold mt-3" style={{ color: C.ink }}>Request sent</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>
                  {bookingFor.name} will be notified of your appointment request and may call you to confirm.
                </div>
                <div className="mt-5">
                  <PrimaryButton full onClick={() => setBookingFor(null)}>Done</PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
