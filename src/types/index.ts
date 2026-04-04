export interface Course {
  title: string;
  provider: string;
  url: string;
  description: string;
  isFree: boolean;
  rating?: number;
  platform?: string;
  duration?: string;
  level?: string;
  thumbnail?: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  resources: {
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'project';
  }[];
}

export interface Roadmap {
  topic: string;
  title: string;
  description: string;
  totalDuration: string;
  steps: RoadmapStep[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface FavoriteCourse {
  id: string;
  title: string;
  provider: string;
  url: string;
  description?: string;
  rating?: number;
  duration?: string;
  level?: string;
  addedAt: number;
}

export interface AISettings {
  primaryProvider: 'gemini' | 'mistral';
  geminiApiKey?: string;
  mistralApiKey?: string;
  tavilyApiKey?: string;
  serperApiKey?: string;
}

export interface SearchResult {
  success: boolean;
  courses?: Course[];
  error?: string;
}

export interface RoadmapResult {
  success: boolean;
  roadmap?: Roadmap;
  error?: string;
}

export interface ChatResult {
  success: boolean;
  text?: string;
  error?: string;
}
