<script lang="ts">
	import '../app.css';
	import { navigating, page } from '$app/state';
	import type { SEOMetadata } from './+layout';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import type { Snippet } from 'svelte';

	const { data, children } = $props<{
		data: { metadata: SEOMetadata; url: string };
		children: Snippet;
	}>();

	let mounted = $state(false);

	$effect.pre(() => {
		mounted = true;
	});

	// Combine current path with base URL for canonical
	const canonicalUrl = $derived(`${data.metadata.canonicalUrl}${page.url.pathname}`);
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
	<meta name="keywords" content={data.metadata.keywords} />

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content={data.metadata.title} />
	<meta property="og:description" content={data.metadata.description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={data.metadata.ogImage} />

	<!-- Twitter -->
	<meta name="twitter:title" content={data.metadata.title} />
	<meta name="twitter:description" content={data.metadata.description} />
	<meta name="twitter:image" content={data.metadata.ogImage} />
</svelte:head>

<div class="main-layout">
	<Header />

	<main class="main">
		{#key data.url}
			{#if navigating.type || !mounted}
				<div class="loading nav-transition" aria-busy={Boolean(navigating.type)}>
					<h3>Hold on! Good things are coming your way.</h3>
					<h3>Thanks for sticking with me!</h3>
					<span class="loader-cloud"></span>
				</div>
			{:else}
				{@render children()}
			{/if}
		{/key}
	</main>

	<Footer />
</div>

<style>
	.main-layout {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
		min-height: 100dvh;
	}

	.main {
		max-width: var(--max-width);
		margin: 0 auto;
		padding-top: 4rem;
	}

	@media (max-width: 1200px) {
		:root {
			--max-width: 100rem;
		}
	}
	@media (max-width: 900px) {
		:root {
			--max-width: 80rem;
		}
	}
	@media (max-width: 810px) {
		:root {
			--max-width: 70rem;
		}
	}
	@media (max-width: 700px) {
		:root {
			--max-width: 60rem;
		}
	}
	@media (max-width: 600px) {
		:root {
			--max-width: 50rem;
		}
	}
	@media (max-width: 500px) {
		:root {
			--max-width: 38rem;
		}
	}

	.nav-transition {
		display: flex;
		gap: 1.6rem;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		height: 50dvh;
	}
</style>
