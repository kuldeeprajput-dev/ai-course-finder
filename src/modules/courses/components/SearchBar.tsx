"use client";

import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Search, Loader2, Sparkles } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  activeTab: string;
  placeholder?: string;
}

/**
 * Unified Search Bar component for both Course Search and Roadmap Generation.
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  activeTab,
  isLoading,
  placeholder = "Search for courses...",
}: SearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full items-center gap-1.5 sm:gap-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-gray sm:left-4 sm:h-5 sm:w-5" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            activeTab === "roadmap"
              ? "What skill do you want to master?"
              : placeholder
          }
          className="h-9 w-full border-0 bg-transparent pl-8 text-xs focus:outline-none focus:border-transparent focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent focus:shadow-none sm:h-12 sm:pl-12 sm:text-base"
          style={{ outline: "none", boxShadow: "none" }}
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="h-9 shrink-0 px-3 text-xs sm:h-12 sm:min-w-[150px] sm:px-4 sm:text-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Working…</span>
          </>
        ) : activeTab === "roadmap" ? (
          <>
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Build my roadmap</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Search courses</span>
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
