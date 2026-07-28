# Coursenva

[![Live Demo](https://ai-course-finder-ivory.vercel.app/)](https://ai-course-finder-ivory.vercel.app/)

An AI-powered learning resource discovery platform that helps you find free courses from multiple sources including Coursera, edX, MIT OpenCourseWare, YouTube, and more.

## Features

- **AI-Powered Search** - Find courses using natural language queries powered by AI
- **Learning Roadmaps** - Generate structured learning paths for any topic
- **Favorites** - Save and manage courses for later
- **Multi-Source Search** - Aggregates courses from multiple platforms
- **PDF Export** - Export courses and roadmaps as PDF documents
- **AI Provider Options** - Choose between Google Gemini or Mistral AI
- **Chat History** - Keep track of your previous searches
- **Popular Topics** - Quick-start with curated topics like Web Development, ML, Data Science, and more

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **AI**: Google Gemini SDK, Mistral AI
- **Search**: Tavily AI, Serper
- **Export**: jsPDF, html2canvas

## Getting Started

### Prerequisites

- Node.js 18+
- API keys for AI providers (see below)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your-gemini-api-key
MISTRAL_API_KEY=your-mistral-api-key
TAVILY_API_KEY=your-tavily-api-key
SERPER_API_KEY=your-serper-api-key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start development server     |
| `npm run build`     | Build for production         |
| `npm run start`     | Start production server      |
| `npm run lint`      | Run ESLint                   |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
├── actions/          # Server actions
├── app/              # Next.js App Router pages
│   ├── api/          # API routes (chat, suggestions)
│   ├── page.tsx      # Home page
│   └── layout.tsx    # Root layout
├── components/
│   ├── features/     # Feature components (search, chat, roadmap, etc.)
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── providers/        # React context providers
└── types/            # TypeScript type definitions
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables
4. Deploy

---
