import { test, expect } from '@playwright/test';

// Test data constants to match layout.ts implementation
const SEO_DATA = {
	title: 'Mauricio Mercado | AI & Software Engineering Consultant',
	description:
		'Mauricio Mercado - Backend & AI Integration Engineer specializing in modern web development, AI solutions, and technical consulting. Based in Canada, offering professional software development services.',
	keywords:
		'Mauricio Mercado, Backend Developer, AI Integration Engineer, Web Development, Software Architecture, Technical Consulting, Canada',
	baseUrl: 'http://localhost:4173/'
};

test.describe('SEO Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('basic meta tags are correct', async ({ page }) => {
		// Test title
		expect(await page.title()).toBe(SEO_DATA.title);

		// Test meta tags
		const metaTags = {
			description: SEO_DATA.description,
			keywords: SEO_DATA.keywords
		};

		for (const [name, content] of Object.entries(metaTags)) {
			const metaContent = await page.$eval(`meta[name="${name}"]`, (el) =>
				el.getAttribute('content')
			);
			expect(metaContent).toBe(content);
		}
	});

	test('Open Graph tags are correct', async ({ page }) => {
		const ogTags = {
			'og:title': SEO_DATA.title,
			'og:description': SEO_DATA.description,
			'og:url': SEO_DATA.baseUrl
		};

		for (const [property, content] of Object.entries(ogTags)) {
			const ogContent = await page.$eval(`meta[property="${property}"]`, (el) =>
				el.getAttribute('content')
			);
			expect(ogContent).toBe(content);
		}
	});

	test('Twitter tags are correct', async ({ page }) => {
		const twitterTags = {
			'twitter:title': SEO_DATA.title,
			'twitter:description': SEO_DATA.description
		};

		for (const [name, content] of Object.entries(twitterTags)) {
			const twitterContent = await page.$eval(`meta[name="${name}"]`, (el) =>
				el.getAttribute('content')
			);
			expect(twitterContent).toBe(content);
		}
	});

	test('favicon and touch icons are present', async ({ page }) => {
		const iconTests = [
			{ selector: 'link[sizes="32x32"]', contains: '/favicon-32x32.png' },
			{ selector: 'link[sizes="16x16"]', contains: '/favicon-16x16.png' },
			{ selector: 'link[rel="apple-touch-icon"]', contains: '/apple-touch-icon.png' }
		];

		for (const { selector, contains } of iconTests) {
			const href = await page.$eval(selector, (el) => el.getAttribute('href'));
			expect(href).toContain(contains);
		}
	});

	test('canonical URL is correct', async ({ page }) => {
		const canonical = await page.$eval('link[rel="canonical"]', (el) => el.getAttribute('href'));
		expect(canonical).toBe(SEO_DATA.baseUrl);
	});
});
