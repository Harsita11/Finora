"use client";

import { useEffect, useRef } from "react";

// A short chain of small orbs that trail behind the cursor, each one
// easing toward the previous one's position (classic "snake" follow
// effect), with a thin connecting line through them. Runs on requestAnimationFrame
// and writes directly to DOM attributes (no React state) to stay smooth.

const TRAIL_LENGTH = 10;
const EASE = 0.35;

export function CursorTrail() {
  const circleRefs = useRef([]);
  const polylineRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const pointsRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Skip entirely on touch devices (no real cursor) or reduced-motion prefs
    if (isCoarsePointer || reducedMotion) return;

    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      hasMovedRef.current = true;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });

    let raf;
    const tick = () => {
      const pts = pointsRef.current;
      pts[0].x += (mouseRef.current.x - pts[0].x) * EASE;
      pts[0].y += (mouseRef.current.y - pts[0].y) * EASE;
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * EASE;
        pts[i].y += (pts[i - 1].y - pts[i].y) * EASE;
      }

      if (hasMovedRef.current) {
        circleRefs.current.forEach((el, i) => {
          if (!el) return;
          el.setAttribute("cx", pts[i].x);
          el.setAttribute("cy", pts[i].y);
        });
        if (polylineRef.current) {
          polylineRef.current.setAttribute(
            "points",
            pts.map((p) => `${p.x},${p.y}`).join(" ")
          );
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
      aria-hidden="true"
    >
      <polyline
        ref={polylineRef}
        points=""
        fill="none"
        className="stroke-indigo-400 dark:stroke-cyan-300"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <circle
          key={i}
          ref={(el) => (circleRefs.current[i] = el)}
          cx={-100}
          cy={-100}
          r={Math.max(1.5, 5 - i * 0.4)}
          className="fill-indigo-400 dark:fill-cyan-300"
          opacity={Math.max(0.05, 0.6 - i * 0.05)}
        />
      ))}
    </svg>
  );
}
