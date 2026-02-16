import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock PocketBase before importing vectorIndex
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

import {
	searchIndex,
	addToIndex,
	removeFromIndex,
	getPostMetadata,
	isIndexReady,
	initializeIndex
} from './vectorIndex';
import type { PostMetadata } from './vectorIndex';

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

describe('vectorIndex', () => {
	beforeEach(async () => {
		await initializeIndex();
	});

	describe('isIndexReady', () => {
		it('returns false when index has no posts', () => {
			expect(isIndexReady()).toBe(false);
		});

		it('returns true after adding posts and searching (triggers rebuild)', async () => {
			addToIndex('post-1', createEmbedding(1), createMetadata('post-1', 'Test Post'));
			// Trigger rebuild via search
			await searchIndex(createEmbedding(1), 1);
			expect(isIndexReady()).toBe(true);
		});
	});

	describe('addToIndex and getPostMetadata', () => {
		it('adds a post and retrieves its metadata', () => {
			const metadata = createMetadata('post-1', 'Test Post', 'typescript');
			addToIndex('post-1', createEmbedding(1), metadata);

			const retrieved = getPostMetadata('post-1');
			expect(retrieved).toEqual(metadata);
		});

		it('updates existing post metadata', () => {
			addToIndex('post-1', createEmbedding(1), createMetadata('post-1', 'Original'));
			addToIndex('post-1', createEmbedding(2), createMetadata('post-1', 'Updated'));

			const retrieved = getPostMetadata('post-1');
			expect(retrieved?.title).toBe('Updated');
		});

		it('rejects invalid dimension embeddings', () => {
			addToIndex('post-bad', [1, 2, 3], createMetadata('post-bad', 'Bad'));
			expect(getPostMetadata('post-bad')).toBeUndefined();
		});
	});

	describe('searchIndex', () => {
		it('returns empty array when index has no posts', async () => {
			const results = await searchIndex(createEmbedding(1), 10);
			expect(results).toHaveLength(0);
		});

		it('finds nearest neighbors', async () => {
			addToIndex('similar', createEmbedding(1.01), createMetadata('similar', 'Similar'));
			addToIndex('different', createEmbedding(100), createMetadata('different', 'Different'));

			const results = await searchIndex(createEmbedding(1), 10);

			expect(results.length).toBeGreaterThan(0);
			expect(results[0].id).toBe('similar');
			expect(results[0].score).toBeGreaterThan(results[1].score);
		});

		it('respects the limit parameter', async () => {
			for (let i = 0; i < 20; i++) {
				addToIndex(`post-${i}`, createEmbedding(i), createMetadata(`post-${i}`, `Post ${i}`));
			}

			const results = await searchIndex(createEmbedding(1), 5);
			expect(results).toHaveLength(5);
		});

		it('returns similarity scores between 0 and 1 for cosine space', async () => {
			addToIndex('post-1', createEmbedding(1), createMetadata('post-1', 'Test'));
			addToIndex('post-2', createEmbedding(2), createMetadata('post-2', 'Test 2'));

			const results = await searchIndex(createEmbedding(1), 10);

			for (const result of results) {
				expect(result.score).toBeGreaterThanOrEqual(-1);
				expect(result.score).toBeLessThanOrEqual(1.01); // Allow small float rounding
			}
		});
	});

	describe('removeFromIndex', () => {
		it('removes a post from the index', async () => {
			addToIndex('post-1', createEmbedding(1), createMetadata('post-1', 'Test'));
			expect(getPostMetadata('post-1')).toBeDefined();

			removeFromIndex('post-1');
			expect(getPostMetadata('post-1')).toBeUndefined();
		});

		it('handles removing non-existent post gracefully', () => {
			expect(() => removeFromIndex('non-existent')).not.toThrow();
		});
	});
});
