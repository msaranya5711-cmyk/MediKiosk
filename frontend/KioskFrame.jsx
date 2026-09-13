import { C } from "../../constants/theme.js";

export function KioskFrame({ children, step, totalSteps, hideProgress, sectionLabel }) {
  return (
    <div className="mk-screen max-w-2xl mx-auto px-6 py-12">
      {!hideProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: C.accent }}>{sectionLabel}</span>
            <span className="text-xs" style={{ color: C.inkSoft }}>{step} of {totalSteps}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.32)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(step / totalSteps) * 100}%`,
                background: `linear-gradient(90deg, ${C.primaryLight}, ${C.accent})`,
                transition: "width 0.35s ease",
              }}
            />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
