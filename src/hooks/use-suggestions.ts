'use client';

import { useState, useCallback } from 'react';
import { FavoriteCourse, Course } from '@/types';

interface SuggestionResult {
  success: boolean;
  courses?: Course[];
  error?: string;
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = useCallback(async (favorites: FavoriteCourse[]) => {
    if (favorites.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites }),
      });

      const data: SuggestionResult = await response.json();

      if (data.success && data.courses) {
        setSuggestions(data.courses);
      } else {
        setError(data.error || 'Failed to get suggestions');
      }
    } catch (err) {
      console.error('Suggestions error:', err);
      setError('Failed to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    getSuggestions,
    clearSuggestions,
  };
}
