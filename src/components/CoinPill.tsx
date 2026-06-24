"use client";

import { useEffect, useRef, useState } from "react";
import AppIcon from "@/components/AppIcon";

const STORAGE_PREFIX = "evoq:lastCoins:";
const COUNT_UP_DURATION = 600;

export default function CoinPill({ childId, amount }: { childId: string; amount: number }) {
  const [displayed, setDisplayed] = useState(amount);
  const [flash, setFlash] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const key = STORAGE_PREFIX + childId;
    const prev = Number(localStorage.getItem(key));
    const startFrom = Number.isFinite(prev) ? prev : amount;

    if (startFrom === amount || startedRef.current) {
      setDisplayed(amount);
      localStorage.setItem(key, String(amount));
      return;
    }

    startedRef.current = true;
    if (amount > startFrom) {
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
    }

    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / COUNT_UP_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(startFrom + (amount - startFrom) * eased);
      setDisplayed(value);
      if (t < 1) raf = requestAnimationFrame(tick);
      else localStorage.setItem(key, String(amount));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amount, childId]);

  return (
    <span
      className={`inline-flex items-center gap-2 pl-1 pr-4 h-11 rounded-pill font-heading font-bold text-[18px] leading-none transition-[box-shadow] ${flash ? "animate-flash" : ""}`}
      style={{ background: "#FCEABB", color: "#8B6914" }}
      aria-label={`${amount} coins`}
    >
      <AppIcon name="coin" size={32} />
      {displayed}
    </span>
  );
}
