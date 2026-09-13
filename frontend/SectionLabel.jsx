import { C } from "../../constants/theme.js";

export function SectionLabel({ children }) {
  return (
    <div className="text-xs font-semibold tracking-wide" style={{ color: C.primary }}>
      {children}
    </div>
  );
}
