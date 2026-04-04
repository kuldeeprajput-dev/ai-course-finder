'use client';

import { cn } from '@/lib/utils';
import { Settings, MessageCircle, BookOpen, Heart } from 'lucide-react';

interface TabNavProps {
  activeTab: 'search' | 'roadmap' | 'favorites';
  onTabChange: (tab: 'search' | 'roadmap' | 'favorites') => void;
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
    { id: 'search' as const, label: 'Find Courses', icon: BookOpen },
    { id: 'roadmap' as const, label: 'Roadmap', icon: BookOpen },
    { id: 'favorites' as const, label: 'Favorites', icon: Heart },
  ];

  return (
    <div className="flex items-stretch sm:items-center justify-between gap-4 p-3 sm:p-4 brutal-border bg-white shadow-brutal">
      <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 p-2 sm:p-3 font-bold brutal-border transition-all shrink-0',
              activeTab === tab.id
                ? 'bg-brand-orange text-white shadow-none'
                : 'bg-white text-brand-black hover:bg-brand-paper'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onOpenChat}
          className="p-2 sm:p-3 brutal-border bg-white hover:bg-brand-paper transition-colors"
          title="Chat with AI"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 sm:p-3 brutal-border bg-white hover:bg-brand-paper transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
