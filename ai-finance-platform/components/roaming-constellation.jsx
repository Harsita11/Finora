"use client";

import { useEffect, useRef, useState } from "react";

// Dots scatter across the ENTIRE visible screen, hold, then all animate
// together into a small shape — a different shape AND a different spot on
// screen each cycle — hold, disperse back out across the screen, fade out,
// repeat. Rendered once in the root layout, so it plays on every page.

const DOT_COUNT = 25;

function linePoints(x1, y1, x2, y2, count) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    return { left: x1 + (x2 - x1) * t, top: y1 + (y2 - y1) * t };
  });
}

// Each shape is authored around a nominal (cx, cy) anchor point. At runtime
// we translate every point by (targetCx - cx, targetCy - cy) so the same
// shape geometry can be dropped anywhere on screen.

// A smooth 5-pointed star, traced in polar coordinates.
function starShape() {
  const outerR = 12;
  const innerFactor = 0.4;
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const theta = (i / DOT_COUNT) * Math.PI * 2;
    const r =
      outerR *
      (innerFactor + (1 - innerFactor) * (0.5 + 0.5 * Math.cos(5 * theta)));
    return {
      left: 50 + r * Math.cos(theta),
      top: 50 + r * Math.sin(theta) * 0.85,
    };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// Classic parametric heart curve
function heartShape() {
  const scale = 0.62;
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const t = (i / DOT_COUNT) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    return { left: 50 + x * scale, top: 50 - y * scale };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// Figure-eight / infinity symbol (lemniscate)
function infinityShape() {
  const ax = 14;
  const ay = 6.5;
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const t = (i / DOT_COUNT) * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    return {
      left: 50 + (ax * Math.cos(t)) / denom,
      top: 50 + (ay * Math.sin(t) * Math.cos(t)) / denom,
    };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// Archimedean spiral, a few turns outward from the center
function spiralShape() {
  const turns = 2.6;
  const thetaMax = turns * Math.PI * 2;
  const maxR = 12;
  const a = maxR / thetaMax;
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const theta = (i / (DOT_COUNT - 1)) * thetaMax;
    const r = a * theta;
    return {
      left: 50 + r * Math.cos(theta),
      top: 50 + r * Math.sin(theta) * 0.65,
    };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// A simple zigzag lightning bolt
function lightningShape() {
  const points = [
    ...linePoints(52, 34, 43, 52, 11), // upper diagonal
    ...linePoints(43, 52, 53, 52, 5), // short crossbar
    ...linePoints(53, 52, 45, 68, 9), // lower diagonal to the tip
  ];
  return { points, anchor: { cx: 48, cy: 51 } };
}

// A simple smiley face: two small eye clusters + a curved smile
function smileyShape() {
  const eyeCluster = (cx, cy) =>
    Array.from({ length: 4 }, (_, i) => ({
      left: cx + Math.cos((i / 4) * Math.PI * 2) * 1.4,
      top: cy + Math.sin((i / 4) * Math.PI * 2) * 1.4,
    }));
  const mouthWidth = 16;
  const depth = 4;
  const mouth = Array.from({ length: 17 }, (_, i) => {
    const t = (i / 16) * 2 - 1; // -1 to 1
    return {
      left: 50 + t * (mouthWidth / 2),
      top: 54 + depth * (1 - t * t),
    };
  });
  const points = [...eyeCluster(44, 45), ...eyeCluster(56, 45), ...mouth];
  return { points, anchor: { cx: 50, cy: 50 } };
}

// Crescent moon — a single open arc reads cleanly as a moon sliver
function crescentShape() {
  const r = 10;
  const startAngle = -1.9;
  const endAngle = 1.9;
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = startAngle + (i / (DOT_COUNT - 1)) * (endAngle - startAngle);
    return {
      left: 50 + r * Math.cos(angle),
      top: 50 + r * Math.sin(angle),
    };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// A 5-petal rose/flower curve
function flowerShape() {
  const maxR = 11;
  const petals = 5;
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const theta = (i / (DOT_COUNT - 1)) * Math.PI;
    const r = maxR * Math.cos(petals * theta);
    return {
      left: 50 + r * Math.cos(theta),
      top: 50 + r * Math.sin(theta) * 0.8,
    };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// House outline: square base + triangular roof, traced as one outline
function houseShape() {
  const points = [
    ...linePoints(42, 62, 58, 62, 6), // base
    ...linePoints(58, 62, 58, 50, 5), // right wall
    ...linePoints(58, 50, 50, 40, 5), // roof right slope
    ...linePoints(50, 40, 42, 50, 5), // roof left slope
    ...linePoints(42, 50, 42, 62, 4), // left wall
  ];
  return { points, anchor: { cx: 50, cy: 51 } };
}

// DNA double helix — two interleaved sine strands
function dnaShape() {
  const turns = 2;
  const amplitude = 8;
  const topStart = 36;
  const heightSpan = 28;
  const strand1 = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    return {
      left: 50 + amplitude * Math.sin(turns * Math.PI * 2 * t),
      top: topStart + t * heightSpan,
    };
  });
  const strand2 = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return {
      left: 50 + amplitude * Math.sin(turns * Math.PI * 2 * t + Math.PI),
      top: topStart + t * heightSpan,
    };
  });
  return { points: [...strand1, ...strand2], anchor: { cx: 50, cy: 50 } };
}

// A denser, unresolved cloud of dots — no shape, just a gathering
function clusterShape() {
  const points = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (i / DOT_COUNT) * Math.PI * 2 + i * 0.7;
    const radius = 3 + ((i * 37) % 100) / 100 * 9;
    return {
      left: 50 + radius * Math.cos(angle),
      top: 50 + radius * Math.sin(angle) * 0.8,
    };
  });
  return { points, anchor: { cx: 50, cy: 50 } };
}

