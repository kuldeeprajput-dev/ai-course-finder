"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { ChatMessage } from "@/shared/types";
import {
  Send,
  X,
  Bot,
  User,
  History,
  Sparkles,
  Maximize2,
  Minimize2,
  SquarePlus,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import ReactMarkdown from "react-markdown";

export interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onOpenHistory: () => void;
  onNewChat?: () => void;
  isLoading?: boolean;
}

function MessageContent({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) {
  if (isUser) {
    return <p className="text-sm whitespace-pre-wrap break-words">{content}</p>;
  }

  return (
    <div
      className="text-sm leading-relaxed text-[#2c352e] space-y-2
      [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-brand-black [&_h1]:mt-3 [&_h1]:mb-1
      [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-brand-black [&_h2]:mt-3 [&_h2]:mb-1
      [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-black [&_h3]:mt-2 [&_h3]:mb-1
      [&_p]:my-1.5 [&_p]:leading-relaxed
      [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5
      [&_li]:my-1 [&_li]:leading-normal
      [&_code]:text-xs [&_code]:bg-[#eaede8] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-brand-orange
      [&_pre]:bg-[#1e2822] [&_pre]:text-white [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:text-xs
      [&_strong]:font-semibold [&_strong]:text-brand-black [&_a]:text-brand-orange [&_a]:underline [&_a]:font-medium
      [&_blockquote]:border-l-2 [&_blockquote]:border-brand-orange [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-brand-gray"
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

/**
 * Slide-over Chat Drawer component for interacting with the AI Learning Assistant.
 */
export function ChatDrawer({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onOpenHistory,
  onNewChat,
  isLoading,
}: ChatDrawerProps) {
  const MIN_WIDTH = 460;
  const [input, setInput] = useState("");
  const [width, setWidth] = useState<number>(MIN_WIDTH);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const isResizingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const currentWidthRef = useRef<number>(MIN_WIDTH);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const deltaX = startXRef.current - e.clientX;
    const newWidth = Math.min(
      Math.max(MIN_WIDTH, startWidthRef.current + deltaX),
      window.innerWidth - 10,
    );
    currentWidthRef.current = newWidth;
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    if (!isResizingRef.current) return;
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    if (currentWidthRef.current >= window.innerWidth * 0.65) {
      setIsMaximized(true);
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    await onSendMessage(message);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      <div
        style={{
          width: isMaximized ? "100vw" : `${width}px`,
          minWidth: isMaximized ? "100vw" : `${MIN_WIDTH}px`,
          maxWidth: "100vw",
        }}
        className={cn(
          "fixed top-0 right-0 bottom-0 h-full z-[100] flex flex-col overflow-hidden bg-white shadow-2xl border-l border-[#dfe4de] transition-all duration-150 ease-out",
          "w-full",
          isMaximized
            ? "left-0 rounded-none border-l-0"
            : "rounded-l-2xl rounded-r-none md:rounded-l-2xl md:rounded-r-none",
        )}
      >
        {!isMaximized && (
          <div
            onMouseDown={handleMouseDown}
            title="Drag to resize and expand full screen"
            className="hidden md:flex absolute top-0 left-0 bottom-0 w-1.5 cursor-ew-resize items-center justify-center hover:bg-brand-orange/30 group z-20 transition-colors"
          >
            <div className="w-1 h-6 rounded-full bg-brand-gray/30 group-hover:bg-brand-orange group-hover:h-10 transition-all duration-150" />
          </div>
        )}

        <div className="flex shrink-0 items-center justify-between border-b border-[#e5e9e4] px-4 py-3.5 pl-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fcebe7] text-brand-orange">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-brand-black">
                Learning assistant
              </h2>
              <p className="text-xs text-brand-gray">
                Ask anything about your learning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
                title="New Chat"
                aria-label="New Chat"
              >
                <SquarePlus className="w-4.5 h-4.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMaximized((prev) => !prev)}
              className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
              title={isMaximized ? "Restore view" : "Maximize full screen"}
              aria-label={isMaximized ? "Restore view" : "Maximize full screen"}
            >
              {isMaximized ? (
                <Minimize2 className="w-4.5 h-4.5" />
              ) : (
                <Maximize2 className="w-4.5 h-4.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
              title="Chat History"
              aria-label="Chat History"
            >
              <History className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-brand-paper hover:text-brand-black"
              aria-label="Close chat"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 pl-6 flex flex-col">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-brand-gray my-auto">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-paper">
                <Sparkles className="h-5 w-5 text-brand-orange" />
              </span>
              <p className="mt-4 text-sm font-medium text-brand-black">
                How can I help you learn?
              </p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-5">
                Ask for course comparisons, study advice, or help choosing your
                next skill.
              </p>
            </div>
          )}
          {messages.map((msg) => {
            if (msg.role === "assistant" && !msg.content) return null;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === "user"
                      ? "bg-brand-orange text-white"
                      : "bg-brand-paper",
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] overflow-hidden rounded-2xl px-3.5 py-3 md:max-w-[80%]",
                    msg.role === "user"
                      ? "rounded-tr-sm bg-brand-orange text-white"
                      : "rounded-tl-sm bg-brand-paper",
                  )}
                >
                  <MessageContent
                    content={msg.content}
                    isUser={msg.role === "user"}
                  />
                </div>
              </div>
            );
          })}
          {isLoading &&
            (messages.length === 0 ||
              messages[messages.length - 1].role === "user" ||
              (messages[messages.length - 1].role === "assistant" &&
                !messages[messages.length - 1].content)) && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-paper flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-brand-paper p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-brand-gray rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-brand-gray rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-brand-gray rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-[#e5e9e4] p-4 pl-6"
        >
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about courses..."
              disabled={isLoading}
              className="min-w-0 flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 shrink-0 p-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
