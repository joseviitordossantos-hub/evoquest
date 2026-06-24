"use client";

import { useEffect, useState } from "react";

export default function XpBarFill({ pct }: { pct: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div
      className="h-full grad-xp rounded-pill transition-[width] duration-1000 ease-kid-standard"
      style={{ width: `${width}%` }}
    />
  );
}
