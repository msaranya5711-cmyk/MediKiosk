import { useState, useRef, useEffect } from "react";

/* ---------------------------------------------------------------
   3D TILT — Reusable hook attaching mouse-tracked 3D tilt directly
   to the referenced element.
----------------------------------------------------------------*/
export function useTilt(maxTilt = 10) {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      setRot({ x: (0.5 - py) * maxTilt, y: (px - 0.5) * maxTilt });
    };
    const onMouseLeave = () => {
      setRot({ x: 0, y: 0 });
      setPressed(false);
    };
    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
    };
  }, [maxTilt]);

  const magnitude = Math.abs(rot.x) + Math.abs(rot.y);
  const scale = pressed ? 0.96 : magnitude > 0 ? 1 + Math.min(magnitude, 20) / 260 : 1;

  const style = {
    transform: `perspective(700px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${scale})`,
    transition: "transform 0.15s ease-out",
  };

  return { ref, style };
}
