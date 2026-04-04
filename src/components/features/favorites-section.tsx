'use client';

import { FavoriteCourse } from '@/types';
import { CourseCard } from '@/components/features/course-card';
import { Heart, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoritesSectionProps {
  favorites: FavoriteCourse[];
  onRemove: (id: string) => void;
  suggestions: {
    courses: { title: string; provider: string; url: string; description: string; isFree: boolean; rating?: number; duration?: string; level?: string }[];
    isLoading: boolean;
    error: string | null;
    onGetSuggestions: () => void;
  };
}

export function FavoritesSection({ favorites, onRemove, suggestions }: FavoritesSectionProps) {
  const favoriteCourses = favorites.map((f) => ({
    title: f.title,
    provider: f.provider,
    url: f.url,
    description: f.description || '',
    isFree: true,
    rating: f.rating,
    duration: f.duration,
    level: f.level,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-xl font-bold">Your Favorites</h2>
          <span className="text-sm text-brand-gray">({favorites.length})</span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="brutal-border bg-brand-paper p-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-brand-gray opacity-50" />
          <p className="text-brand-gray">No favorites yet.</p>
          <p className="text-sm text-brand-gray mt-1">
            Add courses to your favorites from the search results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative">
              <CourseCard
                course={{
                  title: fav.title,
                  provider: fav.provider,
                  url: fav.url,
                  description: fav.description || '',
                  isFree: true,
                  rating: fav.rating,
                  duration: fav.duration,
                  level: fav.level,
                }}
                onClick={() => onRemove(fav.id)}
              />
              <button
                onClick={() => onRemove(fav.id)}
                className={cn(
                  'absolute top-2 right-2',
                  'w-8 h-8 brutal-border bg-white',
                  'flex items-center justify-center',
                  'hover:bg-red-100 hover:text-red-600 transition-colors',
                  'text-brand-gray'
                )}
                title="Remove from favorites"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 border-brand-black pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-orange" />
            <h3 className="text-lg font-bold">AI Suggestions</h3>
          </div>
          <button
            onClick={suggestions.onGetSuggestions}
            disabled={suggestions.isLoading || favorites.length === 0}
            className={cn(
              'text-sm font-medium text-brand-orange',
              'hover:underline disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-1'
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
                {suggestions.courses.length > 0 ? 'Refresh' : 'Get related courses'}
              </>
            )}
          </button>
        </div>

        {suggestions.error && (
          <div className="brutal-border border-red-500 bg-red-50 p-3 mb-4">
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
                    'brutal-border bg-white shadow-brutal p-4',
                    'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-none',
                    'transition-all duration-150'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm line-clamp-2">{course.title}</h4>
                    <ExternalLink className="w-4 h-4 shrink-0 text-brand-gray" />
                  </div>
                  <p className="text-xs text-brand-gray">{course.provider}</p>
                  {course.rating && (
                    <p className="text-xs text-amber-600 mt-1">Rating: {course.rating}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        ) : (
          !suggestions.isLoading && (
            <div className="brutal-border bg-brand-paper p-4 text-center">
              <p className="text-sm text-brand-gray">
                {favorites.length === 0
                  ? 'Add some favorites to get AI-powered suggestions.'
                  : 'Click "Get related courses" to see suggestions based on your favorites.'}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
