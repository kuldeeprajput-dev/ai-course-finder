'use client';

import { useState, useCallback, useEffect } from 'react';
import { Course, Roadmap } from '@/types';
import { searchCourses, generateRoadmap } from '@/actions/ai';
import { useAISettings } from '@/providers/ai-settings';

const COURSES_STORAGE_KEY = 'free-course-finder-courses';
const ROADMAP_STORAGE_KEY = 'free-course-finder-roadmap';

export function useCourseSearch() {
  const { settings } = useAISettings();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COURSES_STORAGE_KEY);
      if (stored) {
        setCourses(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load courses from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
      } catch (e) {
        console.error('Failed to save courses to localStorage:', e);
      }
    }
  }, [courses, isLoaded]);

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
      } catch {
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ROADMAP_STORAGE_KEY);
      if (stored) {
        setRoadmap(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load roadmap from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        if (roadmap) {
          localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap));
        } else {
          localStorage.removeItem(ROADMAP_STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to save roadmap to localStorage:', e);
      }
    }
  }, [roadmap, isLoaded]);

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
      } catch {
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
