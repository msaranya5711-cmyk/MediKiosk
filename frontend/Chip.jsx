import { Check } from "lucide-react";
import { useTilt } from "../../hooks/useTilt.js";
import { C } from "../../constants/theme.js";

export function Chip({ children, onClick, active }) {
  const tilt = useTilt(16);
  return (
    <button
      type="button"
      ref={tilt.ref}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-left px-4 py-3 rounded-full text-sm font-medium"
      style={{
        ...tilt.style,
        border: `1.5px solid ${active ? "transparent" : C.line}`,
        background: active ? C.primary : "#FFFFFF",
        color: active ? "#0B2A20" : C.ink,
        boxShadow: active ? "0 8px 18px -10px rgba(63,174,134,0.55)" : "0 2px 6px -2px rgba(32,36,31,0.08)",
      }}
    >
      {active && <Check size={14} strokeWidth={3} />}
      {children}
    </button>
  );
}
