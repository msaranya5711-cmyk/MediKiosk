import { Languages, ChevronRight } from "lucide-react";
import { useTilt } from "../../hooks/useTilt.js";
import { KioskFrame } from "../common/KioskFrame.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { LANGS } from "../../constants/languages.js";
import { C } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: LANGUAGE + MODE SELECT
----------------------------------------------------------------*/
function LanguageTile({ label, active, onClick }) {
  const tilt = useTilt(14);
  return (
    <button
      ref={tilt.ref}
      onClick={onClick}
      className="py-5 rounded-xl text-lg font-semibold"
      style={{
        ...tilt.style,
        border: `1.5px solid ${active ? C.primary : C.line}`,
        background: active ? C.primaryPale : "rgba(255,255,255,0.08)",
        color: C.ink,
      }}
    >
      {label}
    </button>
  );
}

function ModeTile({ label, active, onClick }) {
  const tilt = useTilt(10);
  return (
    <button
      ref={tilt.ref}
      onClick={onClick}
      className="py-4 rounded-xl text-sm font-semibold"
      style={{
        ...tilt.style,
        border: `1.5px solid ${active ? C.primary : C.line}`,
        background: active ? C.primaryPale : "rgba(255,255,255,0.08)",
        color: C.ink,
      }}
    >
      {label}
    </button>
  );
}

export function LanguageSelect({ onNext, mode, setMode, language, setLanguage }) {
  return (
    <KioskFrame step={0} totalSteps={0} hideProgress>
      <div className="text-center max-w-lg mx-auto">
        <Languages size={28} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>
          Choose your language
        </h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          भाषा चुनें · உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
        </p>
        <div className="grid grid-cols-2 gap-3 mt-8">
          {LANGS.map((l) => (
            <LanguageTile key={l.id} label={l.label} active={language === l.id} onClick={() => setLanguage(l.id)} />
          ))}
        </div>

        <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="text-sm font-semibold mb-3" style={{ color: C.ink }}>
            Which OPD is this for?
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModeTile label="General / Allopathic" active={mode === "general"} onClick={() => setMode("general")} />
            <ModeTile label="AYUSH / Ayurveda" active={mode === "ayush"} onClick={() => setMode("ayush")} />
          </div>
        </div>

        <div className="mt-10">
          <PrimaryButton onClick={onNext} icon={ChevronRight} full>
            Continue
          </PrimaryButton>
        </div>
      </div>
    </KioskFrame>
  );
}
