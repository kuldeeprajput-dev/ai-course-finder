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
      className="group relative flex h-full flex-col overflow-hidden"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        className={cn(
          "absolute right-4 top-4 z-10",
          "flex h-9 w-9 items-center justify-center rounded-full border border-[#e0e5df] bg-white",
          "transition-all duration-200",
          showFavoriteButton ? "opacity-100" : "opacity-0",
          isFavorite
            ? "border-red-100 bg-red-50 text-red-500"
            : "text-brand-gray hover:border-red-100 hover:bg-red-50 hover:text-red-500",
        )}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
      </button>

      <CardHeader className="flex-1 pr-11">
        <div className="flex items-start gap-2">
          <CardTitle className="line-clamp-2 text-[17px] leading-snug">
            {course.title}
          </CardTitle>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-medium text-brand-orange">
            {course.provider}
          </span>
          {course.isFree && (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              Free
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 min-h-[63px] text-sm leading-5 text-brand-gray">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#edf0ec] pt-4 text-xs">
          {course.rating && (
            <span className="flex items-center gap-1 text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              {course.rating}
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1 text-brand-gray">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.level && (
            <span className="flex items-center gap-1 text-brand-gray">
              <BookOpen className="w-3 h-3" />
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
            "mt-4 flex w-full items-center justify-between rounded-xl bg-brand-orange/10 px-4 py-3",
            "text-sm font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white group-hover:bg-brand-orange group-hover:text-white",
          )}
        >
          View course
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </CardContent>
    </Card>
  );
}
