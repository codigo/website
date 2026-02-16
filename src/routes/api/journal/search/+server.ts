import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateEmbedding } from '$lib/services/embeddings';
import { searchPosts } from '$lib/utils/vectorSearch';
import { isIndexReady } from '$lib/services/vectorIndex';

export const POST: RequestHandler = async ({ request, locals }) => {
	const log = locals.logger.child({ module: 'search-api' });

	try {
		const { query, limit = 10, minScore = 0.5 } = await request.json();

		if (!query || typeof query !== 'string') {
			log.warn({ query }, 'Invalid search query');
			throw error(400, { message: 'Query is required and must be a string' });
		}

		if (query.trim().length === 0) {
			log.warn('Empty search query');
			throw error(400, { message: 'Query cannot be empty' });
		}

		if (!isIndexReady()) {
			log.warn('Search index not yet initialized');
			return json({
				results: [],
				query,
				total: 0
			});
		}

		log.info({ query, limit, minScore }, 'Processing search request');

		// Generate embedding for the search query
		const queryEmbedding = await generateEmbedding(
			query,
			log.child({ step: 'generate-embedding' })
		);

		// Perform semantic search using HNSW index with keyword boosting
		const results = await searchPosts(queryEmbedding, query, limit, minScore);

		log.info({ resultsCount: results.length, query }, 'Search completed successfully');

		return json({
			results: results.map((result) => ({
				id: result.post.id,
				slug: result.post.slug,
				title: result.post.title,
				summary: result.post.summary,
				created: result.post.created,
				tags: result.post.tags,
				photo_metadata: result.post.photo_metadata,
				score: result.score
			})),
			query,
			total: results.length
		});
	} catch (e) {
		// Re-throw validation errors (400)
		if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 400) {
			throw e;
		}

		// Log technical errors server-side
		log.error({ error: e }, 'Error processing search request');

		// Return empty results to user (don't expose technical errors)
		return json({
			results: [],
			query: '',
			total: 0
		});
	}
};
