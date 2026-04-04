'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AISettings } from '@/types';

interface AISettingsContextType {
  settings: AISettings;
  updateSettings: (settings: AISettings) => void;
  isLoading: boolean;
}

const defaultSettings: AISettings = {
  primaryProvider: 'gemini',
};

function createPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'free-course-finder-settings';

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        console.error('Failed to parse stored settings');
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: AISettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const plainSettings = JSON.parse(JSON.stringify(settings));
  
  return (
    <AISettingsContext.Provider value={{ settings: plainSettings, updateSettings, isLoading }}>
      {children}
    </AISettingsContext.Provider>
  );
}

export function useAISettings() {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
}
