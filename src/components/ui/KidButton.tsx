import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "white" | "teal" | "gold" | "pink";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "kid-btn",
  secondary: "kid-btn-secondary",
  tertiary: "kid-btn-tertiary",
  white: "kid-btn-secondary",
  teal: "kid-btn-teal",
  gold: "kid-btn-gold",
  pink: "kid-btn-pink",
};

export default function KidButton({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md";
  fullWidth?: boolean;
}) {
  const base = VARIANT_CLASS[variant];
  const sizeCls = size === "sm" ? "kid-btn-sm" : "";
  return (
    <button className={`${base} ${sizeCls} ${fullWidth ? "w-full" : ""} ${className}`} {...rest}>
      {children}
    </button>
  );
}
