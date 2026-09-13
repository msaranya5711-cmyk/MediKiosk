import { useState, useEffect } from "react";
import { ClipboardList, Volume2, CheckCircle2 } from "lucide-react";
import { KioskFrame } from "../common/KioskFrame.jsx";
import { TiltCard } from "../common/TiltCard.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { generateClinicalSummary } from "../../services/clinicalService.js";
import { STRINGS } from "../../constants/languages.js";
import { C } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: SUMMARY GENERATION
----------------------------------------------------------------*/
export function Summary({ answers, docs, mode, redFlag, language, onDone, patientToken }) {
  const t = STRINGS[language];
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [lang, setLang] = useState("en");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    generateClinicalSummary({ answers, mode, docs, redFlag, patientToken }).then((s) => {
      if (active) {
        setSummary(s);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [answers, mode, docs, redFlag, patientToken]);

  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    onDone(summary);
  };

  const sections = summary
    .split(/\n{2,}/)
    .map((block) => {
      const [head, ...rest] = block.split("\n");
      return { head: head?.trim(), body: rest.join(" ").trim() };
    })
    .filter((s) => s.head);

  return (
    <KioskFrame hideProgress>
      <div className="text-center mb-8">
        <ClipboardList size={28} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>
          {loading ? t.buildingSummary : t.summaryReady}
        </h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          {loading ? t.buildingSummarySub : t.summaryReadyBody}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{ border: `3px solid ${C.line}`, borderTopColor: C.primary, borderRightColor: C.accent }}
          />
        </div>
      ) : (
        <TiltCard className="p-6" maxTilt={3.5} radius={20}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>
              Physician-ready summary
            </span>
            <div className="flex gap-1 p-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.28)" }}>
              {["en", "hi"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: lang === l ? "#fff" : "transparent", color: lang === l ? "#06201C" : C.inkSoft }}
                >
                  {l === "en" ? "English" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>

          {lang === "hi" ? (
            <div className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm" style={{ background: C.accentPale, color: C.ink }}>
              <Volume2 size={16} />
              आपका सारांश ऑडियो में सुनाया जाएगा — डॉक्टर की स्क्रीन पर अंग्रेज़ी में दिखेगा।
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((s) => (
                <div key={s.head}>
                  <div className="text-xs font-semibold" style={{ color: C.accent }}>
                    {s.head.replace(/^\*+|\*+$/g, "")}
                  </div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: C.ink }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TiltCard>
      )}

      {!loading && (
        <div className="mt-8">
          <PrimaryButton onClick={handleConfirm} icon={CheckCircle2} full disabled={submitting}>
            {submitting ? "Sending…" : t.confirmSend}
          </PrimaryButton>
        </div>
      )}
    </KioskFrame>
  );
}
