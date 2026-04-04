'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  activeTab:string;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  activeTab,
  isLoading,
  placeholder = 'Search for courses...',
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-12 w-50 text-xs sm:text-lg sm:w-full"
          disabled={isLoading}
        />
      </div>
      {
        activeTab === "search" && <Button type="submit" disabled={isLoading || !value.trim()} className="px-4 sm:px-6">
        <span className="hidden sm:inline">{isLoading ? 'Searching...' : 'Search'}</span>
        <span className="sm:hidden"><Search className="w-4 h-4" /></span>
      </Button>
      }
    </form>
  );
}
