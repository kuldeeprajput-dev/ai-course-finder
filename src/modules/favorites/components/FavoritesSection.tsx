"use client";

import { FavoriteCourse } from "@/shared/types";
import { CourseCard } from "@/modules/courses/components/CourseCard";
import { Heart, Sparkles, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface FavoritesSectionProps {
  favorites: FavoriteCourse[];
  onRemove: (id: string) => void;
  suggestions: {
    courses: {
      title: string;
      provider: string;
      url: string;
      description: string;
      isFree: boolean;
      rating?: number;
      duration?: string;
      level?: string;
    }[];
    isLoading: boolean;
    error: string | null;
    onGetSuggestions: () => void;
  };
}

/**
 * Saved Favorites library section component with recommendations.
 */
export function FavoritesSection({
  favorites,
  onRemove,
  suggestions,
}: FavoritesSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-xs font-semibold">
            Your learning library
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1 sm:gap-2">
            <h1 className="text-base font-semibold tracking-tight sm:text-2xl">
              Saved courses
            </h1>
            <span className="rounded-full bg-brand-paper px-1.5 py-0.5 text-[9px] font-medium text-brand-gray sm:px-2.5 sm:py-1 sm:text-xs">
              {favorites.length}
            </span>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-[#dfe5de] bg-white p-4 text-center sm:p-12">
          <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-400 sm:h-12 sm:w-12 sm:rounded-2xl">
            <Heart className="h-4 w-4 sm:h-6 sm:w-6" />
          </span>
          <h2 className="mt-3 text-xs font-semibold sm:mt-5 sm:text-base">
            Nothing saved yet
          </h2>
          <p className="mt-1 text-[11px] text-brand-gray sm:mt-2 sm:text-sm">
            Use the heart on any course to keep it close.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative">
              <CourseCard
                course={{
                  title: fav.title,
                  provider: fav.provider,
                  url: fav.url,
                  description: fav.description || "",
                  isFree: true,
                  rating: fav.rating,
                  duration: fav.duration,
                  level: fav.level,
                }}
                showFavoriteButton={false}
              />
              <button
                type="button"
                onClick={() => onRemove(fav.id)}
                className={cn(
                  "absolute right-3 top-3 z-10 sm:right-4 sm:top-4",
                  "h-7 w-7 rounded-full border border-red-100 bg-red-50 sm:h-9 sm:w-9",
                  "flex items-center justify-center",
                  "hover:bg-red-100 hover:text-red-600 transition-colors",
                  "text-red-500",
                )}
                title="Remove from favorites"
              >
                <Heart className="h-3 w-3 fill-current sm:h-4 sm:w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[#dfe5de] pt-4 sm:pt-7">
        <div className="mb-3 flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcebe7] text-brand-orange sm:h-9 sm:w-9 sm:rounded-xl">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <div>
              <h3 className="text-xs font-semibold sm:text-base">
                Picked for you
              </h3>
              <p className="text-[10px] text-brand-gray sm:text-xs">
                Recommendations based on your saved courses
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={suggestions.onGetSuggestions}
            disabled={suggestions.isLoading || favorites.length === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-orange max-sm:w-full max-sm:justify-center max-sm:border max-sm:border-brand-orange/15 max-sm:bg-[#fff7f4] sm:px-3 sm:py-2 sm:text-sm",
              "hover:bg-[#fff1ed] disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {suggestions.isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                Getting suggestions...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {suggestions.courses.length > 0
                  ? "Refresh"
                  : "Get related courses"}
              </>
            )}
          </button>
        </div>

        {suggestions.error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-2.5 sm:mb-4 sm:p-3">
            <p className="text-xs text-red-600 sm:text-sm">
              {suggestions.error}
            </p>
          </div>
        )}

        {suggestions.courses.length > 0 ? (
          <div className="space-y-2.5 sm:space-y-3">
            <p className="text-xs text-brand-gray sm:text-sm">
              Based on your favorites, you might also like:
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {suggestions.courses.slice(0, 4).map((course, index) => (
                <a
                  key={index}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "rounded-xl border border-[#dfe5de] bg-white p-3 sm:p-4",
                    "hover:-translate-y-0.5 hover:border-[#cbd3cb] hover:shadow-brutal",
                    "transition-all duration-200",
                  )}
                >
                  <div className="mb-1.5 flex items-start justify-between gap-2 sm:mb-2">
                    <h4 className="line-clamp-2 text-xs font-bold sm:text-sm">
                      {course.title}
                    </h4>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-brand-gray sm:h-4 sm:w-4" />
                  </div>
                  <p className="text-[10px] text-brand-gray sm:text-xs">
                    {course.provider}
                  </p>
                  {course.rating && (
                    <p className="mt-1 text-[10px] text-amber-600 sm:text-xs">
                      Rating: {course.rating}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        ) : (
          !suggestions.isLoading && (
            <div className="rounded-xl border border-[#e0e5df] bg-[#fdfefe] p-3.5 text-center sm:p-5">
              <p className="text-[11px] text-brand-gray sm:text-sm">
                {favorites.length === 0
                  ? "Add some favorites to get AI-powered suggestions."
                  : 'Click "Get related courses" to see suggestions based on your favorites.'}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
