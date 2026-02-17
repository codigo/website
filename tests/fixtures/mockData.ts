export interface MockSearchResult {
	id: string;
	slug: string;
	title: string;
	summary: string;
	created: string;
	tags: string;
	score: number;
}

export function createMockSearchResult(overrides?: Partial<MockSearchResult>): MockSearchResult {
	return {
		id: 'post-1',
		slug: 'test-post',
		title: 'Understanding TypeScript Generics',
		summary: 'A deep dive into TypeScript generics and how to use them effectively',
		created: '2024-06-15T12:00:00Z',
		tags: 'typescript,generics,tutorial',
		score: 0.87,
		...overrides
	};
}

export function createMockSearchResults(count = 3): MockSearchResult[] {
	const titles = [
		'Understanding TypeScript Generics',
		'Building REST APIs with Fastify',
		'SvelteKit Routing Deep Dive',
		'Docker Compose for Development',
		'PocketBase as a Backend'
	];

	return Array.from({ length: count }, (_, i) =>
		createMockSearchResult({
			id: `post-${i + 1}`,
			slug: `test-post-${i + 1}`,
			title: titles[i % titles.length],
			score: 0.95 - i * 0.1,
			tags: `tag${i + 1},testing`
		})
	);
}
