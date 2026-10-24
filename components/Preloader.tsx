"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface PreloaderProps {
  onComplete?: () => void;
}

const LOADING_PHASES = [
  { threshold: 0, code: "BOOT / 01", label: "Initializing the signal" },
  { threshold: 0.34, code: "TRACE / 02", label: "Mapping the garden" },
  { threshold: 0.72, code: "OPEN / 03", label: "Opening the interface" },
] as const;

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = reducedMotion ? 120 : 1480;
    const startedAt = performance.now();
    let frame = 0;
    let timeout: number | undefined;

    const tick = (now: number) => {
      const nextProgress = Math.min((now - startedAt) / duration, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      setIsLeaving(true);
      timeout = window.setTimeout(
        () => {
          setVisible(false);
          onCompleteRef.current?.();
        },
        reducedMotion ? 0 : 680,
      );
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [reducedMotion]);

  if (!visible) {
    return null;
  }

  const percentage = Math.round(progress * 100);
  const currentPhase = [...LOADING_PHASES].reverse().find((phase) => progress >= phase.threshold) ?? LOADING_PHASES[0];
  const currentPhaseIndex = LOADING_PHASES.reduce(
    (phaseIndex, phase, index) => (progress >= phase.threshold ? index : phaseIndex),
    0,
  );
  const dialCircumference = 2 * Math.PI * 146;
  const dialStyle = {
    "--preloader-angle": `${progress * 1.25}turn`,
    "--preloader-counter-angle": `${progress * -0.8}turn`,
    "--preloader-gradient-position": `${progress * 100}%`,
    "--preloader-g-scale": `${0.88 + progress * 0.12}`,
    "--preloader-scan-position": `${progress * 100}%`,
    "--preloader-progress": progress.toFixed(3),
  } as CSSProperties;
  const orbitNodes = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div
      className={`preloader preloader--signal preloader--phase-${currentPhaseIndex + 1}${isLeaving ? " preloader--leaving" : ""}`}
      style={dialStyle}
      role="status"
      aria-live="polite"
      aria-label="Opening Signal Garden"
    >
      <div className="preloader__grid" aria-hidden="true" />
      <div className="preloader__grain" aria-hidden="true" />
      <div className="preloader__scanline" aria-hidden="true" />

      <header className="preloader__topline">
        <span className="preloader__brand">
          <strong>G</strong>
          <span>Signal Garden</span>
        </span>
        <span className="preloader__topline-code">{currentPhase.code}</span>
      </header>

      <main className="preloader__canvas" aria-hidden="true">
        <div className="preloader__core-glow" />
        <div className="preloader__orbit preloader__orbit--outer" />
        <div className="preloader__orbit preloader__orbit--inner" />
        <div className="preloader__orbit-nodes">
          {orbitNodes.map((node) => (
            <span
              className={`preloader__orbit-node${node === 0 ? " preloader__orbit-node--active" : ""}`}
              key={node}
              style={{ "--node-angle": `${node * 45}deg` } as CSSProperties}
            />
          ))}
        </div>

        <svg className="preloader__dial" viewBox="0 0 360 360" focusable="false">
          <circle className="preloader__dial-track" cx="180" cy="180" r="146" />
          <circle
            className="preloader__dial-progress"
            cx="180"
            cy="180"
            r="146"
            style={{ strokeDasharray: dialCircumference, strokeDashoffset: dialCircumference * (1 - progress) }}
          />
          <circle className="preloader__dial-detail" cx="180" cy="180" r="119" />
          <path className="preloader__crosshair" d="M180 20v42M180 298v42M20 180h42M298 180h42" />
        </svg>

        <div className="preloader__glyph">G</div>
        <div className="preloader__core-mark">
          <span />
          <span />
          <span />
        </div>
        <span className="preloader__core-label">SIGNAL / {percentage.toString().padStart(3, "0")}</span>

        <div className="preloader__telemetry preloader__telemetry--left">
          <span>FIELD / {String(currentPhaseIndex + 1).padStart(2, "0")}</span>
          <span>SIGNAL / LIVE</span>
        </div>
        <div className="preloader__telemetry preloader__telemetry--right">
          <span>VECTOR / +G</span>
          <span>DEPTH / {percentage.toString().padStart(3, "0")}</span>
        </div>
      </main>

      <section className="preloader__message" aria-hidden="true">
        <p className="preloader__eyebrow">Temporal interface / 001</p>
        <p className="preloader__quote">Time is the first interface.</p>
        <p className="preloader__label">{currentPhase.label}</p>
      </section>

      <footer className="preloader__footer" aria-hidden="true">
        <span>G / 001</span>
        <div className="preloader__bar">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <strong>{percentage.toString().padStart(3, "0")} %</strong>
      </footer>
    </div>
  );
}
