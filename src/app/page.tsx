"use client";

import { useState, useEffect } from "react";
import {
  SearchBar,
  CourseCard,
  PopularTopics,
  TabNav,
  useCourseSearch,
  useSuggestions,
} from "@/modules/courses";
import { RoadmapView, useRoadmap } from "@/modules/roadmap";
import {
  ChatDrawer,
  ChatTrigger,
  ChatHistory,
  SettingsModal,
  useChat,
  useChatHistory,
} from "@/modules/chat";
import {
  FavoritesSection,
  ExportButton,
  useFavorites,
} from "@/modules/favorites";
import {
  BrandMark,
  Button,
  LoadingSpinner,
  Modal,
  useAISettings,
  Course,
  ChatSession,
} from "@/shared";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";

type Tab = "search" | "roadmap" | "favorites";

export default function Home() {
  const { settings, updateSettings } = useAISettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [roadmapQuery, setRoadmapQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [hasSearched, setHasSearched] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSearchQuery = localStorage.getItem(
        "free-course-finder-search-query",
      );
      if (savedSearchQuery) setSearchQuery(savedSearchQuery);

      const savedRoadmapQuery = localStorage.getItem(
        "free-course-finder-roadmap-query",
      );
      if (savedRoadmapQuery) setRoadmapQuery(savedRoadmapQuery);

      const savedActiveTab = localStorage.getItem(
        "free-course-finder-active-tab",
      ) as Tab | null;
      if (savedActiveTab) setActiveTab(savedActiveTab);

      const savedHasSearched = localStorage.getItem(
        "free-course-finder-has-searched",
      );
      if (savedHasSearched) setHasSearched(JSON.parse(savedHasSearched));

      const savedSessionId = localStorage.getItem(
        "free-course-finder-current-session-id",
      );
      if (savedSessionId) setCurrentSessionId(savedSessionId);

      const savedIsChatOpen = localStorage.getItem(
        "free-course-finder-is-chat-open",
      );
      if (savedIsChatOpen) setIsChatOpen(JSON.parse(savedIsChatOpen));
    } catch (e) {
      console.error("Failed to load page queries from localStorage:", e);
    } finally {
      setIsStateLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isStateLoaded) {
      localStorage.setItem("free-course-finder-search-query", searchQuery);
    }
  }, [searchQuery, isStateLoaded]);

  useEffect(() => {
    if (isStateLoaded) {
      localStorage.setItem("free-course-finder-roadmap-query", roadmapQuery);
    }
  }, [roadmapQuery, isStateLoaded]);

  useEffect(() => {
    if (isStateLoaded) {
      localStorage.setItem("free-course-finder-active-tab", activeTab);
    }
  }, [activeTab, isStateLoaded]);

  useEffect(() => {
    if (isStateLoaded) {
      localStorage.setItem(
        "free-course-finder-has-searched",
        JSON.stringify(hasSearched),
      );
    }
  }, [hasSearched, isStateLoaded]);

  useEffect(() => {
    if (isStateLoaded) {
      localStorage.setItem(
        "free-course-finder-is-chat-open",
        JSON.stringify(isChatOpen),
      );
    }
  }, [isChatOpen, isStateLoaded]);

  useEffect(() => {
    if (isStateLoaded) {
      if (currentSessionId) {
        localStorage.setItem(
          "free-course-finder-current-session-id",
          currentSessionId,
        );
      } else {
        localStorage.removeItem("free-course-finder-current-session-id");
      }
    }
  }, [currentSessionId, isStateLoaded]);

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
    loadMessages,
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
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    search(searchQuery.trim());
  };

  const handleAction = (topic: string) => {
    setSearchQuery(topic);
    setHasSearched(true);
    search(topic);
    setActiveTab("search");
  };

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (roadmapQuery.trim()) generate(roadmapQuery.trim());
  };

  const handleChatClose = () => {
    if (messages.length > 0 && isHistoryLoaded) {
      const id = saveSession(messages);
      if (id && currentSessionId) updateSession(currentSessionId, messages);
      else if (id) setCurrentSessionId(id);
    }
    setIsChatOpen(false);
  };

  const handleNewChat = () => {
    if (messages.length > 0 && isHistoryLoaded) {
      const id = saveSession(messages);
      if (id && currentSessionId) updateSession(currentSessionId, messages);
    }
    clearMessages();
    setCurrentSessionId(null);
  };

  const handleSessionSelect = (session: ChatSession) => {
    loadMessages(session.messages);
    setCurrentSessionId(session.id);
    setIsChatHistoryOpen(false);
    setIsChatOpen(true);
  };

  const heroCopy =
    activeTab === "search"
      ? {
          eyebrow: "Learn without limits",
          title: "What do you want to learn?",
          description:
            "Search trusted platforms and find high-quality courses that fit your goals—completely free.",
        }
      : {
          eyebrow: "Your personalized path",
          title: "Turn curiosity into a clear plan.",
          description:
            "Choose a skill or subject and get a practical, step-by-step learning roadmap in seconds.",
        };

  if (!isStateLoaded) {
    return (
      <div
        className="loading-screen fixed inset-0 z-[200] flex items-center justify-center overflow-hidden text-brand-black"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="loading-ambient loading-ambient-one" />
        <div className="loading-ambient loading-ambient-two" />
        <div className="loading-ambient loading-ambient-three" />
        <div className="loading-grid" />

        <div className="relative flex w-full max-w-sm flex-col items-center px-8 text-center">
          <div className="loading-mark-wrap">
            <span className="loading-ripple loading-ripple-1" />
            <span className="loading-ripple loading-ripple-2" />
            <span className="loading-orbit-outer" />
            <span className="loading-orbit-inner" />
            <BrandMark className="loading-mark h-[72px] w-[72px] shadow-[0_18px_45px_rgba(232,93,63,0.3)]" />
          </div>

          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-orange">
              Learn without limits
            </p>
            <h1 className="font-display mt-2 text-[34px] font-bold leading-none tracking-[-0.035em] text-brand-black">
              coursefinder
            </h1>
            <p className="mt-2.5 text-xs font-medium text-brand-gray">
              Preparing your personalized learning space…
            </p>
          </div>

          <div className="loading-progress mt-8" aria-hidden="true">
            <span />
          </div>
          <span className="sr-only">Loading Coursefinder</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#e5e9e4] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 max-sm:h-16">
          <button
            className="flex items-center gap-3"
            onClick={() => setActiveTab("search")}
            aria-label="Go to course search"
          >
            <BrandMark className="h-10 w-10 shadow-[0_7px_16px_rgba(232,93,63,0.2)]" />
            <span className="text-left">
              <span className="block text-lg font-bold tracking-[-0.03em]">
                coursefinder
              </span>
              <span className="hidden text-[11px] font-medium text-brand-gray sm:block">
                Curated learning, powered by AI
              </span>
            </span>
          </button>
          <div className="hidden items-center gap-2 text-xs font-medium text-brand-gray md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Discover courses from leading platforms
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-7 max-sm:px-3 max-sm:py-4">
        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {activeTab !== "favorites" && (
          <>
            <section className="relative mt-3.5 overflow-hidden rounded-[20px] border border-[#dce3dc] bg-gradient-to-b from-[#f2f6f4] via-[#f7f9f8] to-white p-4 text-brand-black shadow-[0_10px_30px_rgba(23,33,27,0.04)] sm:hidden">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-orange/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-600/10 blur-2xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/20 bg-[#fcebe7] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-orange">
                  <Sparkles className="h-3 w-3" />
                  {heroCopy.eyebrow}
                </div>
                <h1 className="font-display mt-2.5 text-[22px] font-normal leading-[1.12] tracking-[-0.03em] text-brand-black">
                  {heroCopy.title}
                </h1>
                <p className="mt-1.5 text-[11px] font-normal leading-relaxed text-brand-gray">
                  {heroCopy.description}
                </p>

                <div className="mt-3 rounded-xl border border-[#e0e5df] bg-white p-1 shadow-[0_6px_16px_rgba(23,33,27,0.06)]">
                  <SearchBar
                    value={activeTab === "search" ? searchQuery : roadmapQuery}
                    onChange={
                      activeTab === "search" ? setSearchQuery : setRoadmapQuery
                    }
                    onSubmit={
                      activeTab === "search" ? handleSearch : handleGenerate
                    }
                    isLoading={
                      activeTab === "search" ? isSearching : isGenerating
                    }
                    activeTab={activeTab}
                  />
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-[#e2e8e2] pt-2.5 text-[10px] font-medium text-brand-gray">
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-brand-orange" />
                    100% Free
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-brand-orange" />
                    AI Personalized
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-brand-orange" />
                    Top Platforms
                  </span>
                </div>
              </div>
            </section>

            <section className="relative mt-5 hidden overflow-hidden rounded-[28px] border border-[#d6e2db] bg-gradient-to-r from-[#f2f6f4] via-[#fafcfb] to-white px-5 py-8 text-brand-black shadow-sm sm:block sm:px-10 sm:py-9 lg:px-14 lg:py-10">
              <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full border-[58px] border-emerald-900/[0.04]" />
              <div className="pointer-events-none absolute -bottom-36 right-32 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />
              <div className="relative max-w-3xl">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  <Sparkles className="h-3.5 w-3.5" />
                  {heroCopy.eyebrow}
                </p>
                <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-brand-black sm:text-[44px] lg:text-[50px]">
                  {heroCopy.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-gray sm:text-[15px]">
                  {heroCopy.description}
                </p>
                <div className="mt-5 rounded-2xl border border-[#dfe5de] bg-white p-2 shadow-[0_10px_30px_rgba(23,33,27,0.05)] sm:p-2.5">
                  <SearchBar
                    value={activeTab === "search" ? searchQuery : roadmapQuery}
                    onChange={
                      activeTab === "search" ? setSearchQuery : setRoadmapQuery
                    }
                    onSubmit={
                      activeTab === "search" ? handleSearch : handleGenerate
                    }
                    isLoading={
                      activeTab === "search" ? isSearching : isGenerating
                    }
                    activeTab={activeTab}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-brand-gray">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-brand-orange" /> 100%
                    free resources
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-brand-orange" />{" "}
                    Personalized with AI
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-brand-orange" /> Trusted
                    platforms
                  </span>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "search" && (
          <div className="space-y-7 py-8 max-sm:space-y-6 max-sm:py-6">
            <PopularTopics onSelect={handleAction} disabled={isSearching} />
            {isSearching ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-[#e2e7e1] bg-white">
                <LoadingSpinner size="lg" />
                <div className="text-center">
                  <p className="font-semibold">Finding your best matches</p>
                  <p className="mt-1 text-sm text-brand-gray">
                    Searching across trusted learning platforms…
                  </p>
                </div>
              </div>
            ) : searchError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {searchError}
              </div>
            ) : courses.length > 0 ? (
              <section>
                <div className="mb-5 flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
                      Curated for you
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                      Top course matches
                    </h2>
                  </div>
                  <span className="text-sm text-brand-gray">
                    {courses.length}{" "}
                    {courses.length === 1 ? "course" : "courses"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              </section>
            ) : hasSearched ? (
              <div className="rounded-2xl border border-[#e2e7e1] bg-white py-14 text-center">
                <Search className="mx-auto h-8 w-8 text-brand-gray/45" />
                <h2 className="mt-4 font-semibold">
                  No matching courses found
                </h2>
                <p className="mt-1 text-sm text-brand-gray">
                  Try a broader topic or choose one of the popular searches
                  above.
                </p>
              </div>
            ) : (
              <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: Search,
                    title: "Search naturally",
                    text: "Describe the skill you want to build in your own words.",
                  },
                  {
                    icon: BookOpen,
                    title: "Compare the best",
                    text: "Explore free courses from respected learning platforms.",
                  },
                  {
                    icon: Heart,
                    title: "Build your library",
                    text: "Save promising courses and get related recommendations.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#e1e6e0] bg-white p-5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fcebe7] text-brand-orange">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-brand-gray">
                      {item.text}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-5 py-8 max-sm:py-6">
            <RoadmapView
              roadmap={roadmap}
              isLoading={isGenerating}
              error={roadmapError || undefined}
            />
            {roadmap && (
              <div className="flex justify-end max-sm:[&>*]:w-full">
                <ExportButton roadmap={roadmap} />
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="py-8 max-sm:py-6">
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
          </div>
        )}
      </main>

      <footer className="border-t border-[#e3e8e2] bg-white">
        {/* Mobile Only Footer (sm:hidden - 100% untouched) */}
        <div className="flex flex-col gap-1.5 px-4 py-3 text-xs text-brand-gray max-sm:pr-16 sm:hidden">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-7.5 w-7.5 shrink-0" />
            <div>
              <p className="font-semibold text-brand-black">
                Learn more. Spend less. Grow continuously.
              </p>
              <p className="mt-0.5 text-[10px] text-brand-gray/80">
                Coursera · edX · MIT OCW · YouTube · and more
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Only Simple & Clean Footer (hidden sm:flex) */}
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-6 text-sm text-brand-gray sm:flex">
          <div className="flex items-center gap-3">
            <BrandMark className="h-7 w-7 shadow-[0_4px_12px_rgba(232,93,63,0.16)]" />
            <div>
              <span className="font-bold tracking-[-0.02em] text-brand-black">
                coursefinder
              </span>
              <span className="mx-2 text-brand-gray/40">•</span>
              <span className="text-brand-gray">
                Learn more. Spend less. Grow continuously.
              </span>
            </div>
          </div>
          <p className="text-xs text-brand-gray/80">
            Coursera · edX · MIT OCW · YouTube · Khan Academy · and more
          </p>
        </div>
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
        onNewChat={handleNewChat}
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
          <div className="space-y-5">
            {["Provider", "Description", "Rating", "Duration", "Level"].map(
              (label) => {
                const value =
                  selectedCourse[label.toLowerCase() as keyof Course];
                return (
                  value && (
                    <div key={label}>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gray">
                        {label}
                      </p>
                      <p
                        className={
                          label === "Provider"
                            ? "text-lg font-semibold"
                            : "text-sm leading-6 text-[#465149]"
                        }
                      >
                        {String(value)}
                      </p>
                    </div>
                  )
                );
              },
            )}
            <div className="flex flex-col gap-2 border-t border-[#e5e9e4] pt-5 sm:flex-row">
              <Button
                onClick={() => toggleFavorite(selectedCourse)}
                variant="secondary"
                className="flex-1"
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isFavorite(selectedCourse.url)
                      ? "fill-current text-red-500"
                      : ""
                  }`}
                />
                {isFavorite(selectedCourse.url)
                  ? "Remove saved"
                  : "Save course"}
              </Button>
              <a
                href={selectedCourse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn flex-1 gap-2 text-sm"
              >
                Visit course <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
