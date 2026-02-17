export interface SEOMetadata {
	title?: string;
	description?: string;
	keywords?: string;
	ogImage?: string;
	canonicalUrl?: string;
}

// Load function to pass default SEO data to all pages
export const load = ({ url }: { url: URL }) => {
	// Helper to ensure clean URL paths without double slashes
	const cleanPath = url.pathname === '/' ? '' : url.pathname;

	const defaultMetadata: SEOMetadata = {
		title: 'Mauricio Mercado | AI & Software Engineering Consultant',
		description:
			'Mauricio Mercado - Backend & AI Integration Engineer specializing in modern web development, AI solutions, and technical consulting. Based in Canada, offering professional software development services.',
		keywords:
			'Mauricio Mercado, Backend Developer, AI Integration Engineer, Web Development, Software Architecture, Technical Consulting, Canada',
		ogImage: '/favicon.png',
		canonicalUrl: `http://${url.hostname}:${url.port}${cleanPath}`
	};

	return {
		url: url.pathname,
		metadata: defaultMetadata
	};
};
