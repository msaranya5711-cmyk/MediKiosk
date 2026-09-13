import { useTilt } from "../../hooks/useTilt.js";
import { C } from "../../constants/theme.js";

export function PrimaryButton({ children, onClick, icon: Icon, full, disabled, type = "button" }) {
  const tilt = useTilt(disabled ? 0 : 10);
  return (
    <button
      ref={tilt.ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm ${full ? "w-full" : ""}`}
      style={{
        ...tilt.style,
        background: disabled ? "#E7EAE5" : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
        color: disabled ? "#A2ABA3" : "#0B2A20",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 12px 28px -10px rgba(63,174,134,0.5)",
      }}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, icon: Icon }) {
  const tilt = useTilt(10);
  return (
    <button
      ref={tilt.ref}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm"
      style={{
        ...tilt.style,
        background: "#FFFFFF",
        color: C.ink,
        border: `1.5px solid ${C.line}`,
        boxShadow: "0 2px 6px -2px rgba(32,36,31,0.08)",
      }}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}
