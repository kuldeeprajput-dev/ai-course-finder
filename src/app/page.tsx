'use client';

import { useState, useEffect } from 'react';
import { TabNav } from '@/components/features/tab-nav';
import { SearchBar } from '@/components/features/search-bar';
import { CourseCard } from '@/components/features/course-card';
import { RoadmapView } from '@/components/features/roadmap-view';
import { ChatDrawer } from '@/components/features/chat-drawer';
import { ChatTrigger } from '@/components/features/chat-trigger';
import { ChatHistory } from '@/components/features/chat-history';
import { SettingsModal } from '@/components/features/settings-modal';
import { PopularTopics } from '@/components/features/popular-topics';
import { FavoritesSection } from '@/components/features/favorites-section';
import { ExportButton } from '@/components/features/export-button';
import { LoadingSpinner } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useCourseSearch, useRoadmap } from '@/hooks/use-search';
import { useChat } from '@/hooks/use-chat';
import { useChatHistory } from '@/hooks/use-chat-history';
import { useFavorites } from '@/hooks/use-favorites';
import { useSuggestions } from '@/hooks/use-suggestions';
import { useAISettings } from '@/providers/ai-settings';
import { Course, ChatSession } from '@/types';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function Home() {
  const { settings, updateSettings } = useAISettings();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'roadmap' | 'favorites'>('search');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { courses, isLoading: isSearching, search, error: searchError } = useCourseSearch();
  const { roadmap, isLoading: isGenerating, generate, error: roadmapError } = useRoadmap();
  const { messages, sendMessage, isLoading: isChatLoading, clearMessages } = useChat();
  const { sessions, saveSession, deleteSession, clearAllSessions, isLoaded: isHistoryLoaded } = useChatHistory();
  const { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite } = useFavorites();
  const { suggestions, isLoading: isSuggestionsLoading, error: suggestionsError, getSuggestions, clearSuggestions } = useSuggestions();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
    }
  };

  const handleTopicSelect = (topic: string) => {
    setQuery(topic);
    search(topic);
    setActiveTab('search');
  };

  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      generate(query.trim());
    }
  };

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleOpenHistory = () => {
    setIsChatHistoryOpen(true);
    setIsChatOpen(false);
  };

  const handleCloseChat = () => {
    if (messages.length > 0 && isHistoryLoaded) {
      const sessionId = saveSession(messages);
      if (sessionId && !currentSessionId) {
        setCurrentSessionId(sessionId);
      } else if (sessionId && currentSessionId) {
        updateSession(currentSessionId, messages);
      }
    }
    setIsChatOpen(false);
  };

  const handleCloseHistory = () => {
    setIsChatHistoryOpen(false);
  };

  const updateSession = (id: string, msgs: typeof messages) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      session.messages = msgs;
      session.updatedAt = Date.now();
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    if (currentSessionId && messages.length > 0 && isHistoryLoaded) {
      saveSession(messages);
    }
    clearMessages();
    session.messages.forEach((msg) => {
      sendMessage(msg.content);
    });
    setCurrentSessionId(session.id);
    setIsChatHistoryOpen(false);
    setIsChatOpen(true);
  };

  

  const handleGetSuggestions = () => {
    getSuggestions(favorites);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-black text-white py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-brand-orange" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Free Course Finder</h1>
              <p className="text-xs sm:text-sm text-white/60 font-mono">
                AI-powered learning resource discovery
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-3 sm:p-4 space-y-3 sm:space-y-4">
        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenChat={handleOpenChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        {activeTab !== 'favorites' && (
          <div className="brutal-border flex items-center gap-4  bg-white shadow-brutal p-4 sm:p-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={activeTab === 'search' ? handleSearch : handleGenerateRoadmap}
              isLoading={isSearching || isGenerating}
              activeTab={activeTab}
              placeholder={
                activeTab === 'search'
                  ? 'Search for free courses...'
                  : 'Enter a topic for your learning roadmap...'
              }
            />
            {activeTab === 'roadmap' && !isGenerating && (
              <div className="flex justify-end">
                <Button size="sm" className='md:w-46 md:h-16 flex items-center '  onClick={handleGenerateRoadmap} disabled={isGenerating}>
                  <Sparkles className="w-4 relative h-4 md:mr-2" />
                  <span className='md:block hidden'>Generate Roadmap</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <>
            <PopularTopics
              onSelect={handleTopicSelect}
              disabled={isSearching || isGenerating}
            />

            <div className="space-y-4">
              {isSearching && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <LoadingSpinner size="lg" />
                  <p className="text-brand-gray">Searching for courses...</p>
                </div>
              )}

              {searchError && (
                <div className="brutal-border border-red-500 bg-red-50 p-4">
                  <p className="text-red-600">{searchError}</p>
                </div>
              )}

              {!isSearching && courses.length > 0 && (
                <>
                  <p className="font-bold text-lg">
                    Found {courses.length} free courses
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {courses.map((course, index) => (
                      <CourseCard
                        key={`${course.url}-${index}`}
                        course={course}
                        onClick={() => setSelectedCourse(course)}
                        isFavorite={isFavorite(course.url)}
                        onToggleFavorite={() => toggleFavorite(course)}
                      />
                    ))}
                  </div>
                </>
              )}

              {!isSearching && courses.length === 0 && !searchError && (
                <div className="text-center py-12 text-brand-gray">
                  <p>Search for courses to see results here.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'roadmap' && (
          <>
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
          </>
        )}

        {activeTab === 'favorites' && (
          <FavoritesSection
            favorites={favorites}
            onRemove={removeFavorite}
            suggestions={{
              courses: suggestions,
              isLoading: isSuggestionsLoading,
              error: suggestionsError,
              onGetSuggestions: handleGetSuggestions,
            }}
          />
        )}
      </main>

      <footer className="border-t-2 border-brand-black bg-white py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-brand-gray">
          <p>Find free courses from Coursera, edX, MIT OpenCourseWare, YouTube, and more.</p>
        </div>
      </footer>

      <ChatTrigger onClick={handleOpenChat} />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        onOpenHistory={handleOpenHistory}
        isLoading={isChatLoading}
      />

      <ChatHistory
        isOpen={isChatHistoryOpen}
        onClose={handleCloseHistory}
        sessions={sessions}
        onSelectSession={handleSelectSession}
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
            <div>
              <p className="font-bold text-brand-gray uppercase text-xs tracking-wide mb-1">
                Provider
              </p>
              <p className="text-lg">{selectedCourse.provider}</p>
            </div>
            <div>
              <p className="font-bold text-brand-gray uppercase text-xs tracking-wide mb-1">
                Description
              </p>
              <p>{selectedCourse.description}</p>
            </div>
            {selectedCourse.rating && (
              <div>
                <p className="font-bold text-brand-gray uppercase text-xs tracking-wide mb-1">
                  Rating
                </p>
                <p>{selectedCourse.rating}</p>
              </div>
            )}
            {selectedCourse.duration && (
              <div>
                <p className="font-bold text-brand-gray uppercase text-xs tracking-wide mb-1">
                  Duration
                </p>
                <p>{selectedCourse.duration}</p>
              </div>
            )}
            {selectedCourse.level && (
              <div>
                <p className="font-bold text-brand-gray uppercase text-xs tracking-wide mb-1">
                  Level
                </p>
                <p>{selectedCourse.level}</p>
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => toggleFavorite(selectedCourse)}
                className="flex-1 brutal-border py-2 font-bold text-sm hover:bg-brand-paper transition-colors"
              >
                {isFavorite(selectedCourse.url) ? 'Remove from Favorites' : 'Add to Favorites'}
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
