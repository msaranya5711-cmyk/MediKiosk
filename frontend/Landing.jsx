import { ChevronRight, Stethoscope, Activity } from "lucide-react";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { SectionLabel } from "../common/SectionLabel.jsx";
import { TiltCard } from "../common/TiltCard.jsx";
import { HeartbeatLine } from "../common/Visuals.jsx";
import { C } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: LANDING
----------------------------------------------------------------*/
export function Landing({ onStart, onNavigate }) {
  return (
    <div className="mk-screen max-w-5xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <div>
          <SectionLabel>AI clinical intake, at the point of arrival</SectionLabel>
          <h1 className="mt-3 text-5xl leading-[1.08]" style={{ fontFamily: "Fraunces, serif", color: C.ink, fontWeight: 500 }}>
            A two-minute consult starts with the history already written.
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: C.inkSoft, maxWidth: "46ch" }}>
            India's public OPDs give doctors 2–5 minutes per patient. MediKiosk lets patients speak or
            tap their history and scan their old prescriptions before they ever sit down — so the
            consultation can be spent examining, reasoning, and treating.
          </p>
          <div className="flex gap-3 mt-8">
            <PrimaryButton onClick={onStart} icon={ChevronRight}>Try the patient kiosk</PrimaryButton>
            <GhostButton onClick={() => onNavigate("physician")} icon={Stethoscope}>See physician view</GhostButton>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: C.primary }}>2–5 min</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>current OPD consult time, India</div>
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: C.primary }}>70–80%</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>diagnoses reachable from history alone</div>
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: C.primary }}>10,000+</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>daily OPD patients at apex hospitals</div>
            </div>
          </div>
        </div>

        <TiltCard className="p-6" radius={22} maxTilt={7}>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} color={C.primary} />
            <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>Vitals captured before the doctor sees the patient</span>
          </div>
          <HeartbeatLine />
          <div className="flex items-center gap-2 mb-4 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ background: C.success }} />
            <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>What the platform does, in order</span>
          </div>
          {[
            ["Identify", "Patient logs in with ABHA ID, picks a language, gives audio-guided consent."],
            ["Converse", "AI conducts a voice + touch history interview; red flags trigger priority triage."],
            ["Scan", "Prior prescriptions and lab reports are digitized and placed on a timeline."],
            ["Summarize & Route", "A structured history is generated and pushed to HIS and the patient's ABHA record."],
            ["Consult", "The physician opens a complete history in seconds and spends the visit on care."],
          ].map(([title, body], i) => (
            <div key={title} className="flex gap-4 py-3" style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5" style={{ background: C.primaryPale, color: C.primary, transform: "translateZ(14px)" }}>
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: C.ink }}>{title}</div>
                <div className="text-sm mt-0.5" style={{ color: C.inkSoft }}>{body}</div>
              </div>
            </div>
          ))}
        </TiltCard>
      </div>
    </div>
  );
}
