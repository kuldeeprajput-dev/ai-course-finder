import { FavoriteCourse, Course } from '@/types';

const TAVILY_KEY = process.env.TAVILY_API_KEY;

export async function POST(req: Request) {
  try {
    const { favorites } = await req.json() as { favorites: FavoriteCourse[] };

    if (!favorites?.length) {
      return Response.json({ success: false, error: 'No favorites provided' });
    }

    const topics = favorites.map(f => f.title).slice(0, 3).join(', ');
    const query = `free online courses related to ${topics}`;

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query,
        search_depth: 'basic',
        max_results: 8,
      }),
    });

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    const favUrls = new Set(favorites.map(f => f.url));

    const courses: Course[] = data.results
      .map((result: any) => {
        const url = result.url || '';
        const provider = extractProvider(url);
        
        // Simplified free check
        const freeDomains = ['mit.edu', 'ocw.', 'youtube.com', 'github.com', 'khanacademy.org', 'freecodecamp', 'cs50.', 'coursera.org/', 'edx.org'];
        const isFree = freeDomains.some(domain => url.includes(domain));

        return {
          title: result.title || '',
          provider,
          url,
          description: (result.content || '').slice(0, 200),
          isFree,
          platform: provider,
        };
      })
      .filter((c: Course) => c.title && c.url && !favUrls.has(c.url))
      .slice(0, 6);

    return Response.json({ success: true, courses });
  } catch {
    return Response.json({ success: false, error: 'Failed to get suggestions' });
  }
}

function extractProvider(url: string): string {
  try {
    const host = new URL(url).hostname.replace('www.', '').split('.')[0];
    return host.charAt(0).toUpperCase() + host.slice(1).replace(/-/g, ' ');
  } catch {
    return 'Resource';
  }
}
