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
        'h-13 w-13 rounded-full md:h-14 md:w-14',
        'bg-brand-orange text-white',
        'shadow-[0_14px_34px_rgba(232,93,63,0.32)] hover:bg-[#d94e32] hover:-translate-y-1',
        'flex items-center justify-center',
        'transition-all duration-200'
      )}
      title="Chat with AI"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
