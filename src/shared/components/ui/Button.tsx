import { cn } from "@/shared/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable Button component with brand theme variants.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-brand-orange text-white shadow-[0_8px_20px_rgba(232,93,63,0.2)] hover:bg-[#d94e32] hover:-translate-y-0.5",
      secondary:
        "border border-[#dce1db] bg-white text-brand-black hover:border-[#c5cdc6] hover:bg-brand-paper",
      ghost: "bg-transparent text-brand-black hover:bg-[#edf0eb]",
    };

    const sizes = {
      sm: "px-3.5 py-2 text-sm",
      md: "px-5 py-3 text-sm",
      lg: "px-7 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
