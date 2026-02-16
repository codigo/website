import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock PocketBase before imports
vi.mock('$lib/services/pb', () => {
	return {
		default: {
			collection: () => ({
				getFullList: vi.fn().mockResolvedValue([])
			})
		}
	};
});

vi.mock('$lib/stores/loggerStore', () => ({
	logger: {
		child: () => ({
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			debug: vi.fn()
		})
	}
}));

import { cosineSimilarity, searchPosts } from './vectorSearch';
import { initializeIndex, addToIndex } from '$lib/services/vectorIndex';
import type { PostMetadata } from '$lib/services/vectorIndex';

const DIMENSIONS = 1536;

function createEmbedding(seed: number): number[] {
	const embedding = [];
	for (let i = 0; i < DIMENSIONS; i++) {
		embedding.push(Math.sin(seed + i) * 0.5);
	}
	return embedding;
}

function createMetadata(id: string, title: string, tags: string = ''): PostMetadata {
	return {
		id,
		slug: id,
		title,
		summary: `Summary for ${title}`,
		tags,
		created: '2024-01-01',
		photo_metadata: {
			blur_hash: '',
			blur_hash_style: '',
			urls: { raw: '', full: '', regular: '', small: '', thumb: '', small_s3: '' },
			color: '',
			id: '',
			description: '',
			alt_description: ''
		}
	};
}

describe('cosineSimilarity', () => {
	it('returns 1 for identical vectors', () => {
		const vec = [1, 2, 3, 4, 5];
		expect(cosineSimilarity(vec, vec)).toBeCloseTo(1.0);
	});

	it('returns 0 for orthogonal vectors', () => {
		const vecA = [1, 0, 0];
		const vecB = [0, 1, 0];
		expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0.0);
	});

	it('returns -1 for opposite vectors', () => {
		const vecA = [1, 2, 3];
		const vecB = [-1, -2, -3];
		expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(-1.0);
	});

	it('calculates correct similarity for similar vectors', () => {
		const vecA = [1, 2, 3];
		const vecB = [1, 2, 4]; // slightly different
		const similarity = cosineSimilarity(vecA, vecB);
		expect(similarity).toBeGreaterThan(0.9);
		expect(similarity).toBeLessThan(1.0);
	});

	it('throws error for vectors of different lengths', () => {
		const vecA = [1, 2, 3];
		const vecB = [1, 2];
		expect(() => cosineSimilarity(vecA, vecB)).toThrow('Vectors must have the same length');
	});

	it('returns 0 when either vector is zero', () => {
		const zeroVec = [0, 0, 0];
		const normalVec = [1, 2, 3];
		expect(cosineSimilarity(zeroVec, normalVec)).toBe(0);
		expect(cosineSimilarity(normalVec, zeroVec)).toBe(0);
	});

	it('handles normalized vectors correctly', () => {
		// Unit vectors
		const vecA = [1 / Math.sqrt(2), 1 / Math.sqrt(2), 0];
		const vecB = [1, 0, 0];
		// Angle is 45 degrees, cos(45°) ≈ 0.707
		expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1 / Math.sqrt(2));
	});
});

