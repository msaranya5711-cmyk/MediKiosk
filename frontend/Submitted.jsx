import { CheckCircle2, Pill, MapPin } from "lucide-react";
import { GhostButton } from "../common/Buttons.jsx";
import { KioskFrame } from "../common/KioskFrame.jsx";
import { STRINGS } from "../../constants/languages.js";
import { C } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: SUBMITTED CONFIRMATION
----------------------------------------------------------------*/
export function Submitted({ onSeePhysicianView, onOrderMedicine, onFindCare, language }) {
  const t = STRINGS[language];
  return (
    <KioskFrame hideProgress>
      <div className="text-center max-w-md mx-auto py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: C.successPale }}>
          <CheckCircle2 size={30} color={C.success} />
        </div>
        <h2 className="text-2xl mt-5" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>
          {t.sentTitle}
        </h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          {t.sentBody}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          {onOrderMedicine && (
            <GhostButton icon={Pill} onClick={onOrderMedicine}>
              Order medicines online
            </GhostButton>
          )}
          {onFindCare && (
            <GhostButton icon={MapPin} onClick={onFindCare}>
              Find nearby care
            </GhostButton>
          )}
        </div>

        <button onClick={onSeePhysicianView} className="text-sm font-semibold mt-6" style={{ color: C.primary }}>
          {t.seePhysician}
        </button>
      </div>
    </KioskFrame>
  );
}
