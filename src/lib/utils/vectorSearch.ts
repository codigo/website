import { searchIndex, getPostMetadata, isIndexReady } from '$lib/services/vectorIndex';
import type { PostMetadata } from '$lib/services/vectorIndex';

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
	post: PostMetadata;
	score: number;
}

/**
 * Performs semantic search using the HNSW vector index with keyword boosting.
 * Uses approximate nearest neighbor search (O(log n)) instead of linear scan.
 *
 * @param queryEmbedding - The embedding vector for the search query
 * @param query - The original search query string (for keyword boosting)
 * @param limit - Maximum number of results to return (default: 10)
 * @param minScore - Minimum similarity score to include (default: 0.5)
 * @returns Array of search results sorted by relevance (highest score first)
 */
export async function searchPosts(
	queryEmbedding: number[],
	query: string = '',
	limit: number = 10,
	minScore: number = 0.5
): Promise<SearchResult[]> {
	if (!isIndexReady()) {
		return [];
	}

	// Over-fetch to allow for filtering after keyword boosting
	const rawResults = await searchIndex(queryEmbedding, limit * 3);

	// Normalize query for keyword matching
	const queryLower = query.toLowerCase().trim();
	const queryWords = queryLower.split(/\s+/).filter(Boolean);

	const results: SearchResult[] = rawResults
		.map(({ id, score }) => {
			const metadata = getPostMetadata(id);
			if (!metadata) return null;

			// Clamp negatives to 0 so multiplicative boosts work correctly
			let adjustedScore = Math.max(0, score);

			// Apply keyword boosting for better precision
			const titleLower = metadata.title.toLowerCase();
			const tagsLower = metadata.tags?.toLowerCase() || '';

			const titleMatch = queryWords.some((word) => titleLower.includes(word));
			const tagMatch = queryWords.some((word) => tagsLower.includes(word));

			if (titleMatch) {
				adjustedScore *= 1.5;
			}
			if (tagMatch) {
				adjustedScore *= 1.3;
			}

			return {
				post: metadata,
				score: Math.min(adjustedScore, 1.0)
			};
		})
		.filter((result): result is SearchResult => result !== null && result.score >= minScore)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);

	return results;
}
