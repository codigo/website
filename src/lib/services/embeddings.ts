import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { Logger } from 'pino';

/**
 * Cleans markdown content by removing images and truncating to a reasonable length.
 * This prevents sending massive amounts of image data to OpenAI API.
 *
 * @param content - Raw markdown content
 * @param maxLength - Maximum content length (default: 100,000 characters)
 * @returns Cleaned content without images
 */
function cleanContentForAI(content: string, maxLength: number = 100000): string {
	// Remove base64-encoded images: ![alt](data:image/...)
	let cleaned = content.replace(/!\[([^\]]*)\]\(data:image\/[^)]+\)/g, '');

	// Remove markdown image references: ![alt](url)
	cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

	// Remove HTML img tags
	cleaned = cleaned.replace(/<img[^>]*>/gi, '');

	// Remove HTML picture tags
	cleaned = cleaned.replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '');

	// Trim whitespace
	cleaned = cleaned.trim();

	// Truncate if still too long
	if (cleaned.length > maxLength) {
		cleaned = cleaned.substring(0, maxLength) + '...';
	}

	return cleaned;
}

/**
 * Generates a vector embedding for the given text using OpenAI's text-embedding-3-small model.
 * The embedding is a 1536-dimensional vector representing the semantic meaning of the text.
 *
 * @param text - The text to generate an embedding for
 * @param log - Optional logger instance
 * @returns A promise that resolves to an array of numbers representing the embedding
 */
export async function generateEmbedding(text: string, log?: Logger): Promise<number[]> {
	log?.info({ textLength: text.length }, 'Generating embedding');

	try {
		const response = await fetch('https://api.openai.com/v1/embeddings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SECRET_OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'text-embedding-3-small',
				input: text,
				encoding_format: 'float'
			})
		});

		if (!response.ok) {
			const error = await response.text();
			log?.error({ error, status: response.status }, 'OpenAI API error');
			throw new Error(`OpenAI API error: ${response.status} ${error}`);
		}

		const data = await response.json();
		const embedding = data.data[0].embedding as number[];

		log?.info({ embeddingLength: embedding.length }, 'Embedding generated successfully');

		return embedding;
	} catch (error) {
		log?.error({ error }, 'Error generating embedding');
		throw error;
	}
}

/**
 * Generates an AI-optimized summary for a blog post using GPT-4o-mini.
 * The summary is designed specifically for semantic search, extracting key concepts,
 * topics, and themes from the content.
 *
 * @param title - The post title
 * @param content - The post content
 * @param log - Optional logger instance
 * @returns A promise that resolves to an AI-generated summary string
 */
export async function generateAISummary(
	title: string,
	content: string,
	log?: Logger
): Promise<string> {
	log?.info({ title, originalLength: content.length }, 'Generating AI summary for post');

	// Clean content by removing images and truncating
	const cleanedContent = cleanContentForAI(content);
	log?.info({ cleanedLength: cleanedContent.length }, 'Content cleaned for AI processing');

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SECRET_OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content: `You are a content analyzer that creates search-optimized summaries.
Extract key concepts, topics, themes, and important keywords from blog posts.
Focus on what makes this content unique and searchable.
Keep summaries concise (2-3 sentences, max 150 words) but information-dense.
Include technical terms, frameworks, tools, and concepts mentioned.`
					},
					{
						role: 'user',
						content: `Title: ${title}\n\nContent:\n${cleanedContent}\n\nGenerate a search-optimized summary:`
					}
				],
				temperature: 0.3, // Lower temperature for more consistent, factual summaries
				max_tokens: 200
			})
		});

		if (!response.ok) {
			const error = await response.text();
			log?.error({ error, status: response.status }, 'OpenAI API error generating summary');
			throw new Error(`OpenAI API error: ${response.status} ${error}`);
		}

		const data = await response.json();
		const aiSummary = data.choices[0].message.content.trim();

		log?.info({ summaryLength: aiSummary.length }, 'AI summary generated successfully');

		return aiSummary;
	} catch (error) {
		log?.error({ error }, 'Error generating AI summary');
		throw error;
	}
}

/**
 * Generates an embedding for a blog post by combining its title, AI summary, and content.
 * This provides richer context for semantic search.
 *
 * @param title - The post title
 * @param aiSummary - The AI-generated search-optimized summary (preferred)
 * @param content - The post content
 * @param log - Optional logger instance
 * @returns A promise that resolves to an array of numbers representing the embedding
 */
export async function generatePostEmbedding(
	title: string,
	aiSummary: string,
	content: string,
	log?: Logger
): Promise<number[]> {
	// Clean content by removing images and truncating
	const cleanedContent = cleanContentForAI(content);

	// Combine post fields for better semantic representation
	// Use AI summary for better keyword extraction and concept matching
	const text = `${title}\n\n${aiSummary}\n\n${cleanedContent}`;

	return generateEmbedding(text, log);
}
