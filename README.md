<div align="center">
  <img src="./public/icon.svg" alt="Coursenva Logo" width="80" height="80" />

# Coursenva

**AI-Powered Course Search, Career Roadmaps & Learning Assistant**

[![Next.js](https://img.shields.io/badge/Next.js-16-17211B?style=flat&logo=next.js&logoColor=E85D3F)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-17211B?style=flat&logo=react&logoColor=E85D3F)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-17211B?style=flat&logo=typescript&logoColor=E85D3F)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-17211B?style=flat&logo=tailwindcss&logoColor=E85D3F)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-E85D3F?style=flat)](./LICENSE)
</div>

---

## System Overview

**Coursenva** helps learners discover top free online courses across the web, generate step-by-step career roadmaps, export study guides as PDFs, and get real-time guidance from an interactive AI assistant.

---

## Application Video Walkthrough

<div align="center">
  <video src="https://res.cloudinary.com/hankiyahua23r23/video/upload/v1785299276/freecourse_b6yoat.mp4" controls width="100%" poster="https://res.cloudinary.com/hankiyahua23r23/video/upload/so_0,w_1280,q_auto,f_jpg/v1785299276/freecourse_b6yoat.jpg">
    <a href="https://res.cloudinary.com/hankiyahua23r23/video/upload/v1785299276/freecourse_b6yoat.mp4">
      Watch Coursenva Full Application Demonstration Video
    </a>
  </video>

  <p>
    <em>Demonstration of natural language course discovery, AI roadmap generation, multi-page PDF export, and streaming assistant interaction.</em>
  </p>
</div>

---

## Technology Stack

### Frontend Architecture

- **Framework**: Next.js 16.2.12 (App Router, Turbopack)
- **UI Library**: React 19.2.8
- **Language**: TypeScript 5.8 (Strict Mode Enabled)
- **Styling**: Tailwind CSS 4.0 (`@theme` variables, CSS module isolation)
- **Icons**: Lucide React 0.546.0

### Server & AI Infrastructure

- **LLM Integration**: Vercel AI SDK (`ai`), `@ai-sdk/google`, `@mistralai/mistralai`
- **Search Ingestion**: `@tavily/core`, Google Serper REST API
- **Document Generation**: `jspdf`, `html2canvas`

### Quality Assurance & Tooling

- **Code Formatting & Linting**: Prettier, ESLint 9 (Flat Config), `@typescript-eslint`
- **Git Hooks**: Husky 9, `lint-staged`

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.9.0` or higher
- **Package Manager**: `npm` `v10.0.0`+ or `bun` `v1.1.0`+
- **API Keys**: At least one LLM key (`MISTRAL_API_KEY` or `GEMINI_API_KEY`) and one search key (`TAVILY_API_KEY` or `SERPER_API_KEY`)

### Installation & Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kuldeeprajput-dev/ai-course-finder.git
   cd ai-course-finder
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the template file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

4. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Access the workspace at `http://localhost:3000`.

---

## Environment Configuration

Configure server-side environment variables inside `.env.local`:

```env
# Generative AI Providers
GEMINI_API_KEY=your_gemini_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here

# Web Search Grounding Providers
TAVILY_API_KEY=your_tavily_api_key_here
SERPER_API_KEY=your_serper_api_key_here
```

### Key Resolution & Fallback Matrix

| Variable          | Scope       | Primary Purpose                                                  | Fallback Behavior                                                       |
| :---------------- | :---------- | :--------------------------------------------------------------- | :---------------------------------------------------------------------- |
| `GEMINI_API_KEY`  | Server-only | Primary course discovery and roadmap generation.                 | Falls back to `MISTRAL_API_KEY` if key is unconfigured or rate-limited. |
| `MISTRAL_API_KEY` | Server-only | Primary streaming chat assistant and secondary search generator. | Required for `/api/chat` streaming functionality.                       |
| `TAVILY_API_KEY`  | Server-only | Primary web search grounding and course recommendation provider. | Falls back to `SERPER_API_KEY` if search query fails.                   |
| `SERPER_API_KEY`  | Server-only | Secondary Google Search API fallback provider.                   | Utilized automatically when Tavily quota is exhausted.                  |

---

## License

This project is licensed under the [MIT License](./LICENSE) - see the [`LICENSE`](./LICENSE) file for details.

---

## Support & Feedback

If you find this project helpful, please consider giving it a ⭐ star on GitHub!
