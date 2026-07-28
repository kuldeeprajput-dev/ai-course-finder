"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChatMessage } from "@/shared/types";
import { useAISettings } from "@/shared/providers/AISettingsProvider";

const ACTIVE_CHAT_STORAGE_KEY = "free-course-finder-active-chat";

/**
 * Custom hook for managing active AI chat assistant conversations and streaming responses.
 */
export function useChat() {
  const { settings } = useAISettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelActiveRequest = useCallback(() => {
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch {
        // Ignore expected abort signal errors
      }
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_CHAT_STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load active chat from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save active chat to localStorage:", e);
      }
    }
  }, [messages, isLoaded]);

  const sendMessage = useCallback(
    async (content: string) => {
      cancelActiveRequest();

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantMessageId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            history: messages,
            settings: JSON.parse(JSON.stringify(settings)),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Chat API error:", response.status, errorText);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content:
                      errorText ||
                      "Failed to get response. Please check your API keys in Settings.",
                  }
                : msg,
            ),
          );
          setIsLoading(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg,
            ),
          );
        }
      } catch (error) {
        const isAbort =
          (error as Error).name === "AbortError" ||
          (error as Error).message?.includes("aborted") ||
          (error as Error).message?.includes("Abort");

        if (isAbort) {
          return;
        }

        console.error("Chat error:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    "Sorry, I encountered an error. Please check your API keys in Settings and try again.",
                }
              : msg,
          ),
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [cancelActiveRequest, messages, settings],
  );

  const loadMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      cancelActiveRequest();
      setMessages(newMessages);
      setIsLoading(false);
    },
    [cancelActiveRequest],
  );

  const clearMessages = useCallback(() => {
    cancelActiveRequest();
    setMessages([]);
    setIsLoading(false);
  }, [cancelActiveRequest]);

  return {
    messages,
    sendMessage,
    loadMessages,
    clearMessages,
    isLoading,
  };
}
