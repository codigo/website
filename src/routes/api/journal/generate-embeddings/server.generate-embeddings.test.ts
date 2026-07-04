import { describe, it, expect, vi, beforeEach } from 'vitest';

const TEST_API_KEY = 'test-api-key';
const MOCK_EMBEDDING = Array(1536).fill(0.1);

const mocks = vi.hoisted(() => ({
	getOne: vi.fn(),
	update: vi.fn(),
	getFullList: vi.fn(),
	ensureAdminAuth: vi.fn(),
	generateAISummary: vi.fn(),
	generatePostEmbedding: vi.fn(),
	addToIndex: vi.fn(),
	rebuildIndex: vi.fn()
}));

vi.mock('$env/static/private', () => ({ SECRET_OPENAI_API_KEY: 'test-api-key' }));

vi.mock('$lib/stores/loggerStore', () => {
	const child = () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child });
	return { logger: { child } };
});

vi.mock('$lib/services/pb', () => ({
	default: {
		collection: () => ({
			getOne: mocks.getOne,
			update: mocks.update,
			getFullList: mocks.getFullList
		})
	},
	PocketBaseSingleton: { ensureAdminAuth: mocks.ensureAdminAuth }
}));

vi.mock('$lib/services/embeddings', () => ({
	generateAISummary: mocks.generateAISummary,
	generatePostEmbedding: mocks.generatePostEmbedding
}));

vi.mock('$lib/services/vectorIndex', () => ({
	addToIndex: mocks.addToIndex,
	rebuildIndex: mocks.rebuildIndex
}));

import { POST } from './+server';

