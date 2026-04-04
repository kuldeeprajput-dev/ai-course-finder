'use client';

import { useState, useCallback } from 'react';
import { Course, Roadmap } from '@/types';
import { searchCourses, generateRoadmap } from '@/actions/ai';
import { useAISettings } from '@/providers/ai-settings';

export function useCourseSearch() {
  const { settings } = useAISettings();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchCourses(query, JSON.parse(JSON.stringify(settings)));
        if (result.success && result.courses) {
          setCourses(result.courses);
        } else {
          setError(result.error || 'Search failed. Please check your API keys in Settings.');
        }
      } catch (e) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [settings]
  );

  const clearResults = useCallback(() => {
    setCourses([]);
    setError(null);
  }, []);

  return {
    courses,
    isLoading,
    error,
    search,
    clearResults,
  };
}

export function useRoadmap() {
  const { settings } = useAISettings();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (topic: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateRoadmap(topic, JSON.parse(JSON.stringify(settings)));
        if (result.success && result.roadmap) {
          setRoadmap(result.roadmap);
        } else {
          setError(result.error || 'Failed to generate roadmap. Please check your API keys in Settings.');
        }
      } catch (e) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [settings]
  );

  const clearRoadmap = useCallback(() => {
    setRoadmap(null);
    setError(null);
  }, []);

  return {
    roadmap,
    isLoading,
    error,
    generate,
    clearRoadmap,
  };
}
