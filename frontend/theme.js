/* ---------------------------------------------------------------
   DESIGN TOKENS — soft, light neumorphic UI with a mint-green
   primary accent, matching the "Product UI Styleguide" reference:
   near-white surfaces, soft dual-layer shadows for elevation,
   pill-shaped controls, dark ink text on light cards.
----------------------------------------------------------------*/
export const C = {
  bg0: "#F6F7F4",
  bg1: "#EFF2EE",
  surface: "rgba(255,255,255,0.86)",
  ink: "#20241F",
  inkSoft: "#6C766F",
  primary: "#7FE0BE",
  primaryDeep: "#3FAE86",
  primaryLight: "#A9F0D6",
  primaryPale: "rgba(127,224,190,0.22)",
  accent: "#6C8CFF",
  accentPale: "rgba(108,140,255,0.14)",
  alert: "#E1725A",
  alertPale: "rgba(225,114,90,0.14)",
  warning: "#D9A62E",
  warningPale: "rgba(217,166,46,0.16)",
  success: "#3FAE86",
  successPale: "rgba(63,174,134,0.16)",
  line: "rgba(32,36,31,0.10)",
  glassBorder: "rgba(127,224,190,0.45)",
};

export const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

html, body, #root { background: ${C.bg1}; }

@keyframes screenIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes floatBlobA {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(20px,-16px); }
}
@keyframes floatBlobB {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(-16px,18px); }
}
@keyframes dashMove { to { stroke-dashoffset: 0; } }
@keyframes ping {
  0% { transform: scale(0.9); opacity: 0.7; }
  70% { transform: scale(1.9); opacity: 0; }
  100% { opacity: 0; }
}
.mk-screen { animation: screenIn 0.45s cubic-bezier(0.16,1,0.3,1) both; }
.mk-navscroll { scrollbar-width: none; -ms-overflow-style: none; }
.mk-navscroll::-webkit-scrollbar { display: none; }
`;

export function glassStyle(extra = {}) {
  return {
    background: C.surface,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${C.line}`,
    boxShadow: "0 20px 45px -28px rgba(32,36,31,0.18), 0 2px 10px rgba(32,36,31,0.06)",
    ...extra,
  };
}
