"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { Course } from "@/shared/types";
import { ArrowUpRight, Star, Clock, BookOpen, Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
}

/**
 * Course Card display component.
 */
export function CourseCard({
  course,
  onClick,
  isFavorite,
  onToggleFavorite,
  showFavoriteButton = true,
}: CourseCardProps) {
  return (
    <Card
      hover
      onClick={onClick}
      className="group relative flex h-full flex-col overflow-hidden p-0 sm:p-0"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        className={cn(
          "absolute right-3 top-3 z-10 sm:right-5 sm:top-5",
          "flex h-7 w-7 items-center justify-center rounded-full border border-[#e0e5df] bg-white sm:h-10 sm:w-10",
          "transition-all duration-200",
          showFavoriteButton ? "opacity-100" : "opacity-0",
          isFavorite
            ? "border-red-100 bg-red-50 text-red-500"
            : "text-brand-gray hover:border-red-100 hover:bg-red-50 hover:text-red-500",
        )}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            "h-3.5 w-3.5 sm:h-4.5 sm:w-4.5",
            isFavorite && "fill-current",
          )}
        />
      </button>

      <CardHeader className="flex-1 p-3 pb-1.5 pr-9 mb-0 sm:mb-0 sm:p-6 sm:pb-0 sm:pr-16">
        <div className="flex items-start gap-2">
          <CardTitle className="line-clamp-2 text-[13px] font-semibold leading-snug sm:text-base sm:font-semibold sm:tracking-tight sm:leading-snug text-brand-black">
            {course.title}
          </CardTitle>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2.5 sm:gap-2">
          <span className="text-[11px] font-semibold text-brand-orange sm:text-[14px] sm:font-bold">
            {course.provider}
          </span>
          {course.isFree && (
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-700 sm:bg-[#e6f4ea] sm:px-2.5 sm:py-0.5 sm:text-[10px] sm:font-bold sm:tracking-wider sm:text-[#137333]">
              Free
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0 sm:space-y-3 sm:p-6 sm:pt-3">
        <p className="line-clamp-2 min-h-0 text-[11px] leading-normal text-brand-gray sm:line-clamp-3 sm:min-h-[58px] sm:text-[13px] sm:leading-relaxed text-brand-gray/90">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1 border-t border-[#edf0ec] pt-2 text-[10px] sm:gap-x-4 sm:gap-y-2 sm:pt-3.5 sm:text-xs">
          {course.rating && (
            <span className="flex items-center gap-1 font-bold text-amber-600">
              <Star className="h-2.5 w-2.5 fill-current sm:h-3.5 sm:w-3.5" />
              {course.rating}
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1 text-brand-gray">
              <Clock className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              {course.duration}
            </span>
          )}
          {course.level && (
            <span className="flex items-center gap-1 text-brand-gray">
              <BookOpen className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              {course.level}
            </span>
          )}
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "mt-2.5 flex w-full items-center justify-between rounded-xl bg-brand-orange/10 px-3 py-2 text-[11px] font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white group-hover:bg-brand-orange group-hover:text-white sm:mt-4 sm:h-11 sm:rounded-xl sm:bg-[#fcebe7] sm:px-4 sm:py-3 sm:text-sm sm:font-bold",
          )}
        >
          View course
          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </a>
      </CardContent>
    </Card>
  );
}
