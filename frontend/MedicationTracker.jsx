import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Check, X, Pill, ChevronRight } from "lucide-react";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { API_BASE_URL } from "../../constants/config.js";
import { C, glassStyle } from "../../constants/theme.js";
import { startOfWeek, toISODate } from "../../utils/dates.js";
import { loadLocalMedicationLog, saveLocalMedicationEntry } from "../../services/medicationStorage.js";

/* ---------------------------------------------------------------
   SCREEN: MEDICATION TRACKER
----------------------------------------------------------------*/
export function MedicationTracker({ patientToken, onOrderMedicine }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const todayISO = toISODate(today);

  useEffect(() => {
    if (!patientToken) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/medication/log`, {
          headers: { Authorization: `Bearer ${patientToken}` },
        });
        const data = await res.json();
        if (res.ok) {
          setEntries(data.entries || []);
          setOffline(false);
        } else {
          setError(data.error || "Couldn't load your medication log.");
        }
      } catch {
        setEntries(loadLocalMedicationLog(patientToken));
        setOffline(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [patientToken]);

  const entryFor = (iso) => entries.find((e) => e.date === iso);

  const toggleToday = async (taken) => {
    setSaving(true);
    setError("");
    if (offline) {
      setEntries(saveLocalMedicationEntry(patientToken, todayISO, taken));
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/medication/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${patientToken}` },
        body: JSON.stringify({ date: todayISO, taken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't save.");
        return;
      }
      setEntries(data.entries || []);
    } catch {
      setOffline(true);
      setEntries(saveLocalMedicationEntry(patientToken, todayISO, taken));
    } finally {
      setSaving(false);
    }
  };

  const weekTaken = weekDates.filter((d) => entryFor(toISODate(d))?.taken).length;
  const weekPossible = weekDates.filter((d) => toISODate(d) <= todayISO).length;
  const adherencePct = weekPossible > 0 ? Math.round((weekTaken / weekPossible) * 100) : 0;
  const ringCirc = 2 * Math.PI * 42;

  const todayEntry = entryFor(todayISO);

  return (
    <div className="mk-screen max-w-lg mx-auto px-6 py-10">
      <ShieldCheck size={26} color={C.primary} />
      <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>
        Medication tracker
      </h2>
      <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
        Log whether you took today's dose — this helps your doctor see your adherence at a glance.
      </p>
      {offline && !loading && (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: C.warning }}>
          <AlertTriangle size={12} /> Saving on this device only until the connection is back.
        </div>
      )}

      {loading ? (
        <div className="mt-10 text-center text-sm" style={{ color: C.inkSoft }}>
          Loading…
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-3xl p-6 flex items-center gap-6" style={glassStyle()}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={C.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringCirc - (ringCirc * adherencePct) / 100}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill={C.ink}>
                {adherencePct}%
              </text>
            </svg>
            <div>
              <div className="text-xs font-semibold" style={{ color: C.inkSoft }}>
                This week's adherence
              </div>
              <div className="text-sm mt-1" style={{ color: C.ink }}>
                {weekTaken} of {weekPossible} days logged as taken
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-5" style={glassStyle()}>
            <div className="text-xs font-semibold mb-3" style={{ color: C.inkSoft }}>
              This week
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((d) => {
                const iso = toISODate(d);
                const e = entryFor(iso);
                const isToday = iso === todayISO;
                const isFuture = iso > todayISO;
                let bg = "rgba(255,255,255,0.06)";
                if (e?.taken) bg = C.primary;
                else if (e && !e.taken) bg = C.alertPale;
                return (
                  <div key={iso} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: C.inkSoft }}>
                      {d.toLocaleDateString(undefined, { weekday: "narrow" })}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: bg, border: isToday ? `2px solid ${C.primary}` : "none", opacity: isFuture ? 0.35 : 1 }}
                    >
                      {e?.taken && <Check size={14} color="#06201C" />}
                      {e && !e.taken && <X size={12} color={C.alert} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-5" style={glassStyle()}>
            <div className="text-sm font-semibold mb-3" style={{ color: C.ink }}>
              Today's dose
            </div>
            <div className="flex gap-3">
              <PrimaryButton onClick={() => toggleToday(true)} icon={Check} disabled={saving}>
                {todayEntry?.taken ? "Marked as taken ✓" : "Taken"}
              </PrimaryButton>
              <GhostButton onClick={() => toggleToday(false)} icon={X}>
                {todayEntry && !todayEntry.taken ? "Marked as missed" : "Missed"}
              </GhostButton>
            </div>
          </div>

          {onOrderMedicine && (
            <button
              onClick={onOrderMedicine}
              className="w-full mt-6 flex items-center gap-3 p-4 rounded-2xl text-left"
              style={glassStyle()}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
                <Pill size={18} color={C.primaryDeep} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: C.ink }}>
                  Running low? Order a refill
                </div>
                <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>
                  Order your medicines online for home delivery
                </div>
              </div>
              <ChevronRight size={16} color={C.inkSoft} />
            </button>
          )}

          {error && (
            <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-4" style={{ background: C.alertPale, color: C.alert }}>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
