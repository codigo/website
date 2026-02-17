import type { ServerLoadEvent } from '@sveltejs/kit';
import { getAllPaginatedPosts } from '$lib/services/pb';
import { blurhashToCssGradientString } from '@unpic/placeholder';
import { formatDate } from '$lib/utils';

export async function load({ params, setHeaders, locals }: ServerLoadEvent) {
	const log = locals.logger;

	setHeaders({
		'Cache-Control': 'max-age=3600, s-maxage=1'
	});

	const page = Number(params.page) || 1;

	try {
		const results = await getAllPaginatedPosts(page, log.child({ module: 'getAllPaginatedPosts' }));
		log.info({ results: results.items.length }, 'Posts fetched successfully');
		results.items.map((post) => {
			post.photo_metadata.blur_hash_style = `background-image: ${blurhashToCssGradientString(post.photo_metadata.blur_hash)}`;
			post.created = formatDate(post.created);
		});
		return results;
	} catch (e) {
		log.warn({ error: e, page }, 'Failed to fetch posts, returning empty results');
		return {
			page,
			perPage: 6,
			totalPages: 1,
			totalItems: 0,
			items: []
		};
	}
}
