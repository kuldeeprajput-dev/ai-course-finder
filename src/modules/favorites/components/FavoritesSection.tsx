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
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
            Your learning library
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Saved courses
            </h1>
            <span className="rounded-full bg-brand-paper px-2.5 py-1 text-xs font-medium text-brand-gray">
              {favorites.length}
            </span>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-[#dfe5de] bg-white p-12 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-400">
            <Heart className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-semibold">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-brand-gray">
            Use the heart on any course to keep it close.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  "absolute right-4 top-4 z-10",
                  "h-9 w-9 rounded-full border border-red-100 bg-red-50",
                  "flex items-center justify-center",
                  "hover:bg-red-100 hover:text-red-600 transition-colors",
                  "text-red-500",
                )}
                title="Remove from favorites"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[#dfe5de] pt-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fcebe7] text-brand-orange">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-semibold">Picked for you</h3>
              <p className="text-xs text-brand-gray">
                Recommendations based on your saved courses
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={suggestions.onGetSuggestions}
            disabled={suggestions.isLoading || favorites.length === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-brand-orange",
              "hover:bg-[#fff1ed] disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {suggestions.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting suggestions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {suggestions.courses.length > 0
                  ? "Refresh"
                  : "Get related courses"}
              </>
            )}
          </button>
        </div>

        {suggestions.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{suggestions.error}</p>
          </div>
        )}

        {suggestions.courses.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-brand-gray">
              Based on your favorites, you might also like:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.courses.slice(0, 4).map((course, index) => (
                <a
                  key={index}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "rounded-xl border border-[#dfe5de] bg-white p-4",
                    "hover:-translate-y-0.5 hover:border-[#cbd3cb] hover:shadow-brutal",
                    "transition-all duration-200",
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm line-clamp-2">
                      {course.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 shrink-0 text-brand-gray" />
                  </div>
                  <p className="text-xs text-brand-gray">{course.provider}</p>
                  {course.rating && (
                    <p className="text-xs text-amber-600 mt-1">
                      Rating: {course.rating}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        ) : (
          !suggestions.isLoading && (
            <div className="rounded-xl border border-[#e0e5df] bg-[#fdfefe] p-5 text-center">
              <p className="text-sm text-brand-gray">
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