// ECG-style pulse/heartbeat line
function pulseShape() {
  const points = [
    ...linePoints(28, 50, 38, 50, 3), // flat
    ...linePoints(38, 50, 41, 45, 2), // small bump up
    ...linePoints(41, 45, 44, 55, 2), // small dip down
    ...linePoints(44, 55, 47, 32, 3), // sharp spike up
    ...linePoints(47, 32, 50, 64, 3), // sharp spike down
    ...linePoints(50, 64, 53, 50, 3), // return to baseline
    ...linePoints(53, 50, 60, 50, 3), // flat
    ...linePoints(60, 50, 72, 50, 6), // flat tail
  ];
  return { points, anchor: { cx: 50, cy: 50 } };
}

const SHAPES = [
  starShape,
  heartShape,
  smileyShape,
  crescentShape,
  flowerShape,
  houseShape,
  dnaShape,
  clusterShape,
  pulseShape,
  infinityShape,
  spiralShape,
  lightningShape,
];

// Scattered across the full screen (with a small margin from the edges)
function randomScatter(count, seedOffset = 0) {
  return Array.from({ length: count }, (_, i) => ({
    left: 3 + ((i * 41 + seedOffset * 17) % 94),
    top: 5 + ((i * 59 + seedOffset * 31) % 90),
  }));
}

// Pick a random spot to form the shape, with enough margin that none of
// our shapes get clipped by the screen edges.
function randomShapeTarget() {
  return {
    cx: 26 + Math.random() * 48, // 26 - 74
    cy: 34 + Math.random() * 38, // 34 - 72
  };
}

function buildShape(shapeFn, target) {
  const { points, anchor } = shapeFn();
  const offsetX = target.cx - anchor.cx;
  const offsetY = target.cy - anchor.cy;
  return points.map((p) => ({
    left: p.left + offsetX,
    top: p.top + offsetY,
  }));
}

export function RoamingConstellation() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState("scattered"); // "scattered" | "shape"
  const [scatterPositions, setScatterPositions] = useState(() =>
    randomScatter(DOT_COUNT, 0)
  );
  const [shapePositions, setShapePositions] = useState(() =>
    buildShape(SHAPES[0], { cx: 50, cy: 55 })
  );
  const cycleRef = useRef(0);
  const lastShapeIndexRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return; // stays hidden entirely, nothing to animate

    let timeout;

    const steps = [
      { delay: 700, run: () => setVisible(true) },
      { delay: 5200, run: () => {} }, // hold scattered (long)
      { delay: 1600, run: () => setPhase("shape") }, // converge (fast)
      { delay: 1300, run: () => {} }, // hold shape (brief)
      { delay: 1600, run: () => setPhase("scattered") }, // disperse (fast)
      { delay: 4200, run: () => {} }, // hold scattered (long)
      { delay: 800, run: () => setVisible(false) },
      {
        delay: 700,
        run: () => {
          cycleRef.current += 1;
          setScatterPositions(randomScatter(DOT_COUNT, cycleRef.current));

          let nextIndex = Math.floor(Math.random() * SHAPES.length);
          if (nextIndex === lastShapeIndexRef.current) {
            nextIndex = (nextIndex + 1) % SHAPES.length;
          }
          lastShapeIndexRef.current = nextIndex;
          setShapePositions(
            buildShape(SHAPES[nextIndex], randomShapeTarget())
          );
        },
      },
    ];

    let stepIndex = 0;
    const runStep = () => {
      const step = steps[stepIndex % steps.length];
      step.run();
      stepIndex += 1;
      timeout = setTimeout(runStep, step.delay);
    };

    timeout = setTimeout(runStep, 400);
    return () => clearTimeout(timeout);
  }, []);

  const positions = phase === "shape" ? shapePositions : scatterPositions;

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {positions.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-indigo-400 dark:bg-cyan-300"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: phase === "shape" ? 6 : 3,
            height: phase === "shape" ? 6 : 3,
            opacity: visible ? (phase === "shape" ? 0.85 : 0.45) : 0,
            transform: "translate(-50%, -50%)",
            transition:
              "left 1.3s cubic-bezier(0.4,0,0.2,1), top 1.3s cubic-bezier(0.4,0,0.2,1), width 1s ease, height 1s ease, opacity 1.1s ease",
          }}
        />
      ))}
    </div>
  );
}
