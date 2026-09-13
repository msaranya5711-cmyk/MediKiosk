import {
  Activity,
  ClipboardList,
  Sparkles,
  MapPin,
  Pill,
  Clock,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { C, glassStyle } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   TOP NAV — a floating glass capsule, not a full-width bar, echoing
   the pill-shaped chrome throughout the reference UI.
----------------------------------------------------------------*/
export function TopNav({ screen, onNavigate, resetAll }) {
  const navItems = [
    { id: "landing", label: "Overview", icon: Activity },
    { id: "language", label: "Patient kiosk", icon: ClipboardList, group: ["language", "consent", "interview", "documents", "summary", "submitted"] },
    { id: "aiChat", label: "AI assistant", icon: Sparkles },
    { id: "hospitals", label: "Find care", icon: MapPin },
    { id: "pharmacy", label: "Pharmacy", icon: Pill },
    { id: "medication", label: "Medication", icon: Clock },
    { id: "doctors", label: "Doctors", icon: MessageCircle },
    { id: "physician", label: "Physician view", icon: ShieldCheck },
  ];
  const isItemActive = (t) => (t.group ? t.group.includes(screen) : screen === t.id);

  return (
    <div className="sticky top-4 z-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={glassStyle()}>
          <button onClick={() => { resetAll(); onNavigate("landing"); }} className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
                boxShadow: "0 6px 16px -6px rgba(63,174,134,0.5)",
              }}
            >
              <Stethoscope size={16} color="#06201C" />
            </div>
            <span className="text-base font-semibold hidden sm:inline" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>
              MediKiosk
            </span>
          </button>

          <div className="flex items-center gap-1 overflow-x-auto mk-navscroll flex-1 min-w-0">
            {navItems.map((t) => {
              const active = isItemActive(t);
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => onNavigate(t.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0"
                  style={{
                    background: active ? C.primary : "transparent",
                    color: active ? "#0B2A20" : C.inkSoft,
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
