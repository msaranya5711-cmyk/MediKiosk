import { useState, useEffect } from "react";
import { C } from "../../constants/theme.js";

export function HeartbeatLine({ color = C.primary, height = 56 }) {
  const d = "M0,30 L40,30 L54,10 L68,50 L82,4 L96,30 L150,30 L164,14 L178,48 L192,30 L300,30";
  return (
    <svg viewBox="0 0 300 60" style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 420, strokeDashoffset: 420, animation: "dashMove 2.2s cubic-bezier(0.4,0,0.2,1) 0.2s forwards" }}
      />
    </svg>
  );
}

export function PulseRing({ color }) {
  return (
    <span style={{ position: "absolute", inset: 0, borderRadius: "9999px" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "9999px", background: color, animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
    </span>
  );
}

export function GradientBackdrop() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: `radial-gradient(140% 100% at 50% 0%, #FFFFFF, ${C.bg0} 55%, ${C.bg1} 100%)` }}>
      <div style={{ position: "absolute", top: "-14%", left: "-10%", width: 620, height: 620, animation: "floatBlobA 26s ease-in-out infinite" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(127,224,190,0.35), transparent 68%)",
            filter: "blur(50px)",
            transform: `translate(${mouse.x * 22}px, ${mouse.y * 22}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>
      <div style={{ position: "absolute", bottom: "-18%", right: "-12%", width: 680, height: 680, animation: "floatBlobB 30s ease-in-out infinite" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,140,255,0.16), transparent 70%)",
            filter: "blur(56px)",
            transform: `translate(${mouse.x * -18}px, ${mouse.y * -18}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>
      <div style={{ position: "absolute", top: "38%", right: "18%", width: 260, height: 260, animation: "floatBlobA 20s ease-in-out infinite reverse" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(169,240,214,0.4), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(32,36,31,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(32,36,31,0.02) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(circle at 50% 0%, black, transparent 75%)",
        }}
      />
    </div>
  );
}
