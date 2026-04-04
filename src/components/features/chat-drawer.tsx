'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types';
import { Send, X, Bot, User, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onOpenHistory: () => void;
  isLoading?: boolean;
}

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <p className="text-sm whitespace-pre-wrap break-words">{content}</p>;
  }

  return (
    <div className="text-sm [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-3
      [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
      [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-3
      [&_p]:my-1 [&_p]:leading-relaxed
      [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5
      [&_code]:text-xs [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono
      [&_pre]:bg-black/5 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-2
      [&_strong]:text-brand-orange [&_a]:text-brand-orange [&_a]:underline
      [&_a]:text-brand-orange [&_hr]:border-brand-black/20">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export function ChatDrawer({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onOpenHistory,
  isLoading,
}: ChatDrawerProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 md:inset-y-4 md:right-4 md:left-auto md:w-full md:max-w-md brutal-border bg-white md:rounded-lg shadow-brutal-xl z-50 flex flex-col max-h-[85vh] md:max-h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between p-4 border-b-2 border-brand-black shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-orange" />
            <h2 className="font-bold text-lg">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenHistory}
              className="p-2 hover:bg-brand-paper transition-colors rounded-md"
              title="Chat History"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-paper transition-colors rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-8 text-brand-gray">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Ask me anything about learning resources, courses, or study paths!</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  msg.role === 'user' ? 'bg-brand-orange text-white' : 'bg-brand-paper'
                )}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={cn(
                  'brutal-border p-3 max-w-[85%] md:max-w-[80%] overflow-hidden',
                  msg.role === 'user' ? 'bg-brand-orange text-white' : 'bg-brand-paper'
                )}
              >
                <MessageContent content={msg.content} isUser={msg.role === 'user'} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-paper flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="brutal-border p-3 bg-brand-paper">
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

        <form onSubmit={handleSubmit} className="p-2 py-4 sm:py-4 sm:p-4 border-t-2 border-brand-black shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about courses..."
              disabled={isLoading}
              className="w-4/5 "
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="px-3">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
