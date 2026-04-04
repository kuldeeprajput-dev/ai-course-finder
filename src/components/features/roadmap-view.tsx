'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/card';
import { Roadmap, RoadmapStep } from '@/types';
import { ExternalLink, BookOpen, Video, FileText, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapViewProps {
  roadmap: Roadmap | null;
  isLoading?: boolean;
  error?: string;
}

function ResourceIcon({ type }: { type: string }) {
  switch (type.toLowerCase()) {
    case 'video':
      return <Video className="w-4 h-4 text-red-500" />;
    case 'article':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'project':
      return <Code className="w-4 h-4 text-green-500" />;
    default:
      return <BookOpen className="w-4 h-4 text-brand-orange" />;
  }
}

function StepItem({ step }: { step: RoadmapStep }) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 w-6 h-6 brutal-border bg-brand-orange text-white font-bold text-sm flex items-center justify-center">
        {step.step}
      </div>
      <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-brand-black/20" />
      <div className="brutal-border bg-white shadow-brutal p-4">
        <h4 className="font-bold text-lg mb-2">{step.title}</h4>
        <p className="text-sm text-brand-gray mb-4">{step.description}</p>
        <div className="space-y-2">
          <p className="text-xs font-bold text-brand-black uppercase tracking-wide">
            Resources
          </p>
          <div className="flex flex-wrap gap-2">
            {step.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 text-sm',
                  'brutal-border bg-brand-paper px-3 py-1.5',
                  'hover:bg-brand-orange hover:text-white transition-colors'
                )}
              >
                <ResourceIcon type={resource.type} />
                <span className="truncate max-w-[150px]">{resource.title}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoadmapView({ roadmap, isLoading, error }: RoadmapViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-brand-gray">Generating your learning roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500 bg-red-50">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-12 text-brand-gray">
        <p>Enter a topic and generate a roadmap to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-brand-orange text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">{roadmap.title}</CardTitle>
          <p className="text-white/80 mt-2">{roadmap.description}</p>
          <p className="text-sm font-mono mt-2 text-white/60">
            Estimated Duration: {roadmap.totalDuration}
          </p>
        </CardHeader>
      </Card>

      <div className="relative">
        {roadmap.steps.map((step) => (
          <StepItem key={step.step} step={step} />
        ))}
      </div>
    </div>
  );
}
