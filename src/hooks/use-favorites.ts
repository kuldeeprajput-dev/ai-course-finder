'use client';

import { useState, useCallback, useEffect } from 'react';
import { FavoriteCourse, Course } from '@/types';

const STORAGE_KEY = 'free-course-finder-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCourse[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((course: Course) => {
    const favorite: FavoriteCourse = {
      id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: course.title,
      provider: course.provider,
      url: course.url,
      description: course.description,
      rating: course.rating,
      duration: course.duration,
      level: course.level,
      addedAt: Date.now(),
    };
    setFavorites((prev) => [favorite, ...prev]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const isFavorite = useCallback(
    (url: string) => {
      return favorites.some((f) => f.url === url);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (course: Course) => {
      if (isFavorite(course.url)) {
        const fav = favorites.find((f) => f.url === course.url);
        if (fav) removeFavorite(fav.id);
      } else {
        addFavorite(course);
      }
    },
    [favorites, isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    isLoaded,
  };
}
