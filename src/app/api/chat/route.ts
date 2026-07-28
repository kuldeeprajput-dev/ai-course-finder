import { Mistral } from '@mistralai/mistralai';
import { ChatMessage, AISettings } from '@/types';

export async function POST(req: Request) {
  try {
    const { message, history, settings } = await req.json() as {
      message: string;
      history: ChatMessage[];
      settings: AISettings;
    };

    const mistralKey = settings.mistralApiKey || process.env.MISTRAL_API_KEY;

    function isValid(k: string | undefined): boolean {
      if (!k) return false;
      const key = k.trim();
      return key !== '' && !key.includes('MY_') && !key.includes('TODO') && key !== 'undefined' && key !== 'null';
    }

    if (!isValid(mistralKey)) {
      return new Response(JSON.stringify({ error: 'No valid Mistral API key. Please add your API key in Settings.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new Mistral({ apiKey: mistralKey! });

    const messages = [
      {
        type: 'message.input',
        role: 'assistant',
        content: `You are CourseFinder AI, a highly articulate, structured, and helpful learning assistant.

Formatting & Style Rules:
1. EMOJI POLICY: Keep emoji usage to a minimum. Use emojis ONLY when strictly necessary or as single functional section markers (e.g. 📚, 🚀). Never spam emojis or insert them into every line/sentence.
2. READABILITY & STRUCTURE:
   - Provide clear, direct, and well-structured answers using clean Markdown.
   - Use bold text for key terms and bulleted lists for steps or recommendations.
   - Separate distinct concepts into short, readable paragraphs and sections.
   - If writing code, use triple-backtick code blocks with language identifiers.`,
      },
      ...history.map((m): { type: string; role: 'user' | 'assistant'; content: string } => ({
        type: 'message.input',
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { type: 'message.input', role: 'user' as const, content: message },
    ];


    const stream = await client.beta.conversations.startStream({
      inputs: messages as any,
      model: 'mistral-medium-latest',
      completionArgs: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1,
      },
    });

    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream as any) {
            const content = chunk?.data?.content;
            if (typeof content === 'string') {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          console.error('Stream iteration error:', error);
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
