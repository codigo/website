import type { Post } from '$lib/types';

/**
 * Calculates the cosine similarity between two vectors.
 * Cosine similarity measures the cosine of the angle between two vectors,
 * resulting in a value between -1 and 1, where:
 * - 1 means identical vectors (perfect match)
 * - 0 means orthogonal vectors (no similarity)
 * - -1 means opposite vectors
 *
 * @param vecA - First vector (embedding)
 * @param vecB - Second vector (embedding)
 * @returns Cosine similarity score between 0 and 1
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
	if (vecA.length !== vecB.length) {
		throw new Error('Vectors must have the same length');
	}

	// Calculate dot product (A · B)
	let dotProduct = 0;
	for (let i = 0; i < vecA.length; i++) {
		dotProduct += vecA[i] * vecB[i];
	}

	// Calculate magnitudes ||A|| and ||B||
	let magnitudeA = 0;
	let magnitudeB = 0;
	for (let i = 0; i < vecA.length; i++) {
		magnitudeA += vecA[i] * vecA[i];
		magnitudeB += vecB[i] * vecB[i];
	}
	magnitudeA = Math.sqrt(magnitudeA);
	magnitudeB = Math.sqrt(magnitudeB);

	// Avoid division by zero
	if (magnitudeA === 0 || magnitudeB === 0) {
		return 0;
	}

	// Calculate cosine similarity
	return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Search result with similarity score
 */
export interface SearchResult {
	post: Post;
	score: number;
}

/**
 * Performs semantic search on posts using vector embeddings with keyword boosting.
 * Calculates cosine similarity between the query embedding and each post's embedding,
 * then boosts scores when query terms match title or tags for better precision.
 *
 * @param queryEmbedding - The embedding vector for the search query
 * @param posts - Array of posts to search through (must have embeddings)
 * @param query - The original search query string (for keyword boosting)
 * @param limit - Maximum number of results to return (default: 10)
 * @param minScore - Minimum similarity score to include (default: 0.5)
 * @returns Array of search results sorted by relevance (highest score first)
 */
export function searchPosts(
	queryEmbedding: number[],
	posts: Post[],
	query: string = '',
	limit: number = 10,
	minScore: number = 0.5
): SearchResult[] {
	// Normalize query for keyword matching
	const queryLower = query.toLowerCase().trim();
	const queryWords = queryLower.split(/\s+/).filter(Boolean);

	// Calculate similarity scores for all posts with embeddings
	const results: SearchResult[] = posts
		.filter((post) => post.embedding && post.embedding.length > 0)
		.map((post) => {
			// Calculate base semantic similarity (clamp negatives to 0 so multiplicative boosts work correctly)
			let score = Math.max(0, cosineSimilarity(queryEmbedding, post.embedding!));

			// Apply keyword boosting for better precision
			const titleLower = post.title.toLowerCase();
			const tagsLower = post.tags?.toLowerCase() || '';

			// Check if any query word appears in title or tags
			const titleMatch = queryWords.some((word) => titleLower.includes(word));
			const tagMatch = queryWords.some((word) => tagsLower.includes(word));

			// Boost scores for keyword matches
			if (titleMatch) {
				score *= 1.5; // 50% boost for title match
			}
			if (tagMatch) {
				score *= 1.3; // 30% boost for tag match
			}

			return {
				post,
				score: Math.min(score, 1.0) // Cap at 1.0 to maintain score normalization
			};
		})
		.filter((result) => result.score >= minScore)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);

	return results;
}
