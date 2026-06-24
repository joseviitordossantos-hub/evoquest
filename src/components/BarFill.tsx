"use client";

import { useRef, useCallback } from "react";

export default function BarFill({
  pct,
  className = "",
  style,
  transitionDuration = 500,
}: {
  pct: number;
  className?: string;
  style?: React.CSSProperties;
  transitionDuration?: number;
}) {
  const stripesRef = useRef<HTMLSpanElement>(null);

  const handleTransitionStart = useCallback(() => {
    stripesRef.current?.classList.add("bar-stripes-active");
  }, []);

  const handleTransitionEnd = useCallback(() => {
    stripesRef.current?.classList.remove("bar-stripes-active");
  }, []);

  return (
    <div
      className={`h-full rounded-pill relative overflow-hidden ${className}`}
      style={{ width: `${pct}%`, transition: `width ${transitionDuration}ms`, ...style }}
      onTransitionStart={handleTransitionStart}
      onTransitionEnd={handleTransitionEnd}
    >
      <span ref={stripesRef} className="absolute inset-0 bar-stripes" />
    </div>
  );
}
