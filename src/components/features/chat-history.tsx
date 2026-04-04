'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ChatSession } from '@/types';
import { MessageCircle, Trash2, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

export function ChatHistory({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
}: ChatHistoryProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearAll = () => {
    if (confirmClear) {
      onClearAll();
      setConfirmClear(false);
      onClose();
    } else {
      setConfirmClear(true);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chat History">
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-brand-gray">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No chat history yet.</p>
            <p className="text-xs mt-1">Start a conversation to save it here.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                  className={cn(
                    'w-full text-left brutal-border bg-white p-3',
                    'hover:bg-brand-paper transition-colors group'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate pr-2">{session.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-brand-gray">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {session.messages.length} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(session.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1.5 hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete chat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-brand-gray" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {sessions.length > 0 && (
              <div className="pt-4 border-t-2 border-brand-black">
                <Button
                  onClick={handleClearAll}
                  variant={confirmClear ? 'primary' : 'secondary'}
                  className={cn('w-full', confirmClear && 'bg-red-500 hover:bg-red-600')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {confirmClear ? 'Click again to confirm' : 'Clear All History'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
