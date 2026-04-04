import { FavoriteCourse, Course } from '@/types';

const DEFAULT_TAVILY_KEY = process.env.TAVILY_API_KEY || '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';

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results: TavilyResult[];
}

export async function POST(req: Request) {
  try {
    const { favorites } = await req.json() as { favorites: FavoriteCourse[] };

    if (!favorites || favorites.length === 0) {
      return Response.json({
        success: false,
        error: 'No favorites provided',
      });
    }

    const topics = favorites.map((f) => f.title).slice(0, 3).join(', ');
    const query = `free online courses related to ${topics}`;

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: DEFAULT_TAVILY_KEY,
        query,
        search_depth: 'basic',
        max_results: 8,
      }),
    });

    if (!response.ok) {
      throw new Error('Tavily search failed');
    }

    const data: TavilyResponse = await response.json();

    const courses: Course[] = data.results
      .map((result: TavilyResult) => {
        const url = result.url || '';
        const title = result.title || '';
        const description = result.content || '';

        const isFree =
          url.includes('mit.edu') ||
          url.includes('ocw.') ||
          url.includes('youtube.com') ||
          url.includes('github.com') ||
          url.includes('khanacademy.org') ||
          url.includes('freecodecamp') ||
          url.includes('cs50.') ||
          url.includes('codecademy.com') ||
          url.includes('fast.ai') ||
          url.includes('deeplearning.ai') ||
          url.includes('coursera.org/') ||
          url.includes('edx.org') ||
          url.includes('udacity.com') ||
          url.includes('alison.com') ||
          url.includes('open.edu');

        const provider = extractProvider(url);

        return {
          title,
          provider,
          url,
          description: description.slice(0, 300),
          isFree,
          rating: undefined,
          platform: provider,
          duration: undefined,
          level: undefined,
        };
      })
      .filter(
        (course: Course) =>
          course.title &&
          course.url &&
          course.title.length > 5 &&
          !course.title.includes('404') &&
          !course.url.includes('redirect')
      )
      .filter((course: Course) => {
        const favUrls = favorites.map((f) => f.url);
        return !favUrls.includes(course.url);
      })
      .slice(0, 6);

    return Response.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return Response.json({
      success: false,
      error: 'Failed to get suggestions. Please try again.',
    });
  }
}

function extractProvider(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    if (parts.length >= 2) {
      return parts[0]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
    }
    return hostname;
  } catch {
    return 'Unknown';
  }
}
