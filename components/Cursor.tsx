"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    const render = () => {
      const cursor = cursorRef.current;
      if (cursor) {
        const { x, y } = positionRef.current;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frameRef.current = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(render);
      }

      const target = event.target instanceof Element ? event.target.closest("[data-cursor]") : null;
      setInteractive(Boolean(target));
    };

    const handlePointerLeave = () => setInteractive(false);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return <div ref={cursorRef} className={`cursor ${interactive ? "cursor--interactive" : ""}`} aria-hidden="true" />;
}
