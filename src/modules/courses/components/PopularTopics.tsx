"use client";

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
 * Popular Topics pill selector component.
 */
export function PopularTopics({ onSelect, disabled }: PopularTopicsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-brand-gray">
        Popular now
      </p>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <button
            key={topic.query}
            type="button"
            onClick={() => onSelect(topic.query)}
            disabled={disabled}
            className={cn(
              "group flex items-center gap-1.5 rounded-full border border-[#dce2dc] bg-white px-3.5 py-2 text-xs font-medium text-[#4f5a52]",
              "hover:border-brand-orange/40 hover:bg-[#fff7f4] hover:text-brand-orange transition-colors",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {topic.label}
            <ArrowUpRight className="h-3 w-3 opacity-40 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
