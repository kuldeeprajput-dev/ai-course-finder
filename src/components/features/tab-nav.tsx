"use client";

import { cn } from "@/lib/utils";
import { Settings, MessageCircle, Compass, Heart, Route } from "lucide-react";

interface TabNavProps {
  activeTab: "search" | "roadmap" | "favorites";
  onTabChange: (tab: "search" | "roadmap" | "favorites") => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
}

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
    <div className="flex items-center justify-between gap-3">
      <div className="scrollbar-hide flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[#e1e6e0] bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            title={tab.label}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:text-sm",
              activeTab === tab.id
                ? "bg-brand-black text-white shadow-sm"
                : "text-brand-gray hover:bg-brand-paper hover:text-brand-black",
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={onOpenChat}
          className="rounded-xl border border-[#e1e6e0] bg-white p-2.5 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
          title="Chat with AI"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          className="rounded-xl border border-[#e1e6e0] bg-white p-2.5 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
