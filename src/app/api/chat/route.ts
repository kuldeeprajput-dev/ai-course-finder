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
        content: 'You are a helpful learning assistant. Help the user find educational resources and explain complex topics simply. Use markdown formatting to make responses clear and organized.'
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
