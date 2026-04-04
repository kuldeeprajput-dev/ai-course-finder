'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChatSession, ChatMessage } from '@/types';

const STORAGE_KEY = 'free-course-finder-chat-history';

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  const saveSession = useCallback((messages: ChatMessage[]) => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find((m) => m.role === 'user');
    const title = firstUserMessage?.content.slice(0, 50) || 'Chat';
    const titleSuffix = firstUserMessage && firstUserMessage.content.length > 50 ? '...' : '';
    
    const session: ChatSession = {
      id: `session-${Date.now()}`,
      title: title + titleSuffix,
      messages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessions((prev) => {
      const existing = prev.find((s) => s.title === session.title);
      if (existing) {
        return prev.map((s) =>
          s.id === existing.id
            ? { ...s, messages, updatedAt: Date.now() }
            : s
        );
      }
      return [session, ...prev.slice(0, 19)];
    });

    return session.id;
  }, []);

  const updateSession = useCallback((id: string, messages: ChatMessage[]) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, messages, updatedAt: Date.now() } : s
      )
    );
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
  }, []);

  return {
    sessions,
    saveSession,
    updateSession,
    deleteSession,
    clearAllSessions,
    isLoaded,
  };
}
