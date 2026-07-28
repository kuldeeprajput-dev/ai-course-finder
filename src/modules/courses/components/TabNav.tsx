"use client";

import { cn } from "@/shared/lib/utils";
import { Settings, MessageCircle, Compass, Heart, Route } from "lucide-react";

export interface TabNavProps {
  activeTab: "search" | "roadmap" | "favorites";
  onTabChange: (tab: "search" | "roadmap" | "favorites") => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
}

/**
 * Top Tab Navigation bar component.
 */
export function TabNav({
  activeTab,
  onTabChange,
  onOpenChat,
  onOpenSettings,
}: TabNavProps) {
  const tabs = [
    { id: "search" as const, label: "Discover", icon: Compass },
    { id: "roadmap" as const, label: "Roadmap", icon: Route },
    { id: "favorites" as const, label: "Saved", icon: Heart },
  ];

  return (
    <div className="flex items-center justify-between gap-3 max-sm:gap-2">
      <div className="scrollbar-hide flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[#e1e6e0] bg-white p-1 max-sm:min-w-0 max-sm:flex-1 max-sm:justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            title={tab.label}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:text-sm max-lg:min-h-11 max-sm:flex-1 max-sm:justify-center",
              activeTab === tab.id
                ? "bg-brand-black text-white shadow-sm"
                : "text-brand-gray hover:bg-brand-paper hover:text-brand-black",
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className={cn(activeTab !== tab.id && "max-sm:hidden")}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 max-lg:shrink-0">
        <button
          type="button"
          onClick={onOpenChat}
          className="rounded-xl border border-[#e1e6e0] bg-white p-2.5 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black max-lg:h-11 max-lg:w-11"
          title="Chat with AI"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-xl border border-[#e1e6e0] bg-white p-2.5 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black max-lg:h-11 max-lg:w-11"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