describe('searchPosts (HNSW-backed)', () => {
	beforeEach(async () => {
		// Initialize with empty PB data, then add posts manually
		await initializeIndex();
	});

	it('returns empty array when index is not ready (no posts)', async () => {
		const queryEmbedding = createEmbedding(1);
		const results = await searchPosts(queryEmbedding, '', 10, 0);
		expect(results).toHaveLength(0);
	});

	it('returns posts sorted by similarity score (highest first)', async () => {
		const queryEmbedding = createEmbedding(1);

		addToIndex('high', createEmbedding(1.01), createMetadata('high', 'High Match'));
		addToIndex('mid', createEmbedding(10), createMetadata('mid', 'Mid Match'));
		addToIndex('low', createEmbedding(100), createMetadata('low', 'Low Match'));

		const results = await searchPosts(queryEmbedding, '', 10, 0);

		expect(results.length).toBeGreaterThan(0);
		expect(results[0].post.id).toBe('high');
		// Verify descending order
		for (let i = 1; i < results.length; i++) {
			expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
		}
	});

	it('filters results below minScore threshold', async () => {
		const queryEmbedding = createEmbedding(1);

		addToIndex('similar', createEmbedding(1.001), createMetadata('similar', 'Similar'));
		addToIndex('different', createEmbedding(1000), createMetadata('different', 'Different'));

		const results = await searchPosts(queryEmbedding, '', 10, 0.9);

		expect(results.every((r) => r.score >= 0.9)).toBe(true);
	});

	it('limits results to specified limit', async () => {
		const queryEmbedding = createEmbedding(1);
		for (let i = 0; i < 20; i++) {
			addToIndex(
				`post-${i}`,
				createEmbedding(1 + i * 0.01),
				createMetadata(`post-${i}`, `Post ${i}`)
			);
		}

		const results = await searchPosts(queryEmbedding, '', 5, 0);

		expect(results.length).toBeLessThanOrEqual(5);
	});

	it('boosts score for title keyword matches', async () => {
		const queryEmbedding = createEmbedding(1);
		// Use close embedding so base similarity is non-zero
		const embedding = createEmbedding(1.5);

		addToIndex('with', embedding, createMetadata('with', 'TypeScript Guide'));
		addToIndex('without', embedding, createMetadata('without', 'Programming Guide'));

		const results = await searchPosts(queryEmbedding, 'typescript', 10, 0);

		const withKeywordResult = results.find((r) => r.post.id === 'with');
		const withoutKeywordResult = results.find((r) => r.post.id === 'without');

		if (withKeywordResult && withoutKeywordResult) {
			expect(withKeywordResult.score).toBeGreaterThan(withoutKeywordResult.score);
		}
	});

	it('boosts score for tag keyword matches', async () => {
		const queryEmbedding = createEmbedding(1);
		// Use close embedding so base similarity is non-zero
		const embedding = createEmbedding(1.5);

		addToIndex('with', embedding, createMetadata('with', 'Guide', 'react, javascript'));
		addToIndex('without', embedding, createMetadata('without', 'Guide', 'python, django'));

		const results = await searchPosts(queryEmbedding, 'react', 10, 0);

		const withTagResult = results.find((r) => r.post.id === 'with');
		const withoutTagResult = results.find((r) => r.post.id === 'without');

		if (withTagResult && withoutTagResult) {
			expect(withTagResult.score).toBeGreaterThan(withoutTagResult.score);
		}
	});

	it('applies both title and tag boosts cumulatively', async () => {
		const queryEmbedding = createEmbedding(1);
		const embedding = createEmbedding(2);

		addToIndex('both', embedding, createMetadata('both', 'React Tutorial', 'react, hooks'));
		addToIndex('title', embedding, createMetadata('title', 'React Guide', 'python'));
		addToIndex('tag', embedding, createMetadata('tag', 'Guide', 'react'));
		addToIndex('none', embedding, createMetadata('none', 'Guide', 'python'));

		const results = await searchPosts(queryEmbedding, 'react', 10, 0);

		const scores: Record<string, number> = {};
		results.forEach((r) => {
			scores[r.post.id] = r.score;
		});

		expect(scores['both']).toBeGreaterThan(scores['title']);
		expect(scores['both']).toBeGreaterThan(scores['tag']);
		expect(scores['title']).toBeGreaterThan(scores['none']);
		expect(scores['tag']).toBeGreaterThan(scores['none']);
	});

	it('caps boosted scores at 1.0', async () => {
		const queryEmbedding = createEmbedding(1);
		// Create a post with nearly identical embedding
		addToIndex(
			'near-identical',
			createEmbedding(1.0001),
			createMetadata('near-identical', 'TypeScript React', 'typescript, react')
		);

		const results = await searchPosts(queryEmbedding, 'typescript react', 10, 0);

		expect(results[0].score).toBeLessThanOrEqual(1.0);
	});

	it('handles empty query string without applying keyword boosts', async () => {
		const queryEmbedding = createEmbedding(1);
		addToIndex(
			'test',
			createEmbedding(1.01),
			createMetadata('test', 'Test Post', 'react, typescript')
		);

		const resultsEmpty = await searchPosts(queryEmbedding, '', 10, 0);
		const resultsWhitespace = await searchPosts(queryEmbedding, '   ', 10, 0);
		const resultsBoosted = await searchPosts(queryEmbedding, 'test', 10, 0);

		expect(resultsEmpty.length).toBeGreaterThan(0);
		expect(resultsWhitespace.length).toBeGreaterThan(0);
		// Empty/whitespace queries should NOT get keyword boosts
		expect(resultsEmpty[0].score).toBe(resultsWhitespace[0].score);
		// A matching query should score higher due to title boost
		expect(resultsBoosted[0].score).toBeGreaterThan(resultsEmpty[0].score);
	});

	it('handles case-insensitive keyword matching', async () => {
		const queryEmbedding = createEmbedding(1);
		addToIndex(
			'test',
			createEmbedding(1.001),
			createMetadata('test', 'TypeScript GUIDE', 'REACT, JavaScript')
		);

		const results1 = await searchPosts(queryEmbedding, 'typescript', 10, 0);
		const results2 = await searchPosts(queryEmbedding, 'TYPESCRIPT', 10, 0);
		const results3 = await searchPosts(queryEmbedding, 'react', 10, 0);

		// All should find the post and apply the same boost
		expect(results1[0].score).toBe(results2[0].score);
		expect(results3.length).toBeGreaterThan(0);
	});
});
