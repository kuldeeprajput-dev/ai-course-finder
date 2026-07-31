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
    <div className="relative pb-4 pl-7 sm:pb-7 sm:pl-11 last:pb-0">
      <div className="absolute left-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(232,93,63,0.25)] sm:h-8 sm:w-8 sm:text-sm">
        {step.step}
      </div>
      <div className="absolute bottom-0 left-[11px] top-6 w-px bg-[#d9dfd9] sm:left-[15px] sm:top-8" />
      <div className="rounded-xl border border-[#dfe5de] bg-white p-3 shadow-[0_8px_25px_rgba(23,33,27,0.045)] sm:rounded-2xl sm:p-6">
        <h4 className="mb-1 text-xs font-semibold tracking-tight sm:mb-2 sm:text-lg">
          {step.title}
        </h4>
        <p className="mb-3 text-[11px] leading-relaxed text-brand-gray sm:mb-5 sm:text-sm sm:leading-6">
          {step.description}
        </p>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray sm:text-[10px]">
            Recommended resources
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {step.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-1 rounded-lg border border-[#dfe4de] bg-brand-paper px-2 py-1 text-[10px] font-medium max-sm:w-full sm:gap-2 sm:px-3 sm:py-2 sm:text-xs",
                  "hover:border-brand-[#fff5f2] hover:text-brand-orange transition-colors",
                )}
              >
                <ResourceIcon type={resource.type} />
                <span className="truncate max-w-[150px] max-sm:min-w-0 max-sm:flex-1 max-sm:max-w-none">
                  {resource.title}
                </span>
                <ExternalLink className="h-3 w-3 shrink-0" />
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
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-[#e0e0df] bg-white py-8 sm:min-h-72 sm:gap-4 sm:py-12">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="text-xs font-semibold sm:text-base">
            Designing your learning path
          </p>
          <p className="mt-1 text-[11px] text-brand-gray sm:text-sm">
            This usually takes just a few moments…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 p-3 sm:p-5">
        <p className="text-xs text-red-600 sm:text-sm">{error}</p>
      </Card>
    );
  }

  if (!roadmap) {
    return (
      <div className="rounded-2xl border border-[#dfe5de] bg-white p-4 text-center sm:px-5 sm:py-14">
        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#fcebe7] text-brand-orange sm:h-12 sm:w-12 sm:rounded-2xl">
          <Route className="h-4 w-4 sm:h-6 sm:w-6" />
        </span>
        <h2 className="mt-3 text-xs font-semibold sm:mt-5 sm:text-lg">
          Your roadmap will appear here
        </h2>
        <p className="mx-auto mt-1 max-w-md text-[11px] leading-relaxed text-brand-gray sm:mt-2 sm:text-sm sm:leading-6">
          Enter a topic above and we’ll create a structured path with practical
          resources for every step.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-[#d6e2db] bg-gradient-to-r from-[#f2f6f4] via-[#fafcfb] to-white p-3.5 shadow-sm sm:rounded-2xl sm:px-10 sm:py-11 sm:min-h-[190px] flex items-center">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-orange mb-1 sm:text-[11px] sm:mb-1.5">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Your learning roadmap
            </div>
            <h2 className="font-display text-base font-bold tracking-tight text-brand-black sm:text-3xl">
              {roadmap.title}
            </h2>
            <p className="mt-1 max-w-2xl text-[11px] text-brand-gray leading-relaxed sm:text-sm">
              {roadmap.description}
            </p>
          </div>
          <div className="shrink-0 self-start sm:self-center">
            <span className="inline-flex items-center gap-1 rounded-lg border border-brand-orange/20 bg-[#fcebe7] px-2 py-0.5 text-[9px] font-semibold text-brand-orange shadow-2xs sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-xs">
              <Clock3 className="h-3 w-3 text-brand-orange sm:h-3.5 sm:w-3.5" />
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
