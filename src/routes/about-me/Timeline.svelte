<script lang="ts">
	import type { Experience } from '$lib/types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	export let experiences: Experience[] = [];

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
				<p class="timeline-id">{entry.timeframe}</p>
				<button
					class="timeline-content"
					class:timeline-content--flipped={index % 2 !== 0}
					role="link"
					tabindex={index}
					on:click={() => onClick(entry.slug)}
				>
					<h4 class="timeline-heading">
						{entry.company}
					</h4>
					<p class="timeline-text">
						{entry.description}
					</p>
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
	}
	.timeline:before {
		content: '';
		position: absolute;
		top: -3rem;
		left: 2rem;
		right: 17rem;
		width: 0.2rem;
		height: calc(100% + 3.6rem);
		background: linear-gradient(to bottom, #0f1218 0%, #2727278a 3%, #272727d0 80%, #0f1218 100%);
	}

	@media screen and (min-width: 65em) {
		.timeline:before {
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.timeline-entry {
		position: relative;
		margin-bottom: 4rem;
	}
	.timeline-entry:after {
		content: '';
		display: table;
		clear: both;
	}

	.timeline-id {
		position: absolute;
		top: 1rem;
		padding: 0.4rem 1.2rem;
		background: #3333338a;
		margin-left: 0.2rem;
		border-radius: 0.5rem;
		box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
	}

	@media screen and (min-width: 65em) {
		.timeline-id {
			left: 50%;
			transform: translateX(-50%);
			box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
		}
	}

	.timeline-content {
		position: relative;
		margin-left: 22rem;

		padding: 1rem;
		background: #3333336a;
		border-radius: 0.5rem;
		box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
		border: unset;
		text-align: start;
		transition: all 0.4s ease-out;
	}

	@media screen and (min-width: 65em) {
		.timeline-content {
			border: unset;
			padding: 2.4rem;
			margin-left: 0;
			width: calc(50% - 12.8rem);
			border-radius: 0.5rem;
			box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
			cursor: pointer;
			text-align: start;
		}
	}
	.timeline-content:hover {
		transform: scale(1.05);
		transition: 0.3s;
	}

	@media screen and (min-width: 65em) {
		.timeline-content--flipped {
			float: right;
			box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
		}
	}

	.timeline-heading {
		margin-bottom: 0.8rem;
	}

	.timeline-text:last-child {
		margin-bottom: 0;
	}
</style>
