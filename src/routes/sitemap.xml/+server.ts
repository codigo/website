import pb from '$lib/services/pb';
import type { Post } from '$lib/types';
import { logger } from '$lib/stores/loggerStore';

const SITE_URL = 'https://maumercado.com';

const experienceSlugs = [
	'codigo',
	'coursedog',
	'cto-ai',
	'doc-ai',
	'freelance',
	'galvanize',
	'humanapi',
	'mobilelive',
	'navarik',
	'selfie',
	'telus'
];

export async function GET() {
	const log = logger.child({ module: 'sitemap' });

	// Static routes with priorities
	const staticRoutes = [
		{ path: '/', priority: '1.0', changefreq: 'weekly' },
		{ path: '/about-me', priority: '0.8', changefreq: 'monthly' },
		{ path: '/contact', priority: '0.7', changefreq: 'monthly' },
		{ path: '/journal/page/1', priority: '0.8', changefreq: 'weekly' }
	];

	// Experience pages
	const experienceRoutes = experienceSlugs.map((slug) => ({
		path: `/about-me/${slug}`,
		priority: '0.6',
		changefreq: 'yearly' as const
	}));

	// Journal posts from PocketBase
	let journalRoutes: { path: string; priority: string; changefreq: string; lastmod?: string }[] =
		[];
	try {
		const posts = await pb.collection('posts').getFullList<Post>({
			sort: '-created',
			filter: 'publish=true',
			fields: 'slug,updated',
			requestKey: null
		});
		journalRoutes = posts.map((post) => ({
			path: `/journal/${post.slug}`,
			priority: '0.7',
			changefreq: 'monthly',
			lastmod: new Date(post.updated).toISOString().split('T')[0]
		}));
	} catch (error) {
		log.warn({ error }, 'Failed to fetch journal posts for sitemap');
	}

	const allRoutes: { path: string; priority: string; changefreq: string; lastmod?: string }[] = [
		...staticRoutes,
		...experienceRoutes,
		...journalRoutes
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
	.map(
		(route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
