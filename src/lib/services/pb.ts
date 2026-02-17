import { type Post, type Capability } from '$lib/types';
import { type Logger } from 'pino';
import { logger } from '$lib/stores/loggerStore';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';
import PocketBase, { type ListResult } from 'pocketbase';

class PocketBaseSingleton {
	private static instance: PocketBase;
	private static authPromise: Promise<void> | null = null;

	private constructor() {}

	public static getInstance(): PocketBase {
		if (!PocketBaseSingleton.instance) {
			logger
				.child({ module: 'pb' })
				.info({ url: PUBLIC_POCKETBASE_URL }, 'Creating new PocketBase instance');
			PocketBaseSingleton.instance = new PocketBase(PUBLIC_POCKETBASE_URL);
		}
		return PocketBaseSingleton.instance;
	}

	/**
	 * Authenticate with PocketBase users collection
	 * Required for operations like updating posts (generating embeddings)
	 */
	public static async ensureAdminAuth(): Promise<void> {
		const pb = this.getInstance();
		const log = logger.child({ module: 'pb-auth' });

		// Check if already authenticated and token is valid
		if (pb.authStore.isValid) {
			log.debug('Already authenticated with valid token');
			return;
		}

		// Return existing auth promise if already authenticating
		if (this.authPromise) {
			return this.authPromise;
		}

		this.authPromise = (async () => {
			if (!env.SECRET_POCKETBASE_ADMIN_EMAIL || !env.SECRET_POCKETBASE_ADMIN_PASSWORD) {
				log.error('PocketBase credentials not configured');
				throw new Error(
					'env.SECRET_POCKETBASE_ADMIN_EMAIL and env.SECRET_POCKETBASE_ADMIN_PASSWORD environment variables are required for embedding generation'
				);
			}

			try {
				log.info(
					{ email: env.SECRET_POCKETBASE_ADMIN_EMAIL },
					'Authenticating with PocketBase admins'
				);
				await pb.admins.authWithPassword(
					env.SECRET_POCKETBASE_ADMIN_EMAIL,
					env.SECRET_POCKETBASE_ADMIN_PASSWORD
				);
				log.info('Successfully authenticated as admin');
			} catch (error) {
				log.error({ error }, 'Failed to authenticate');
				this.authPromise = null; // Reset so it can be retried
				throw error;
			} finally {
				this.authPromise = null; // Always reset promise
			}
		})();

		return this.authPromise;
	}
}

const pb = PocketBaseSingleton.getInstance();
pb.autoCancellation(true);

export default pb;
export { PocketBaseSingleton };

export const sendMessage = async (name: string, email: string, message: string, log?: Logger) => {
	log?.info({ name, email, message }, 'Sending message');
	try {
		const result = await pb.collection('messages').create({
			name,
			email,
			message
		});
		log?.info({ result }, 'Message sent');
		return result;
	} catch (error) {
		log?.error({ error }, 'Error sending message');
		throw error;
	}
};

export const getAllPaginatedPosts = (page: number = 1, log?: Logger): Promise<ListResult<Post>> => {
	try {
		const PER_PAGE = 6;
		log?.info({ page, perPage: PER_PAGE }, 'Fetching paginated posts');
		return pb.collection('posts').getList(page, PER_PAGE, {
			sort: '-created',
			filter: 'publish=true',
			requestKey: null
		});
	} catch (error) {
		log?.error({ error, page }, 'Error fetching paginated posts');
		throw error;
	}
};

export const getPostBySlug = async (slug: string, log?: Logger) => {
	log?.info({ slug }, `Fetching post by slug`);
	try {
		const result = await pb
			.collection('posts')
			.getFirstListItem(`slug="${slug}" && publish=True`, { requestKey: null });

		if (!result) {
			log?.warn({ slug }, 'Post not found');
			return null;
		}

		const post = await pb.collection('posts').getOne<Post>(result.id, { requestKey: null });
		log?.info({ slug, postId: post.id }, 'Post fetched successfully');
		return post;
	} catch (error: unknown) {
		// PocketBase getFirstListItem throws when no record matches (status 404)
		if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
			log?.warn({ slug }, 'Post not found');
			return null;
		}
		log?.error({ slug, error }, 'Error fetching post');
		throw error;
	}
};

export const getCapabilities = async (log?: Logger): Promise<ListResult<Capability>> => {
	log?.info({}, 'Fetching capabilities');
	try {
		const result = await pb.collection('capabilities').getList<Capability>(1, 100);
		log?.info({ result }, 'Capabilities fetched successfully');
		return result;
	} catch (error) {
		log?.error({ error }, 'Error fetching capabilities');
		throw error;
	}
};