function makeRequest(body: object) {
	return new Request('http://localhost/api/journal/generate-embeddings', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TEST_API_KEY}` },
		body: JSON.stringify(body)
	});
}

type MockLogger = {
	info: ReturnType<typeof vi.fn>;
	warn: ReturnType<typeof vi.fn>;
	error: ReturnType<typeof vi.fn>;
	debug: ReturnType<typeof vi.fn>;
	child: () => MockLogger;
};
const makeLogger = (): MockLogger => ({
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	debug: vi.fn(),
	child: () => makeLogger()
});
const mockLocals = { logger: makeLogger() } as unknown as App.Locals;

function makePost(overrides: Partial<Record<string, unknown>> = {}) {
	return {
		id: 'post-1',
		slug: 'test-post',
		title: 'Test Post',
		summary: 'A test post',
		content: 'Post content',
		tags: 'test, vitest',
		created: '2024-01-01',
		publish: true,
		photo_metadata: {},
		ai_summary: undefined,
		embedding: undefined,
		...overrides
	};
}

beforeEach(() => {
	mocks.getOne.mockReset();
	mocks.update.mockReset();
	mocks.getFullList.mockReset();
	mocks.ensureAdminAuth.mockReset();
	mocks.generateAISummary.mockReset();
	mocks.generatePostEmbedding.mockReset();
	mocks.addToIndex.mockReset();
	mocks.rebuildIndex.mockReset();

	mocks.update.mockResolvedValue({});
	mocks.ensureAdminAuth.mockResolvedValue(undefined);
	mocks.generateAISummary.mockResolvedValue('AI generated summary');
	mocks.generatePostEmbedding.mockResolvedValue(MOCK_EMBEDDING);
	mocks.rebuildIndex.mockResolvedValue(undefined);
});

describe('POST /api/journal/generate-embeddings', () => {
	describe('single post mode', () => {
		it('calls addToIndex after saving to PocketBase for a published post', async () => {
			mocks.getOne.mockResolvedValue(makePost());

			const response = await POST({
				request: makeRequest({ postId: 'post-1' }),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(1);
			expect(mocks.addToIndex).toHaveBeenCalledOnce();
			expect(mocks.addToIndex).toHaveBeenCalledWith('post-1', MOCK_EMBEDDING, {
				id: 'post-1',
				slug: 'test-post',
				title: 'Test Post',
				summary: 'A test post',
				tags: 'test, vitest',
				created: '2024-01-01',
				photo_metadata: {}
			});
		});

		it('does not call addToIndex for an unpublished post', async () => {
			mocks.getOne.mockResolvedValue(makePost({ publish: false }));

			const response = await POST({
				request: makeRequest({ postId: 'post-1' }),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(1);
			expect(mocks.addToIndex).not.toHaveBeenCalled();
		});

		it('syncs a published post to the index when it already has embeddings', async () => {
			mocks.getOne.mockResolvedValue(
				makePost({ ai_summary: 'existing', embedding: MOCK_EMBEDDING })
			);

			const response = await POST({
				request: makeRequest({ postId: 'post-1' }),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(0);
			expect(body.message).toBe('Post already has embeddings and was synced to the search index');
			expect(mocks.addToIndex).toHaveBeenCalledOnce();
			expect(mocks.addToIndex).toHaveBeenCalledWith('post-1', MOCK_EMBEDDING, {
				id: 'post-1',
				slug: 'test-post',
				title: 'Test Post',
				summary: 'A test post',
				tags: 'test, vitest',
				created: '2024-01-01',
				photo_metadata: {}
			});
		});

		it('does not sync an unpublished post that already has embeddings', async () => {
			mocks.getOne.mockResolvedValue(
				makePost({ publish: false, ai_summary: 'existing', embedding: MOCK_EMBEDDING })
			);

			const response = await POST({
				request: makeRequest({ postId: 'post-1' }),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(0);
			expect(mocks.addToIndex).not.toHaveBeenCalled();
		});

		it('calls addToIndex when regenerate=true even if post already has embeddings', async () => {
			mocks.getOne.mockResolvedValue(
				makePost({ ai_summary: 'existing', embedding: MOCK_EMBEDDING })
			);

			const response = await POST({
				request: makeRequest({ postId: 'post-1', regenerate: true }),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(1);
			expect(mocks.addToIndex).toHaveBeenCalledOnce();
		});
	});

	describe('batch mode', () => {
		it('calls addToIndex for each published post processed', async () => {
			mocks.getFullList.mockResolvedValue([
				makePost({ id: 'post-1', slug: 'post-1' }),
				makePost({ id: 'post-2', slug: 'post-2' })
			]);

			const response = await POST({
				request: makeRequest({}),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(2);
			expect(mocks.addToIndex).toHaveBeenCalledTimes(2);
		});

		it('does not call addToIndex for unpublished posts in batch', async () => {
			mocks.getFullList.mockResolvedValue([
				makePost({ id: 'post-1', slug: 'post-1' }),
				makePost({ id: 'post-2', slug: 'post-2', publish: false })
			]);

			const response = await POST({
				request: makeRequest({}),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(2);
			expect(mocks.addToIndex).toHaveBeenCalledTimes(1);
			expect(mocks.addToIndex).toHaveBeenCalledWith(
				'post-1',
				MOCK_EMBEDDING,
				expect.objectContaining({ id: 'post-1' })
			);
		});

		it('rebuilds the index when no posts need embedding generation', async () => {
			mocks.getFullList.mockResolvedValue([
				makePost({ id: 'post-1', ai_summary: 'existing', embedding: MOCK_EMBEDDING })
			]);

			const response = await POST({
				request: makeRequest({}),
				locals: mockLocals
			} as Parameters<typeof POST>[0]);

			const body = await response.json();
			expect(body.processed).toBe(0);
			expect(body.message).toBe('No posts need embedding generation; search index rebuilt');
			expect(mocks.rebuildIndex).toHaveBeenCalledOnce();
			expect(mocks.addToIndex).not.toHaveBeenCalled();
		});
	});

	it('returns 401 for missing authorization', async () => {
		const request = new Request('http://localhost/api/journal/generate-embeddings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ postId: 'post-1' })
		});

		await expect(
			POST({ request, locals: mockLocals } as Parameters<typeof POST>[0])
		).rejects.toMatchObject({ status: 401 });
	});
});
