import { cn } from "@/shared/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Reusable Form Input component with clean border & focus states.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "rounded-xl border border-[#d9dfd9] bg-white px-4 py-3 text-brand-black placeholder:text-[#9aa29c] transition",
          "focus:outline-none focus:border-[#d9dfd9] focus:ring-0",
          error && "ring-2 ring-red-500",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
