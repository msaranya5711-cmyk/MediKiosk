import { useState, useRef } from "react";
import { glassStyle } from "../../constants/theme.js";

// Larger surfaces (hero panels, question card) — tilt + a soft moving
// highlight, so the panel reads as a raised, softly-lit card.
export function TiltCard({ children, className = "", style = {}, maxTilt = 7, radius = 20 }) {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 30, o: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setRot({ x: (0.5 - py) * maxTilt * 2, y: (px - 0.5) * maxTilt * 2 });
    setGlare({ x: px * 100, y: py * 100, o: 0.35 });
  };
  const onLeave = () => {
    setRot({ x: 0, y: 0 });
    setGlare((g) => ({ ...g, o: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        transform: `perspective(1400px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition: "transform 0.25s ease-out",
        transformStyle: "preserve-3d",
        ...glassStyle(),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: glare.o,
          transition: "opacity 0.35s ease",
          background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35), transparent 60%)`,
          mixBlendMode: "overlay",
        }}
      />
      <div style={{ position: "relative", transform: "translateZ(16px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
