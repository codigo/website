import pb, { PocketBaseSingleton } from '$lib/services/pb';
import { logger } from '$lib/stores/loggerStore';
import { generateAISummary, generatePostEmbedding } from '$lib/services/embeddings';
import type { Post } from '$lib/types';

/**
 * Subscribe to posts collection and automatically generate embeddings for new/updated posts
 */
export function subscribeToPostEmbeddings() {
	const log = logger.child({ module: 'post-embeddings-subscription' });

	log.info('Starting posts collection subscription for automatic embedding generation');

	// Subscribe to any record change in the posts collection
	pb.collection('posts').subscribe<Post>('*', async (e) => {
		const { action, record } = e;

		// Only process create and update actions
		if (action !== 'create' && action !== 'update') {
			return;
		}

		// Only process published posts
		if (!record.publish) {
			log.info({ postId: record.id, action }, 'Skipping unpublished post');
			return;
		}

		// Check if post already has embeddings
		if (record.embedding && record.ai_summary && action === 'update') {
			log.info({ postId: record.id, title: record.title }, 'Post already has embeddings, skipping');
			return;
		}

		log.info(
			{ postId: record.id, title: record.title, action },
			'Post changed, generating embeddings'
		);

		const postLog = log.child({ postId: record.id, title: record.title });

		try {
			// Authenticate first
			postLog.info('Authenticating with PocketBase');
			await PocketBaseSingleton.ensureAdminAuth();

			// Generate AI summary
			postLog.info('Generating AI summary');
			const aiSummary = await generateAISummary(
				record.title,
				record.content,
				postLog.child({ step: 'ai-summary' })
			);

			// Generate embedding
			postLog.info('Generating embedding');
			const embedding = await generatePostEmbedding(
				record.title,
				aiSummary,
				record.content,
				postLog.child({ step: 'embedding' })
			);

			// Update post in PocketBase
			postLog.info('Saving to PocketBase');
			await pb.collection('posts').update(record.id, {
				ai_summary: aiSummary,
				embedding: embedding
			});

			postLog.info('Embeddings generated and saved successfully');

			// Clear auth after successful operation
			PocketBaseSingleton.clearAuth();
		} catch (error) {
			postLog.error({ error }, 'Failed to generate embeddings for post');
			// Clear auth on error too
			PocketBaseSingleton.clearAuth();
		}
	});

	log.info('Posts collection subscription active');
}

/**
 * Unsubscribe from posts collection
 */
export function unsubscribeFromPostEmbeddings() {
	const log = logger.child({ module: 'post-embeddings-subscription' });
	pb.collection('posts').unsubscribe('*');
	log.info('Posts collection subscription stopped');
}
