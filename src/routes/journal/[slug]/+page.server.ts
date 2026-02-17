import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/services/pb';

export async function load({ params, setHeaders, locals }) {
	const log = locals.logger;
	log.info({ slug: params.slug }, 'Fetching post');

	setHeaders({
		'Cache-Control': 'max-age=3600, s-maxage=1'
	});

	const { slug } = params;

	let post;
	try {
		post = await getPostBySlug(slug, log.child({ module: 'getPostBySlug' }));
	} catch (e) {
		log.error({ error: e, slug }, 'Error fetching post');
	}

	if (!post) {
		throw error(404, { message: `Post with slug ${slug} not found` });
	}

	return post;
}
