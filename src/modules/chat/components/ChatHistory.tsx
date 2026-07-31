"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { ChatSession } from "@/shared/types";
import { MessageCircle, Trash2, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface ChatHistoryProps {
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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

/**
 * Chat History modal component displaying past saved conversations.
 */
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
      <div className="space-y-3 sm:space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-6 text-brand-gray sm:py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-3 opacity-50 sm:h-12 sm:w-12 sm:mb-4" />
            <p className="text-xs font-semibold sm:text-sm">
              No chat history yet.
            </p>
            <p className="text-[10px] mt-0.5 sm:text-xs sm:mt-1">
              Start a conversation to save it here.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-[350px] overflow-y-auto sm:max-h-[400px]">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectSession(session);
                      onClose();
                    }
                  }}
                  className={cn(
                    "w-full rounded-xl border border-[#dfe4de] bg-white p-2.5 text-left cursor-pointer sm:p-3",
                    "hover:bg-brand-paper transition-colors group",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="truncate pr-2 text-xs font-semibold text-brand-black sm:text-sm">
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1 text-[10px] text-brand-gray sm:gap-3 sm:mt-1.5 sm:text-xs">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-brand-orange" />
                          {session.messages.length} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(session.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="rounded-lg p-1 text-brand-gray hover:bg-red-50 hover:text-red-600 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 sm:p-1.5"
                        title="Delete chat"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <ChevronRight className="h-3.5 w-3.5 text-brand-gray group-hover:text-brand-black group-hover:translate-x-0.5 transition-all sm:h-4 sm:w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sessions.length > 0 && (
              <div className="border-t border-[#e5e9e4] pt-3 sm:pt-4">
                <Button
                  onClick={handleClearAll}
                  variant={confirmClear ? "primary" : "secondary"}
                  className={cn(
                    "h-8.5 w-full text-xs sm:h-10 sm:text-sm",
                    confirmClear && "bg-red-500 hover:bg-red-600",
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5 sm:h-4 sm:w-4 sm:mr-2" />
                  {confirmClear
                    ? "Click again to confirm"
                    : "Clear All History"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
