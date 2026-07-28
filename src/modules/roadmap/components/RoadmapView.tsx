"use client";

import { Card, LoadingSpinner } from "@/shared/components/ui/Card";
import { Roadmap, RoadmapStep } from "@/shared/types";
import {
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Code,
  Route,
  Clock3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface RoadmapViewProps {
  roadmap: Roadmap | null;
  isLoading?: boolean;
  error?: string;
}

function ResourceIcon({ type }: { type: string }) {
  switch (type.toLowerCase()) {
    case "video":
      return <Video className="w-4 h-4 text-red-500" />;
    case "article":
      return <FileText className="w-4 h-4 text-blue-500" />;
    case "project":
      return <Code className="w-4 h-4 text-green-500" />;
    default:
      return <BookOpen className="w-4 h-4 text-brand-orange" />;
  }
}

function StepItem({ step }: { step: RoadmapStep }) {
  return (
    <div className="relative pb-7 pl-11 last:pb-0">
      <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white shadow-[0_4px_12px_rgba(232,93,63,0.25)]">
        {step.step}
      </div>
      <div className="absolute bottom-0 left-[15px] top-8 w-px bg-[#d9dfd9]" />
      <div className="rounded-2xl border border-[#dfe5de] bg-white p-5 shadow-[0_8px_25px_rgba(23,33,27,0.045)] sm:p-6">
        <h4 className="mb-2 text-lg font-semibold tracking-tight">
          {step.title}
        </h4>
        <p className="mb-5 text-sm leading-6 text-brand-gray">
          {step.description}
        </p>
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gray">
            Recommended resources
          </p>
          <div className="flex flex-wrap gap-2">
            {step.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-[#dfe4de] bg-brand-paper px-3 py-2 text-xs font-medium",
                  "hover:border-brand-[#fff5f2] hover:text-brand-orange transition-colors",
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

/**
 * Interactive Roadmap view component displaying generated step-by-step paths.
 */
export function RoadmapView({ roadmap, isLoading, error }: RoadmapViewProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-[#e0e5df] bg-white py-12">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="font-semibold">Designing your learning path</p>
          <p className="mt-1 text-sm text-brand-gray">
            This usually takes just a few moments…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (!roadmap) {
    return (
      <div className="rounded-2xl border border-[#dfe5de] bg-white px-5 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fcebe7] text-brand-orange">
          <Route className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-lg font-semibold">
          Your roadmap will appear here
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-gray">
          Enter a topic above and we’ll create a structured path with practical
          resources for every step.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#d6e2db] bg-gradient-to-r from-[#f2f6f4] via-[#fafcfb] to-white px-7 py-9 sm:px-10 sm:py-11 min-h-[190px] flex items-center shadow-sm">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-orange mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Your learning roadmap
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-brand-black sm:text-3xl">
              {roadmap.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-brand-gray leading-relaxed">
              {roadmap.description}
            </p>
          </div>
          <div className="shrink-0 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand-orange/20 bg-[#fcebe7] px-3.5 py-2 text-xs font-semibold text-brand-orange shadow-2xs">
              <Clock3 className="h-3.5 w-3.5 text-brand-orange" />
              {roadmap.totalDuration}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        {roadmap.steps.map((step) => (
          <StepItem key={step.step} step={step} />
        ))}
      </div>
    </div>
  );
}
