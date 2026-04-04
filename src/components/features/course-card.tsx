'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/types';
import { ExternalLink, Star, Clock, BookOpen, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
}

export function CourseCard({ course, onClick, isFavorite, onToggleFavorite, showFavoriteButton = true }: CourseCardProps) {
  return (
    <Card hover onClick={onClick} className="h-full flex flex-col relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        className={cn(
          'absolute top-2 right-2 z-10',
          'w-8 h-8 brutal-border bg-white',
          'flex items-center justify-center',
          'transition-all duration-150',
          showFavoriteButton ? 'opacity-100' : 'opacity-0',
          isFavorite
            ? 'text-red-500 hover:bg-red-100'
            : 'text-brand-gray hover:bg-brand-paper hover:text-red-500'
        )}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
      </button>

      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2 pr-8">
          <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
          {course.isFree && (
            <span className="shrink-0 bg-green-500 text-white text-xs font-bold px-2 py-1">
              FREE
            </span>
          )}
        </div>
        <p className="text-sm text-brand-gray mt-2">{course.provider}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm line-clamp-3">{course.description}</p>
        <div className="flex flex-wrap gap-3 text-xs">
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
            'flex items-center justify-center gap-2 w-full mt-4',
            'brutal-border bg-brand-orange text-white font-bold px-4 py-2',
            'hover:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150'
          )}
        >
          Visit Course
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>
  );
}
