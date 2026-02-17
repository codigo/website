<script lang="ts">
	import { ChevronBack, ChevronForward } from 'svelte-ionicons';
	import type { SvelteComponent } from 'svelte';
	import type { Experience } from '$lib/types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { data } = $props<{ data: { meta: Experience; content: typeof SvelteComponent } }>();

	const { content, meta } = $derived(data);

	const handleClick = (slug: string | undefined) => {
		if (!slug) return;

		goto(resolve('/about-me/[slug]', { slug }));
	};
</script>

<svelte:head>
	<title>{meta.company} | Mauricio Mercado</title>
	<meta name="description" content={meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${meta.company} | Mauricio Mercado`} />
	<meta property="og:description" content={meta.description} />
</svelte:head>

<div class="markdown-wrapper">
	<h1>{meta.company}</h1>
	{@render content()}
	<div class="navigation-links pico">
		<button
			onclick={() => handleClick(meta.previous)}
			disabled={!meta.previous}
			class="goto contrast outline"
			role="link"
		>
			<ChevronBack />
		</button>
		<button
			onclick={() => handleClick(meta.next)}
			disabled={!meta.next}
			class="goto next contrast outline"
			role="link"
		>
			<ChevronForward />
		</button>
	</div>
</div>

<style>
	.markdown-wrapper {
		display: grid;
		row-gap: 2.4rem;
		align-items: center;
	}

	:global(.markdown-wrapper ul:nth-child(5)) {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		justify-content: flex-start;
	}

	:global(.markdown-wrapper ul:nth-child(5) li) {
		padding: 0.8rem;
		background-color: var(--theme-card-background-default);
		border-radius: var(--theme-border-radius-default);
	}

	:global(.markdown-wrapper ul:not(:nth-child(5))) {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	:global(.markdown-wrapper ul:not(:nth-child(5)) li) {
		padding: 0.8rem;
		list-style: square inside;
	}
	.navigation-links {
		padding-top: 3.2rem;
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 1.6rem;
		justify-content: space-between;
	}

	.goto {
		display: grid;
		align-items: center;
		justify-content: space-between;
	}

	.next {
		grid-column: -1;
	}
</style>
