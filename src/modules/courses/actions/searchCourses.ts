"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Mistral } from "@mistralai/mistralai";
import { generateText } from "ai";
import { AISettings, Course } from "@/shared/types";

const TAVILY_KEY = process.env.TAVILY_API_KEY;
const SERPER_KEY = process.env.SERPER_API_KEY;

const isValid = (k?: string) =>
  k && k.trim().length > 5 && !k.includes("your_");

/**
 * Performs web search via Tavily or Serper fallback APIs.
 */
export async function performWebSearch(
  query: string,
  keys: Partial<AISettings>,
): Promise<string> {
  const tavilyKey = isValid(keys.tavilyApiKey) ? keys.tavilyApiKey : TAVILY_KEY;
  const serperKey = isValid(keys.serperApiKey) ? keys.serperApiKey : SERPER_KEY;

  if (isValid(tavilyKey)) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: tavilyKey, query, max_results: 5 }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.results
          .map(
            (r: any) =>
              `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`,
          )
          .join("\n\n");
      }
    } catch {}
  }

  if (isValid(serperKey)) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperKey!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query }),
      });
      if (res.ok) {
        const data = await res.json();
        return (
          data.organic
            ?.map(
              (r: any) =>
                `Title: ${r.title}\nURL: ${r.link}\nSnippet: ${r.snippet}`,
            )
            .join("\n\n") || ""
        );
      }
    } catch {}
  }
  return "";
}

/**
 * Searches for free online courses using Gemini and Mistral AI models.
 */
export async function searchCourses(
  query: string,
  settings: AISettings,
): Promise<{ success: boolean; courses?: Course[]; error?: string }> {
  const geminiKey = isValid(settings.geminiApiKey)
    ? settings.geminiApiKey
    : process.env.GEMINI_API_KEY;
  const mistralKey = isValid(settings.mistralApiKey)
    ? settings.mistralApiKey
    : process.env.MISTRAL_API_KEY;

  if (settings.primaryProvider !== "mistral" && isValid(geminiKey)) {
    try {
      const { text } = await generateText({
        model: createGoogleGenerativeAI({ apiKey: geminiKey! })(
          "gemini-2.0-flash",
        ),
        prompt: `Find 5 FREE online courses for "${query}". Return ONLY a JSON array with: title, provider, url, description, isFree(true), rating.`,
      });
      const match = text.match(/\[[\s\S]*\]/);
      if (match) return { success: true, courses: JSON.parse(match[0]) };
    } catch {}
  }

  const results = await performWebSearch(
    `free online courses for ${query}`,
    settings,
  );
  const prompt = `Find 5 FREE courses for "${query}". Return ONLY JSON array of {title, provider, url, description, isFree, rating}. Results: ${results}`;

  if (isValid(mistralKey)) {
    try {
      const mistral = new Mistral({ apiKey: mistralKey! });
      const res = await mistral.chat.complete({
        model: "mistral-medium-latest",
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.choices?.[0]?.message?.content;
      if (typeof text === "string") {
        const match = text.match(/\[[\s\S]*\]/);
        return { success: true, courses: match ? JSON.parse(match[0]) : [] };
      }
    } catch {}
  }

  return { success: false, error: "All search providers failed." };
}
