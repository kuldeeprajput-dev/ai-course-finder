import { cn } from "@/shared/lib/utils";

interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
}

/**
 * Reusable Brand Mark Logo component.
 */
export function BrandMark({ className, iconClassName }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-[28%] bg-brand-orange text-white",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={cn("h-[68%] w-[68%]", iconClassName)}
      >
        <path
          d="M13.5 26.5 32 16.25 50.5 26.5 32 36.75 13.5 26.5Z"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        <path
          d="M21 31.25v9.1c0 2.7 4.9 6.15 11 6.15s11-3.45 11-6.15v-9.1"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M50.5 27v12"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
