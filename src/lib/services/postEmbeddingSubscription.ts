import pb, { PocketBaseSingleton } from '$lib/services/pb';
import { logger } from '$lib/stores/loggerStore';
import { generateAISummary, generatePostEmbedding } from '$lib/services/embeddings';
import { addToIndex } from '$lib/services/vectorIndex';
import type { Post } from '$lib/types';

let subscribed = false;

/**
 * Subscribe to posts collection and automatically generate embeddings for new/updated posts.
 * Retries with exponential backoff if PocketBase is unavailable at startup.
 */
export async function subscribeToPostEmbeddings() {
	if (subscribed) {
		return;
	}
	subscribed = true;

	const log = logger.child({ module: 'post-embeddings-subscription' });
	const processing = new Set<string>();

	const MAX_RETRIES = 5;
	const BASE_DELAY_MS = 3000;

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			log.info({ attempt }, 'Subscribing to posts collection for automatic embedding generation');

			await pb.collection('posts').subscribe<Post>('*', async (e) => {
				const { action, record } = e;

				if (action !== 'create' && action !== 'update') {
					return;
				}

				if (!record.publish) {
					log.info({ postId: record.id, action }, 'Skipping unpublished post');
					return;
				}

				if (processing.has(record.id)) {
					return;
				}

				// On updates, skip posts that already have embeddings to prevent infinite loops.
				// Our own write sets both fields, so the self-triggered event will be caught here.
				// To regenerate embeddings after content edits, use the generate-embeddings API.
				if (action === 'update' && record.embedding && record.ai_summary) {
					return;
				}

				log.info(
					{ postId: record.id, title: record.title, action },
					'Post changed, generating embeddings'
				);

				const postLog = log.child({ postId: record.id, title: record.title });

				processing.add(record.id);
				try {
					postLog.info('Authenticating with PocketBase');
					await PocketBaseSingleton.ensureAdminAuth();

					postLog.info('Generating AI summary');
					const aiSummary = await generateAISummary(
						record.title,
						record.content,
						postLog.child({ step: 'ai-summary' })
					);

					postLog.info('Generating embedding');
					const embedding = await generatePostEmbedding(
						record.title,
						aiSummary,
						record.content,
						postLog.child({ step: 'embedding' })
					);

					postLog.info('Saving to PocketBase');
					await pb.collection('posts').update(record.id, {
						ai_summary: aiSummary,
						embedding: embedding
					});

					// Update the in-memory HNSW index
					addToIndex(record.id, embedding, {
						id: record.id,
						slug: record.slug,
						title: record.title,
						summary: record.summary,
						tags: record.tags,
						created: record.created,
						photo_metadata: record.photo_metadata
					});

					postLog.info('Embeddings generated and saved successfully');
				} catch (error) {
					postLog.error({ error }, 'Failed to generate embeddings for post');
				} finally {
					processing.delete(record.id);
				}
			});

			log.info('Posts collection subscription active');
			return; // Success — exit retry loop
		} catch (error) {
			const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
			log.warn(
				{ error, attempt, maxRetries: MAX_RETRIES, retryInMs: delay },
				'Failed to subscribe to posts collection, retrying'
			);

			if (attempt === MAX_RETRIES) {
				log.error(
					'Exhausted all retries for posts subscription — automatic embedding generation disabled'
				);
				subscribed = false; // Allow manual retry later
				return;
			}

			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
}
