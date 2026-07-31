"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface PopularTopicsProps {
  onSelect: (topic: string) => void;
  disabled?: boolean;
}

const TOPICS = [
  { label: "Web Development", query: "web development" },
  { label: "Machine Learning", query: "machine learning" },
  { label: "Data Science", query: "data science" },
  { label: "Mobile Apps", query: "mobile app development" },
  { label: "Cloud Computing", query: "cloud computing" },
  { label: "DevOps", query: "devops engineering" },
  { label: "Cybersecurity", query: "cybersecurity" },
  { label: "UI/UX Design", query: "ui ux design" },
];

/**
 * Popular Topics pill selector component with dynamic scroll-aware fade indicators on mobile.
 */
export function PopularTopics({ onSelect, disabled }: PopularTopicsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftFade(scrollLeft > 6);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div className="flex flex-col gap-1.5 max-sm:min-w-0 sm:flex-row sm:items-center sm:gap-3">
      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray sm:text-xs">
        Popular now
      </p>
      <div className="relative w-full min-w-0 overflow-hidden">
        {/* Left side fade gradient on mobile (only visible when scrolled past the first item) */}
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-[#f7f8f5] to-transparent transition-opacity duration-200 sm:hidden",
            showLeftFade ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Right side fade gradient on mobile (only visible when more items exist to the right) */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-[#f7f8f5] to-transparent transition-opacity duration-200 sm:hidden",
            showRightFade ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex flex-wrap gap-1.5 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:pb-0.5 sm:gap-2"
        >
          {TOPICS.map((topic) => (
            <button
              key={topic.query}
              type="button"
              onClick={() => onSelect(topic.query)}
              disabled={disabled}
              className={cn(
                "group flex items-center max-sm:shrink-0 gap-1 rounded-full border border-[#dce2dc] bg-white px-2.5 py-1 text-[10px] font-medium text-[#4f5a52] sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-xs",
                "hover:border-brand-orange/40 hover:bg-[#fff7f4] hover:text-brand-orange transition-colors",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {topic.label}
              <ArrowUpRight className="hidden h-2.5 w-2.5 opacity-40 transition group-hover:opacity-100 sm:inline-block sm:h-3 sm:w-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
