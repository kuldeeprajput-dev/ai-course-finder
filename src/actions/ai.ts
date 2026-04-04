'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Mistral } from '@mistralai/mistralai';
import { generateText } from 'ai';
import { AISettings, Course, Roadmap } from '@/types';

const DEFAULT_TAVILY_KEY = process.env.TAVILY_API_KEY || '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';
const DEFAULT_SERPER_KEY = process.env.SERPER_API_KEY || '60738fce452a865368332321d9507edde21c5b1a';

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.trim();
  return k !== '' && !k.includes('MY_') && !k.includes('TODO') && k !== 'undefined' && k !== 'null';
}

export async function performWebSearch(query: string, keys: Partial<AISettings>): Promise<string> {
  let results = '';
  const tavilyKey = isValidKey(keys.tavilyApiKey) ? keys.tavilyApiKey : DEFAULT_TAVILY_KEY;
  const serperKey = isValidKey(keys.serperApiKey) ? keys.serperApiKey : DEFAULT_SERPER_KEY;

  if (isValidKey(tavilyKey)) {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: 'advanced',
          max_results: 5,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        results = data.results
          .map((r: { title: string; url: string; content: string }) => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
          .join('\n\n');
      }
    } catch {
      console.error('Tavily search failed');
    }
  }

  if (!results && isValidKey(serperKey)) {
    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: new Headers({
          'X-API-KEY': serperKey!,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ q: query }),
      });
      if (response.ok) {
        const data = await response.json();
        results = data.organic
          ?.map((r: { title: string; link: string; snippet: string }) => `Title: ${r.title}\nURL: ${r.link}\nSnippet: ${r.snippet}`)
          .join('\n\n') || '';
      }
    } catch {
      console.error('Serper search failed');
    }
  }

  return results;
}

export async function searchCourses(
  query: string,
  settings: AISettings
): Promise<{ success: boolean; courses?: Course[]; error?: string }> {
  const geminiKey = isValidKey(settings.geminiApiKey)
    ? settings.geminiApiKey
    : process.env.GEMINI_API_KEY;
  const mistralKey = isValidKey(settings.mistralApiKey)
    ? settings.mistralApiKey
    : process.env.MISTRAL_API_KEY;

  if (settings.primaryProvider !== 'mistral' && isValidKey(geminiKey)) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey! });
      const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        prompt: `Find the best 5 FREE online courses for "${query}". Use Google Search to find real, current courses from providers like Coursera, edX, MIT, YouTube, etc. Return ONLY a JSON array with objects containing: title, provider, url, description, isFree (true), rating (string like "4.5/5").`,
      });
      
      const coursesMatch = text.match(/\[[\s\S]*\]/);
      if (coursesMatch) {
        const courses = JSON.parse(coursesMatch[0]);
        return { success: true, courses };
      }
    } catch (e) {
      console.warn('Gemini search failed:', e);
    }
  }

  const searchResults = await performWebSearch(`free online courses for ${query}`, settings);
  const prompt = `Based on these search results, find the best 5 FREE online courses for "${query}".
  Return ONLY a JSON array of objects with these fields: title, provider, url, description, isFree (boolean), rating (optional string).
  
  Search Results:
  ${searchResults || 'No search results found. Use your internal knowledge to suggest the best free courses.'}`;

  if (isValidKey(mistralKey)) {
    try {
      const mistral = new Mistral({ apiKey: mistralKey! });
      const response = await mistral.chat.complete({
        model: 'mistral-medium-latest',
        messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY the JSON array.' }],
      });
      
      const text = response.choices?.[0]?.message?.content;
      if (typeof text === 'string') {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        return { success: true, courses: jsonMatch ? JSON.parse(jsonMatch[0]) : [] };
      }
    } catch {
      console.error('Mistral search failed');
    }
  }

  return { success: false, error: 'All search providers failed.' };
}

export async function generateRoadmap(
  topic: string,
  settings: AISettings
): Promise<{ success: boolean; roadmap?: Roadmap; error?: string }> {
  const geminiKey = isValidKey(settings.geminiApiKey)
    ? settings.geminiApiKey
    : process.env.GEMINI_API_KEY;
  const mistralKey = isValidKey(settings.mistralApiKey)
    ? settings.mistralApiKey
    : process.env.MISTRAL_API_KEY;

  if (settings.primaryProvider !== 'mistral' && isValidKey(geminiKey)) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey! });
      const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        prompt: `Generate a structured learning roadmap for "${topic}". Use Google Search to find the best free resources and learning paths. Return ONLY a JSON object with: topic, title, description, totalDuration (string), steps (array of objects with step (number), title, description, resources (array of {title, url, type: "course"|"article"|"video"|"project"})).`,
      });
      
      const roadmapMatch = text.match(/\{[\s\S]*\}/);
      if (roadmapMatch) {
        const parsed = JSON.parse(roadmapMatch[0]);
        return {
          success: true,
          roadmap: {
            topic,
            title: parsed.title,
            description: parsed.description,
            totalDuration: parsed.totalDuration || 'Varies',
            steps: parsed.steps,
          },
        };
      }
    } catch (e) {
      console.warn('Gemini roadmap failed:', e);
    }
  }

  const searchResults = await performWebSearch(`learning path and resources for ${topic}`, settings);
  const prompt = `Generate a structured learning roadmap for "${topic}".
  Return ONLY a JSON object with these fields: title, description, totalDuration (string), steps (array of objects with step (number), title, description, resources (array of {title, url, type})).
  
  Context:
  ${searchResults || 'No search results found. Use your internal knowledge to generate a high-quality roadmap.'}`;

  if (isValidKey(mistralKey)) {
    try {
      const mistral = new Mistral({ apiKey: mistralKey! });
      const response = await mistral.chat.complete({
        model: 'mistral-medium-latest',
        messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY the JSON object.' }],
      });
      
      const text = response.choices?.[0]?.message?.content;
      if (typeof text === 'string') {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            roadmap: {
              topic,
              title: parsed.title,
              description: parsed.description,
              totalDuration: parsed.totalDuration || 'Varies',
              steps: parsed.steps,
            },
          };
        }
      }
    } catch {
      console.error('Mistral roadmap failed');
    }
  }

  return { success: false, error: 'All roadmap providers failed.' };
}


