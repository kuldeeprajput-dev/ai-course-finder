"use client";

import { useState } from "react";
import { TabNav } from "@/components/features/tab-nav";
import { SearchBar } from "@/components/features/search-bar";
import { CourseCard } from "@/components/features/course-card";
import { RoadmapView } from "@/components/features/roadmap-view";
import { ChatDrawer } from "@/components/features/chat-drawer";
import { ChatTrigger } from "@/components/features/chat-trigger";
import { ChatHistory } from "@/components/features/chat-history";
import { SettingsModal } from "@/components/features/settings-modal";
import { PopularTopics } from "@/components/features/popular-topics";
import { FavoritesSection } from "@/components/features/favorites-section";
import { ExportButton } from "@/components/features/export-button";
import { LoadingSpinner } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useCourseSearch, useRoadmap } from "@/hooks/use-search";
import { useChat } from "@/hooks/use-chat";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useFavorites } from "@/hooks/use-favorites";
import { useSuggestions } from "@/hooks/use-suggestions";
import { useAISettings } from "@/providers/ai-settings";
import { Course, ChatSession } from "@/types";
import { GraduationCap, Sparkles } from "lucide-react";

export default function Home() {
  const { settings, updateSettings } = useAISettings();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "search" | "roadmap" | "favorites"
  >("search");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const {
    courses,
    isLoading: isSearching,
    search,
    error: searchError,
  } = useCourseSearch();
  const {
    roadmap,
    isLoading: isGenerating,
    generate,
    error: roadmapError,
  } = useRoadmap();
  const {
    messages,
    sendMessage,
    isLoading: isChatLoading,
    clearMessages,
  } = useChat();
  const {
    sessions,
    saveSession,
    updateSession,
    deleteSession,
    clearAllSessions,
    isLoaded: isHistoryLoaded,
  } = useChatHistory();
  const { favorites, removeFavorite, isFavorite, toggleFavorite } =
    useFavorites();
  const {
    suggestions,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
    getSuggestions,
  } = useSuggestions();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) search(query.trim());
  };

  const handleAction = (q: string) => {
    setQuery(q);
    search(q);
    setActiveTab("search");
  };

  const handleGenerate = () => query.trim() && generate(query.trim());

  const handleChatClose = () => {
    if (messages.length > 0 && isHistoryLoaded) {
      const id = saveSession(messages);
      if (id && currentSessionId) updateSession(currentSessionId, messages);
      else if (id) setCurrentSessionId(id);
    }
    setIsChatOpen(false);
  };

  const handleSessionSelect = (session: ChatSession) => {
    clearMessages();
    session.messages.forEach((m) => sendMessage(m.content));
    setCurrentSessionId(session.id);
    setIsChatHistoryOpen(false);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-black text-white py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-brand-orange" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Free Course Finder
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-mono">
              AI-powered discovery
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-3 sm:p-4 space-y-4">
        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {activeTab !== "favorites" && (
          <div className="brutal-border flex items-center gap-4 bg-white shadow-brutal p-4 sm:p-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={activeTab === "search" ? handleSearch : handleGenerate}
              isLoading={isSearching || isGenerating}
              activeTab={activeTab}
            />
            {activeTab === "roadmap" && !isGenerating && (
              <Button
                size="sm"
                className="md:w-46 md:h-16 flex items-center"
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4 md:mr-2" />
                <span className="md:block hidden">Generate Roadmap</span>
              </Button>
            )}
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-4">
            <PopularTopics onSelect={handleAction} disabled={isSearching} />
            {isSearching ? (
              <div className="brutal-border bg-white shadow-brutal py-20 flex flex-col items-center justify-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-brand-gray font-bold uppercase tracking-widest text-xs">
                  Searching for courses...
                </p>
              </div>
            ) : searchError ? (
              <div className="brutal-border border-red-500 bg-red-50 p-4 text-red-600 font-bold">
                {searchError}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((c, i) => (
                  <CourseCard
                    key={i}
                    course={c}
                    onClick={() => setSelectedCourse(c)}
                    isFavorite={isFavorite(c.url)}
                    onToggleFavorite={() => toggleFavorite(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-brand-gray brutal-border bg-white shadow-brutal">
                No results found. Try a different topic.
              </div>
            )}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-4">
            <RoadmapView
              roadmap={roadmap}
              isLoading={isGenerating}
              error={roadmapError || undefined}
            />
            {roadmap && (
              <div className="flex justify-end">
                <ExportButton roadmap={roadmap} />
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <FavoritesSection
            favorites={favorites}
            onRemove={removeFavorite}
            suggestions={{
              courses: suggestions,
              isLoading: isSuggestionsLoading,
              error: suggestionsError,
              onGetSuggestions: () => getSuggestions(favorites),
            }}
          />
        )}
      </main>

      <footer className="border-t-2 border-brand-black bg-white py-6 mt-8 text-center text-sm text-brand-gray">
        <p>Find free courses from Coursera, edX, MIT, YouTube, and more.</p>
      </footer>

      <ChatTrigger onClick={() => setIsChatOpen(true)} />
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={handleChatClose}
        messages={messages}
        onSendMessage={sendMessage}
        onOpenHistory={() => {
          setIsChatHistoryOpen(true);
          setIsChatOpen(false);
        }}
        isLoading={isChatLoading}
      />
      <ChatHistory
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)}
        sessions={sessions}
        onSelectSession={handleSessionSelect}
        onDeleteSession={deleteSession}
        onClearAll={clearAllSessions}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />

      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse.title}
        >
          <div className="space-y-4">
            {["Provider", "Description", "Rating", "Duration", "Level"].map(
              (label) => {
                const val = selectedCourse[label.toLowerCase() as keyof Course];
                return (
                  val && (
                    <div key={label}>
                      <p className="font-bold text-brand-gray uppercase text-[10px] tracking-widest mb-1">
                        {label}
                      </p>
                      <p
                        className={
                          label === "Provider" ? "text-lg font-bold" : ""
                        }
                      >
                        {String(val)}
                      </p>
                    </div>
                  )
                );
              },
            )}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => toggleFavorite(selectedCourse)}
                className="flex-1 brutal-border py-2 font-bold text-sm hover:bg-brand-paper"
              >
                {isFavorite(selectedCourse.url) ? "Remove" : "Add"} to Favorites
              </button>
              <a
                href={selectedCourse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center brutal-btn"
              >
                Visit Course
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
