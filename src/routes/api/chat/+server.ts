import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';
import { generateAboutMeContext } from '$lib/services/aboutMeContext';

// Cache the context to avoid regenerating on every request
let cachedContext: string | null = null;

async function getAboutMeContext(): Promise<string> {
	if (!cachedContext) {
		cachedContext = await generateAboutMeContext();
	}
	return cachedContext;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages } = await request.json();

		if (!messages || !Array.isArray(messages)) {
			return json({ error: 'Invalid request: messages array required' }, { status: 400 });
		}

		// Initialize OpenAI client with runtime env var (resolved by 1Password CLI)
		const openai = new OpenAI({
			apiKey: SECRET_OPENAI_API_KEY
		});

		// Get dynamically generated context
		const context = await getAboutMeContext();

		// Create streaming chat completion with GPT-5 nano
		const stream = await openai.chat.completions.create({
			model: 'gpt-5-nano',
			messages: [
				{
					role: 'system',
					content: context
				},
				...messages
			],
			stream: true
		});

		// Create a ReadableStream to stream the response
		const readableStream = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content;
						if (content) {
							// Send each chunk as a server-sent event
							controller.enqueue(
								new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
							);
						}
					}
					// Send done signal
					controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
					controller.close();
				} catch (error) {
					console.error('Streaming error:', error);
					controller.error(error);
				}
			}
		});

		return new Response(readableStream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (error) {
		console.error('Chat API error:', error);
		return json(
			{
				error: error instanceof Error ? error.message : 'An error occurred processing your request'
			},
			{ status: 500 }
		);
	}
};
