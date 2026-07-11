import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
      />
    </div>
  ),
);
Input.displayName = "Input";
