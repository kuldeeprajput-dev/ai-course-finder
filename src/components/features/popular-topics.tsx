'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PopularTopicsProps {
  onSelect: (topic: string) => void;
  disabled?: boolean;
}

const TOPICS = [
  { label: 'Web Development', query: 'web development' },
  { label: 'Machine Learning', query: 'machine learning' },
  { label: 'Data Science', query: 'data science' },
  { label: 'Mobile Apps', query: 'mobile app development' },
  { label: 'Cloud Computing', query: 'cloud computing' },
  { label: 'DevOps', query: 'devops engineering' },
  { label: 'Cybersecurity', query: 'cybersecurity' },
  { label: 'UI/UX Design', query: 'ui ux design' },
];

export function PopularTopics({ onSelect, disabled }: PopularTopicsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-brand-gray uppercase tracking-wide">
        Popular Topics
      </p>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <button
            key={topic.query}
            onClick={() => onSelect(topic.query)}
            disabled={disabled}
            className={cn(
              'px-3 py-1.5 text-sm font-medium brutal-border bg-white',
              'hover:bg-brand-orange hover:text-white transition-colors',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
