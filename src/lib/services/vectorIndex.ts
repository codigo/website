import { HNSW } from 'hnsw';
import pb from '$lib/services/pb';
import type { Post } from '$lib/types';
import { logger } from '$lib/stores/loggerStore';

const DIMENSIONS = 1536;
const M = 16;
const EF_CONSTRUCTION = 200;
const EF_SEARCH = 50;

export interface PostMetadata {
	id: string;
	slug: string;
	title: string;
	summary: string;
	tags: string;
	created: string;
	photo_metadata: Post['photo_metadata'];
}

let index: HNSW | null = null;
const metadataMap = new Map<string, PostMetadata>();
// Store vectors for rebuilding the index when posts are added/updated/removed
const vectorMap = new Map<string, number[]>();
// Map between string post IDs and numeric labels (HNSW requires numeric IDs)
const idToLabel = new Map<string, number>();
const labelToId = new Map<number, string>();
let nextLabel = 0;
let dirty = false;

const log = logger.child({ module: 'vector-index' });

function extractMetadata(post: Post): PostMetadata {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		summary: post.summary,
		tags: post.tags,
		created: post.created,
		photo_metadata: post.photo_metadata
	};
}

function rebuildMappings(): void {
	idToLabel.clear();
	labelToId.clear();
	nextLabel = 0;

	for (const id of vectorMap.keys()) {
		const label = nextLabel++;
		idToLabel.set(id, label);
		labelToId.set(label, id);
	}
}

async function buildFromMaps(): Promise<void> {
	rebuildMappings();

	index = new HNSW(M, EF_CONSTRUCTION, DIMENSIONS, 'cosine', EF_SEARCH);

	if (vectorMap.size === 0) return;

	const data = Array.from(vectorMap.entries()).map(([id, vector]) => ({
		id: idToLabel.get(id)!,
		vector
	}));

	await index.buildIndex(data);
}

/**
 * Initialize the HNSW index by fetching all posts with embeddings from PocketBase.
 * Should be called once at application startup.
 */
export async function initializeIndex(): Promise<void> {
	log.info('Initializing HNSW vector index');

	const posts = await pb.collection('posts').getFullList<Post>({
		filter: 'publish=true',
		sort: '-created',
		requestKey: null
	});

	const postsWithEmbeddings = posts.filter(
		(post) => post.embedding && post.embedding.length === DIMENSIONS
	);

	log.info(
		{ totalPosts: posts.length, withEmbeddings: postsWithEmbeddings.length },
		'Fetched posts for index'
	);

	metadataMap.clear();
	vectorMap.clear();

	for (const post of postsWithEmbeddings) {
		metadataMap.set(post.id, extractMetadata(post));
		vectorMap.set(post.id, post.embedding!);
	}

	await buildFromMaps();
	dirty = false;

	log.info({ indexedPosts: postsWithEmbeddings.length }, 'HNSW index built');
}

/**
 * Ensure the index is up-to-date. Rebuilds if dirty flag is set.
 */
async function ensureIndex(): Promise<void> {
	if (dirty) {
		await buildFromMaps();
		dirty = false;
	}
}

/**
 * Search the HNSW index for the nearest neighbors to the given embedding.
 * Returns results sorted by similarity (highest first).
 * The hnsw package returns cosine similarity directly (1 = identical, 0 = orthogonal).
 */
export async function searchIndex(
	embedding: number[],
	limit: number
): Promise<{ id: string; score: number }[]> {
	if (!index || metadataMap.size === 0) {
		return [];
	}

	await ensureIndex();

	const k = Math.min(limit, metadataMap.size);
	const results = index!.searchKNN(embedding, k);

	return results.map((result) => {
		const postId = labelToId.get(result.id);
		if (!postId) {
			throw new Error(`No post ID found for label ${result.id}`);
		}
		return { id: postId, score: result.score };
	});
}

/**
 * Add a new post's embedding to the HNSW index.
 * If the post already exists, the index will be rebuilt with updated data.
 */
export function addToIndex(postId: string, embedding: number[], metadata: PostMetadata): void {
	if (embedding.length !== DIMENSIONS) {
		log.warn({ postId, dimensions: embedding.length }, 'Invalid embedding dimensions');
		return;
	}

	metadataMap.set(postId, metadata);
	vectorMap.set(postId, embedding);
	dirty = true;

	log.info({ postId }, 'Added post to HNSW index (rebuild pending)');
}

/**
 * Remove a post from the HNSW index.
 */
export function removeFromIndex(postId: string): void {
	if (!metadataMap.has(postId)) return;

	metadataMap.delete(postId);
	vectorMap.delete(postId);
	dirty = true;

	log.info({ postId }, 'Removed post from HNSW index (rebuild pending)');
}

/**
 * Rebuild the entire index from PocketBase. Useful for periodic cleanup.
 */
export async function rebuildIndex(): Promise<void> {
	log.info('Rebuilding HNSW vector index');
	await initializeIndex();
}

/**
 * Get metadata for a post by its ID.
 */
export function getPostMetadata(id: string): PostMetadata | undefined {
	return metadataMap.get(id);
}

/**
 * Check if the index has been initialized and has data.
 */
export function isIndexReady(): boolean {
	return index !== null && metadataMap.size > 0;
}
