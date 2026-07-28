"use client";

import { useState, useCallback, useEffect } from "react";
import { Course } from "@/shared/types";
import { searchCourses } from "../actions/searchCourses";
import { useAISettings } from "@/shared/providers/AISettingsProvider";

const COURSES_STORAGE_KEY = "free-course-finder-courses";

/**
 * Custom hook for searching courses with local storage persistence.
 */
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
      console.error("Failed to load courses from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
      } catch (e) {
        console.error("Failed to save courses to localStorage:", e);
      }
    }
  }, [courses, isLoaded]);

  const search = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchCourses(
          query,
          JSON.parse(JSON.stringify(settings)),
        );
        if (result.success && result.courses) {
          setCourses(result.courses);
        } else {
          setError(
            result.error ||
              "Search failed. Please check your API keys in Settings.",
          );
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [settings],
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
