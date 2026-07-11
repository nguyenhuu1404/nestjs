import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
}

const VARIANTS = {
  primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
  ghost: "text-white/70 hover:bg-white/5 hover:text-white",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-lg text-sm font-medium py-2.5 px-4 transition-colors disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    />
  );
}
