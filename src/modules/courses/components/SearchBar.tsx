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
      className="flex w-full flex-col gap-2 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            activeTab === "roadmap"
              ? "What skill do you want to master?"
              : placeholder
          }
          className="h-11 w-full border-0 bg-transparent pl-12 text-sm focus:outline-none focus:border-transparent focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent focus:shadow-none sm:h-12 sm:text-base"
          style={{ outline: "none", boxShadow: "none" }}
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="h-11 min-w-[150px] gap-2 sm:h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Working…
          </>
        ) : activeTab === "roadmap" ? (
          <>
            <Sparkles className="h-4 w-4" />
            Build my roadmap
          </>
        ) : (
          <>
            Search courses
            <Search className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
