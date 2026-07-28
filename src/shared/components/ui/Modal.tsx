"use client";

import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";
import { useEffect, useCallback } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable Dialog Modal component with backdrop blur and escape key handling.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-sm:items-end max-sm:p-0">
      <div
        className="absolute inset-0 bg-brand-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] overflow-auto rounded-2xl border border-white/60 bg-white shadow-brutal-xl max-sm:max-h-[92dvh] max-sm:rounded-b-none",
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[#e5e9e4] px-5 py-4">
            <h2 className="text-lg font-semibold tracking-tight max-sm:min-w-0 max-sm:flex-1 max-sm:line-clamp-2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 max-sm:shrink-0 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
