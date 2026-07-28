"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Mistral } from "@mistralai/mistralai";
import { generateText } from "ai";
import { AISettings, Roadmap } from "@/shared/types";
import { performWebSearch } from "@/modules/courses/actions/searchCourses";

const isValid = (k?: string) =>
  k && k.trim().length > 5 && !k.includes("your_");

/**
 * Server action to generate personalized AI learning roadmaps.
 */
export async function generateRoadmap(
  topic: string,
  settings: AISettings,
): Promise<{ success: boolean; roadmap?: Roadmap; error?: string }> {
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
        prompt: `Generate a free learning roadmap for "${topic}". Return ONLY JSON with: title, description, totalDuration, steps:[{step, title, description, resources:[{title, url, type}]}]`,
      });
      const match = text.match(/\{[\s\S]*\}/);
      if (match)
        return { success: true, roadmap: { topic, ...JSON.parse(match[0]) } };
    } catch {}
  }

  const results = await performWebSearch(
    `learning path for ${topic}`,
    settings,
  );
  const prompt = `Generate a free learning roadmap for "${topic}". Return ONLY JSON with: title, description, totalDuration, steps:[{step, title, description, resources:[{title, url, type}]}]. Context: ${results}`;

  if (isValid(mistralKey)) {
    try {
      const mistral = new Mistral({ apiKey: mistralKey! });
      const res = await mistral.chat.complete({
        model: "mistral-medium-latest",
        messages: [{ role: "user", content: prompt }],
      });
      const text = res.choices?.[0]?.message?.content;
      if (typeof text === "string") {
        const match = text.match(/\{[\s\S]*\}/);
        if (match)
          return { success: true, roadmap: { topic, ...JSON.parse(match[0]) } };
      }
    } catch {}
  }

  return { success: false, error: "Failed to generate roadmap." };
}
