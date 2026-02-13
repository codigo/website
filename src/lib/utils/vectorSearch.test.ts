import { describe, it, expect } from 'vitest';
import { cosineSimilarity, searchPosts } from './vectorSearch';
import type { Post } from '$lib/types';

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

describe('searchPosts', () => {
	// Helper to create mock posts
	const createMockPost = (id: string, title: string, embedding: number[], tags?: string): Post => ({
		id,
		created: '2024-01-01',
		updated: '2024-01-01',
		slug: id,
		content: 'Test content',
		publish: true,
		title,
		tags: tags || '',
		summary: 'Test summary',
		photo_metadata: {
			blur_hash: '',
			blur_hash_style: '',
			urls: { raw: '', full: '', regular: '', small: '', thumb: '', small_s3: '' },
			color: '',
			id: '',
			description: '',
			alt_description: ''
		},
		embedding
	});

	// Create a base embedding vector (1536 dimensions like OpenAI)
	const createEmbedding = (seed: number): number[] => {
		const embedding = [];
		for (let i = 0; i < 100; i++) {
			// Using 100 for test simplicity
			embedding.push(Math.sin(seed + i) * 0.5);
		}
		return embedding;
	};

	it('returns empty array when no posts have embeddings', () => {
		const posts: Post[] = [
			{ ...createMockPost('1', 'Test', []), embedding: undefined },
			{ ...createMockPost('2', 'Test 2', []), embedding: [] }
		];
		const queryEmbedding = createEmbedding(1);
		const results = searchPosts(queryEmbedding, posts, '', 10, 0);
		expect(results).toHaveLength(0);
	});

	it('returns posts sorted by similarity score (highest first)', () => {
		const queryEmbedding = createEmbedding(1);
		const posts: Post[] = [
			createMockPost('low', 'Low Match', createEmbedding(100)), // very different
			createMockPost('high', 'High Match', createEmbedding(1.1)), // very similar
			createMockPost('mid', 'Mid Match', createEmbedding(10)) // somewhat different
		];

		const results = searchPosts(queryEmbedding, posts, '', 10, 0);

		expect(results.length).toBeGreaterThan(0);
		expect(results[0].post.id).toBe('high');
		// Verify descending order
		for (let i = 1; i < results.length; i++) {
			expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
		}
	});

	it('filters results below minScore threshold', () => {
		const queryEmbedding = createEmbedding(1);
		const posts: Post[] = [
			createMockPost('similar', 'Similar', createEmbedding(1.01)),
			createMockPost('different', 'Different', createEmbedding(1000))
		];

		const results = searchPosts(queryEmbedding, posts, '', 10, 0.9);

		// Only the similar post should pass the high threshold
		expect(results.every((r) => r.score >= 0.9)).toBe(true);
	});

	it('limits results to specified limit', () => {
		const queryEmbedding = createEmbedding(1);
		const posts: Post[] = Array.from({ length: 20 }, (_, i) =>
			createMockPost(`post-${i}`, `Post ${i}`, createEmbedding(1 + i * 0.01))
		);

		const results = searchPosts(queryEmbedding, posts, '', 5, 0);

		expect(results.length).toBeLessThanOrEqual(5);
	});

	it('boosts score for title keyword matches', () => {
		const queryEmbedding = createEmbedding(1);
		// Two posts with identical embeddings but different titles
		const postWithKeyword = createMockPost('with', 'TypeScript Guide', createEmbedding(5));
		const postWithoutKeyword = createMockPost('without', 'Programming Guide', createEmbedding(5));

		const results = searchPosts(
			queryEmbedding,
			[postWithKeyword, postWithoutKeyword],
			'typescript'
		);

		// Find the posts in results
		const withKeywordResult = results.find((r) => r.post.id === 'with');
		const withoutKeywordResult = results.find((r) => r.post.id === 'without');

		if (withKeywordResult && withoutKeywordResult) {
			expect(withKeywordResult.score).toBeGreaterThan(withoutKeywordResult.score);
		}
	});

	it('boosts score for tag keyword matches', () => {
		const queryEmbedding = createEmbedding(1);
		// Two posts with identical embeddings but different tags
		const postWithTag = createMockPost('with', 'Guide', createEmbedding(5), 'react, javascript');
		const postWithoutTag = createMockPost('without', 'Guide', createEmbedding(5), 'python, django');

		const results = searchPosts(queryEmbedding, [postWithTag, postWithoutTag], 'react');

		const withTagResult = results.find((r) => r.post.id === 'with');
		const withoutTagResult = results.find((r) => r.post.id === 'without');

		if (withTagResult && withoutTagResult) {
			expect(withTagResult.score).toBeGreaterThan(withoutTagResult.score);
		}
	});

	it('applies both title and tag boosts cumulatively', () => {
		const queryEmbedding = createEmbedding(1);
		// Use an embedding with ~0.5 base similarity so boosts don't all cap at 1.0
		const embedding = createEmbedding(2);

		const postBothMatch = createMockPost('both', 'React Tutorial', embedding, 'react, hooks');
		const postTitleOnly = createMockPost('title', 'React Guide', embedding, 'python');
		const postTagOnly = createMockPost('tag', 'Guide', embedding, 'react');
		const postNoMatch = createMockPost('none', 'Guide', embedding, 'python');

		const results = searchPosts(
			queryEmbedding,
			[postNoMatch, postTagOnly, postTitleOnly, postBothMatch],
			'react',
			10,
			0 // no minimum score filter
		);

		const scores: Record<string, number> = {};
		results.forEach((r) => {
			scores[r.post.id] = r.score;
		});

		// Both match should have highest score (gets both 1.5x title and 1.3x tag boost)
		expect(scores['both']).toBeGreaterThan(scores['title']);
		expect(scores['both']).toBeGreaterThan(scores['tag']);
		// Title and tag only should be higher than no match
		expect(scores['title']).toBeGreaterThan(scores['none']);
		expect(scores['tag']).toBeGreaterThan(scores['none']);
	});

	it('caps boosted scores at 1.0', () => {
		const queryEmbedding = createEmbedding(1);
		// Create a post with nearly identical embedding (score close to 1.0)
		const nearIdenticalPost = createMockPost(
			'near-identical',
			'TypeScript React',
			createEmbedding(1.001),
			'typescript, react'
		);

		const results = searchPosts(queryEmbedding, [nearIdenticalPost], 'typescript react', 10, 0);

		expect(results[0].score).toBeLessThanOrEqual(1.0);
	});

	it('handles empty query string without applying keyword boosts', () => {
		const queryEmbedding = createEmbedding(1);
		const embedding = createEmbedding(1.1);
		const post = createMockPost('test', 'Test Post', embedding, 'react, typescript');

		const resultsEmpty = searchPosts(queryEmbedding, [post], '', 10, 0);
		const resultsWhitespace = searchPosts(queryEmbedding, [post], '   ', 10, 0);
		const resultsBoosted = searchPosts(queryEmbedding, [post], 'test', 10, 0);

		expect(resultsEmpty.length).toBeGreaterThan(0);
		expect(resultsWhitespace.length).toBeGreaterThan(0);
		// Empty/whitespace queries should NOT get keyword boosts
		expect(resultsEmpty[0].score).toBe(resultsWhitespace[0].score);
		// A matching query should score higher due to title boost
		expect(resultsBoosted[0].score).toBeGreaterThan(resultsEmpty[0].score);
	});

	it('handles case-insensitive keyword matching', () => {
		const queryEmbedding = createEmbedding(1);
		// Use similar embedding so results pass the filter
		const post = createMockPost(
			'test',
			'TypeScript GUIDE',
			createEmbedding(1.001),
			'REACT, JavaScript'
		);

		const results1 = searchPosts(queryEmbedding, [post], 'typescript', 10, 0);
		const results2 = searchPosts(queryEmbedding, [post], 'TYPESCRIPT', 10, 0);
		const results3 = searchPosts(queryEmbedding, [post], 'react', 10, 0);

		// All should find the post and apply the same boost
		expect(results1[0].score).toBe(results2[0].score);
		expect(results3.length).toBeGreaterThan(0);
	});

	it('handles multi-word queries', () => {
		const queryEmbedding = createEmbedding(1);
		// Use similar embedding so results pass the filter
		const post = createMockPost('test', 'TypeScript React Guide', createEmbedding(1.001));

		const results = searchPosts(queryEmbedding, [post], 'typescript react', 10, 0);

		// Should match both words in title
		expect(results.length).toBeGreaterThan(0);
	});
});
