"use client";

import Image from "next/image";
import { useState } from "react";
import { ICON_EMOJI, getIconFile } from "@/lib/iconMap";


interface AppIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function AppIcon({ name, size = 24, className = "" }: AppIconProps) {
  const [useFallback, setUseFallback] = useState(false);
  const emoji = ICON_EMOJI[name] ?? "✨";

  if (useFallback) {
    return (
      <span
        className={className}
        style={{ fontSize: size, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}
        role="img"
      >
        {emoji}
      </span>
    );
  }

  const file = getIconFile(name);

  return (
    <Image
      src={`/icons/${file}.png`}
      alt=""
      width={size}
      height={size}
      className={className}
      onError={() => setUseFallback(true)}
    />
  );
}
