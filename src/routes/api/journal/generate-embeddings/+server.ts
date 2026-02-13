import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateAISummary, generatePostEmbedding } from '$lib/services/embeddings';
import pb, { PocketBaseSingleton } from '$lib/services/pb';
import type { Post } from '$lib/types';
import { SECRET_OPENAI_API_KEY } from '$env/static/private';

/**
 * POST endpoint to generate AI summaries and embeddings for posts.
 * Can process all posts (batch mode) or a single post (by postId).
 *
 * Example usage:
 * // Batch mode - process all posts
 * POST /api/journal/generate-embeddings
 * Body: { "regenerate": false, "limit": 10 }
 *
 * // Single post mode
 * POST /api/journal/generate-embeddings
 * Body: { "postId": "abc123xyz" }
 *
 * Parameters:
 * - postId: Process only this specific post (optional)
 * - regenerate: If true, regenerate embeddings even for posts that already have them (default: false)
 * - limit: Maximum number of posts to process in one batch (default: all posts)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const log = locals.logger.child({ module: 'generate-embeddings' });

	// Verify authorization - require Bearer token to prevent anonymous access
	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== `Bearer ${SECRET_OPENAI_API_KEY}`) {
		log.warn('Unauthorized embedding generation attempt');
		throw error(401, { message: 'Unauthorized' });
	}

	try {
		// Ensure admin authentication before proceeding
		await PocketBaseSingleton.ensureAdminAuth();

		const { regenerate = false, limit, postId } = await request.json();

		log.info({ regenerate, limit, postId }, 'Starting embedding generation');

		let postsToProcess: Post[];
		let totalPosts: number;

		// Single post mode
		if (postId) {
			log.info({ postId }, 'Processing single post');
			const post = await pb.collection('posts').getOne<Post>(postId);

			// Check if we should process this post
			if (!regenerate && post.embedding && post.ai_summary) {
				return json({
					success: true,
					message: 'Post already has embeddings',
					processed: 0,
					total: 1
				});
			}

			postsToProcess = [post];
			totalPosts = 1;
		} else {
			// Batch mode - fetch all published posts
			const posts = await pb.collection('posts').getFullList<Post>({
				filter: 'publish=true',
				sort: '-created'
			});

			log.info({ totalPosts: posts.length }, 'Fetched posts from PocketBase');

			// Filter posts that need processing
			postsToProcess = posts;
			if (!regenerate) {
				postsToProcess = posts.filter((post) => !post.embedding || !post.ai_summary);
			}

			// Apply limit if specified
			if (limit && limit > 0) {
				postsToProcess = postsToProcess.slice(0, limit);
			}

			totalPosts = posts.length;
		}

		log.info({ postsToProcess: postsToProcess.length }, 'Posts to process');

		if (postsToProcess.length === 0) {
			return json({
				success: true,
				message: 'No posts need embedding generation',
				processed: 0,
				total: totalPosts
			});
		}

		const results = {
			success: 0,
			failed: 0,
			errors: [] as { postId: string; title: string; error: string }[]
		};

		// Process each post
		for (const post of postsToProcess) {
			const postLog = log.child({ postId: post.id, title: post.title });

			try {
				postLog.info('Processing post');

				// Generate AI summary if missing
				let aiSummary = post.ai_summary;
				if (!aiSummary || regenerate) {
					postLog.info('Generating AI summary');
					aiSummary = await generateAISummary(
						post.title,
						post.content,
						postLog.child({ step: 'ai-summary' })
					);
				}

				// Generate embedding
				postLog.info('Generating embedding');
				const embedding = await generatePostEmbedding(
					post.title,
					aiSummary,
					post.content,
					postLog.child({ step: 'embedding' })
				);

				// Update post in PocketBase
				await pb.collection('posts').update(post.id, {
					ai_summary: aiSummary,
					embedding: embedding
				});

				postLog.info('Post updated successfully');
				results.success++;
			} catch (e) {
				const errorMessage = e instanceof Error ? e.message : 'Unknown error';
				postLog.error({ error: e }, 'Error processing post');
				results.failed++;
				results.errors.push({
					postId: post.id,
					title: post.title,
					error: errorMessage
				});
			}
		}

		log.info({ results }, 'Embedding generation completed');

		return json({
			success: true,
			message: `Processed ${results.success} posts successfully, ${results.failed} failed`,
			processed: results.success,
			failed: results.failed,
			total: postsToProcess.length,
			errors: results.errors.length > 0 ? results.errors : undefined
		});
	} catch (e) {
		log.error({ error: e }, 'Error in embedding generation');

		if (e instanceof Error) {
			throw error(500, { message: `Embedding generation error: ${e.message}` });
		}

		throw error(500, { message: 'An internal error occurred during embedding generation' });
	}
};
