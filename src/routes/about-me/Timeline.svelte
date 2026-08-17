<script lang="ts">
	import type { Experience } from '$lib/types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { experiences = [] }: { experiences?: Experience[] } = $props();

	const onClick = (slug: string) => {
		goto(resolve('/about-me/[slug]', { slug }));
	};
</script>

<section class="section-about-me-experience b-border">
	<h3 class="about-me-experience-title">
		My professional journey is marked by significant contributions to various organizations
	</h3>

	<ol class="timeline">
		{#each experiences as entry, index (entry.slug)}
			<li class="timeline-entry">
				<span class="timeline-marker">{entry.timeframe}</span>
				<button
					class="timeline-content"
					class:timeline-content--flipped={index % 2 !== 0}
					role="link"
					tabindex={index}
					onclick={() => onClick(entry.slug)}
				>
					<h4 class="timeline-heading">{entry.company}</h4>
					<p class="timeline-text">{entry.description}</p>
					<span class="timeline-cta">Read more &rarr;</span>
				</button>
			</li>
		{/each}
	</ol>
	<!--  end.timeline -->
</section>

<!--  end.section-about-me-experience -->

<style>
	.section-about-me-experience {
		display: grid;
		align-items: center;
		place-items: center;
		gap: 6.4rem;
		padding-bottom: 6.4rem;
	}

	.about-me-experience-title {
		margin: 0 auto;
		inline-size: 55%;
		text-align: center;
	}

	.timeline {
		position: relative;
		padding-right: 1.6rem;
	}

	.timeline:before {
		content: '';
		position: absolute;
		top: -3rem;
		left: 2rem;
		width: 2px;
		height: calc(100% + 3.6rem);
		background: rgba(255, 255, 255, 0.15);
	}

	.timeline-entry {
		position: relative;
		margin-bottom: 4rem;
	}

	/* Date marker above the card on mobile */
	.timeline-marker {
		display: block;
		margin-left: 4rem;
		margin-bottom: 0.6rem;
		font-size: var(--theme-font-size-small);
		color: var(--theme-font-default);
		white-space: nowrap;
	}

	.timeline-content {
		position: relative;
		margin-left: 4rem;
		padding: 1.6rem;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		text-align: start;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.timeline-content:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.25);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.timeline-content:hover .timeline-cta {
		color: var(--theme-font-default);
	}

	.timeline-heading {
		margin-bottom: 0.8rem;
	}

	.timeline-text:last-of-type {
		margin-bottom: 0;
	}

	.timeline-cta {
		color: var(--theme-font-secondary);
		font-size: var(--theme-font-size-small);
		margin-top: 1.2rem;
		display: block;
		transition: color 0.3s ease;
	}

	@media screen and (min-width: 65em) {
		.timeline {
			padding-right: 0;
		}

		.timeline:before {
			left: 50%;
			transform: translateX(-50%);
		}

		.timeline-entry {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			column-gap: 2rem;
			align-items: center;
		}

		/* Marker in the center grid column */
		.timeline-marker {
			grid-column: 2;
			grid-row: 1;
			margin-left: 0;
			margin-bottom: 0;
			padding: 0.4rem 1.2rem;
			background: rgba(255, 255, 255, 0.08);
			backdrop-filter: blur(8px);
			-webkit-backdrop-filter: blur(8px);
			border: 1px solid rgba(255, 255, 255, 0.15);
			border-radius: 8px;
			text-align: center;
		}

		.timeline-content {
			margin-left: 0;
			padding: 2.4rem;
			grid-column: 1;
			grid-row: 1;
		}

		.timeline-content--flipped {
			grid-column: 3;
		}
	}
</style>
