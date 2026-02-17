<script lang="ts">
	import { debounce } from 'lodash-es';
	import { resolve } from '$app/paths';

	interface SearchResult {
		id: string;
		slug: string;
		title: string;
		summary: string;
		created: string;
		tags: string;
		score: number;
	}

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let isLoading = $state(false);
	let error = $state('');
	let showResults = $state(false);

	// Debounced search function
	const performSearchImmediate = async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			results = [];
			showResults = false;
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/journal/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: searchQuery, limit: 10, minScore: 0.15 })
			});

			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.message || 'Search failed';
				console.error('[SearchBar] Search API error:', {
					status: response.status,
					message: errorMessage,
					query: searchQuery
				});
				throw new Error(errorMessage);
			}

			const data = await response.json();
			results = data.results || [];
			showResults = true;
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : 'An error occurred during search';
			console.error('[SearchBar] Search error:', {
				error: errorMessage,
				query: searchQuery,
				exception: e
			});
			error = errorMessage;
			results = [];
			showResults = true;
		} finally {
			isLoading = false;
		}
	};

	// Debounce the search with 500ms delay
	const performSearch = debounce(performSearchImmediate, 500);

	// Trigger search when query changes
	$effect(() => {
		// Clear stale results immediately so they don't flash while debounce waits
		if (!query.trim()) {
			results = [];
			showResults = false;
			isLoading = false;
		} else {
			results = [];
			isLoading = true;
		}
		performSearch(query);
	});

	function handleResultClick() {
		showResults = false;
		query = '';
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.search-wrapper')) {
			showResults = false;
			isLoading = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="pico search-wrapper">
	<input
		type="search"
		name="search"
		id="search"
		bind:value={query}
		placeholder="Search posts..."
		aria-label="Search posts"
		aria-busy={isLoading}
		class="pico input"
		autocomplete="off"
	/>

	{#if (showResults || isLoading) && query.trim()}
		<div class="results-dropdown">
			{#if isLoading}
				<div class="result-empty result-loading">
					<div class="loading-spinner"></div>
					<p>Searching...</p>
				</div>
			{:else if error}
				<div class="result-empty result-error">
					<p><strong>Search failed</strong></p>
					<p>{error}</p>
				</div>
			{:else if results.length === 0}
				<div class="result-empty">
					<p><strong>No results found</strong></p>
					<p>Try different keywords</p>
				</div>
			{:else}
				<ul class="results-list">
					{#each results as result (result.id)}
						<li>
							<a
								href={resolve('/journal/[slug]', { slug: result.slug })}
								onclick={handleResultClick}
							>
								<div class="result-content">
									<div class="result-main">
										<h3>{result.title}</h3>
										<p>{result.summary}</p>
										{#if result.tags}
											<div class="result-tags">
												{#each result.tags.split(',').slice(0, 3) as tag (tag)}
													<span class="tag">#{tag.trim()}</span>
												{/each}
											</div>
										{/if}
									</div>
									<div class="result-meta">
										<span class="score">
											{Math.round(result.score * 100)}%
										</span>
										<small>{new Date(result.created).toLocaleDateString()}</small>
									</div>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style>
	.search-wrapper {
		position: relative;
		margin: 0 auto;
		max-width: 60rem;
	}

	/* Fix search icon size - override Pico's 10px default */
	input[type='search'] {
		background-size: 2rem !important;
		background-position: left 1.2rem center !important;
		padding-left: 4.5rem !important;
	}

	/* Responsive icon scaling - match your breakpoints */
	@media screen and (max-width: 900px) {
		input[type='search'] {
			background-size: 1.8rem !important;
			background-position: left 1rem center !important;
			padding-left: 4rem !important;
		}
	}

	@media screen and (max-width: 780px) {
		input[type='search'] {
			background-size: 1.6rem !important;
			background-position: left 0.8rem center !important;
			padding-left: 3.5rem !important;
		}
	}

	@media screen and (max-width: 480px) {
		input[type='search'] {
			background-size: 1.4rem !important;
			background-position: left 0.8rem center !important;
			padding-left: 3.2rem !important;
		}
	}

	/* Results dropdown */
	.results-dropdown {
		position: absolute;
		z-index: 50;
		width: 100%;
		margin-top: 0.8rem;
		background: var(--pico-background-color);
		border: 1px solid var(--pico-muted-border-color);
		border-radius: var(--pico-border-radius);
		box-shadow: var(--pico-box-shadow);
		max-height: 60rem;
		overflow-y: auto;
	}

	.result-empty {
		padding: 2.4rem;
		text-align: center;
	}

	.result-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.2rem;
	}

	.loading-spinner {
		width: 2.4rem;
		height: 2.4rem;
		border: 3px solid var(--pico-muted-border-color);
		border-top-color: var(--pico-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.result-error p:last-child {
		color: var(--pico-del-color, #e53935);
		font-size: 1.3rem;
	}

	.results-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.results-list li {
		border-bottom: 1px solid var(--pico-muted-border-color);
	}

	.results-list li:last-child {
		border-bottom: none;
	}

	.results-list a {
		display: block;
		padding: 2rem;
		text-decoration: none;
		color: var(--theme-font-default);
		font-size: 1.2rem;
	}

	.results-list a:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}

	.result-content {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.result-main {
		flex: 1;
		min-width: 0;
	}

	.result-main h3 {
		margin-bottom: 0.8rem;
		margin-top: 0;
		font-size: 1.6rem;
		font-weight: inherit;
		line-height: inherit;
	}

	.result-main p {
		margin-bottom: 1rem;
		color: var(--pico-muted-color);
		font-size: 1.4rem;
	}

	.result-meta small {
		color: var(--pico-muted-color);
	}

	.result-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.tag {
		border: 1px solid var(--theme-background-secondary);
		padding: 0 1rem;
		border-radius: var(--theme-border-radius-default);
		box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
		font-size: 1.4rem;
	}

	.result-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.4rem;
	}

	.score {
		font-weight: 600;
		padding: 0.4rem 0.8rem;
		border-radius: var(--pico-border-radius);
		color: var(--pico-muted-color);
	}

	@media (max-width: 768px) {
		.result-content {
			flex-direction: column;
			gap: 1rem;
		}

		.result-meta {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			width: 100%;
		}
	}
</style>
