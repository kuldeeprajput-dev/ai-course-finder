'use client';

import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

interface ChatTriggerProps {
  onClick: () => void;
}

export function ChatTrigger({ onClick }: ChatTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-14 h-14 md:w-16 md:h-16',
        'brutal-border bg-brand-orange text-white',
        'shadow-brutal-xl hover:shadow-none',
        'flex items-center justify-center',
        'transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5',
        'active:translate-x-0 active:translate-y-0'
      )}
      title="Chat with AI"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
