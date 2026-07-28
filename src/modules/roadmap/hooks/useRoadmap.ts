"use client";

import { useState, useCallback, useEffect } from "react";
import { Roadmap } from "@/shared/types";
import { generateRoadmap } from "../actions/generateRoadmap";
import { useAISettings } from "@/shared/providers/AISettingsProvider";

const ROADMAP_STORAGE_KEY = "free-course-finder-roadmap";

/**
 * Custom hook for generating and persisting learning roadmaps.
 */
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
      console.error("Failed to load roadmap from localStorage:", e);
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
        console.error("Failed to save roadmap to localStorage:", e);
      }
    }
  }, [roadmap, isLoaded]);

  const generate = useCallback(
    async (topic: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateRoadmap(
          topic,
          JSON.parse(JSON.stringify(settings)),
        );
        if (result.success && result.roadmap) {
          setRoadmap(result.roadmap);
        } else {
          setError(
            result.error ||
              "Failed to generate roadmap. Please check your API keys in Settings.",
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
