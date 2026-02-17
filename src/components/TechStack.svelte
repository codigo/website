<script lang="ts">
	import { onMount } from 'svelte';
	import { splitArrayIntoChunks, duplicateObjectsInArray } from '$lib/utils';
	import { TECH_STACK, CHUNKS, type TechStack } from '../constants/techStack';

	let techStackChunks = $state([[] as TechStack[]]);
	let loading = $state(true);

	let dataAnimatedScroller = $state(false);
	onMount(() => {
		loading = false;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			dataAnimatedScroller = true;
			techStackChunks = duplicateObjectsInArray(splitArrayIntoChunks(TECH_STACK, CHUNKS));
		} else {
			techStackChunks = splitArrayIntoChunks(TECH_STACK, 4);
		}
	});
</script>

<section class="section-tech-stack b-border">
	<div class="tech-stack-title">
		<h2>Building Blocks</h2>
		<p>The technologies I use to bring ideas to life</p>
	</div>

	{#if loading}
		<div class="loading" aria-busy={loading}>
			<span class="loader"></span>
		</div>
	{:else}
		<div class="pico tech-stack-box" data-animated={dataAnimatedScroller}>
			{#each techStackChunks as techStackChunk, idx (idx)}
				<!-- techStackChunk is an array of objects -->
				<ul
					class="pico tech-stack-box-inner"
					data-animated={dataAnimatedScroller}
					data-direction={idx % 2 === 0 ? 'left' : 'right'}
				>
					{#each techStackChunk as tech, techIdx (`${tech.name}-${techIdx}`)}
						<li
							title={tech.name}
							data-tooltip={tech.name}
							class="tech-stack-item"
							aria-hidden={!!tech.duplicate}
						>
							<tech.icon size="64" />
						</li>
					{/each}
				</ul>
			{/each}
		</div>
		<!--  end.tech-stack-box -->
	{/if}
</section>

<style lang="postcss">
	.section-tech-stack {
		padding: 4.8rem 0 8rem 0;
		margin-bottom: 2.4rem;
		overflow: hidden;
	}

	@media (max-width: 980px) {
		.section-tech-stack {
			padding-bottom: 4.8rem;
		}
	}

	.tech-stack-box {
		margin: 0 auto;
		display: grid;
		grid-auto-flow: rows;
		gap: 1rem;
	}

	.tech-stack-box-inner {
		display: grid;
		grid-auto-flow: column;
		gap: 1rem;
		justify-items: center;
		align-items: center;
	}

	.tech-stack-box[data-animated='true'] {
		display: unset;
		overflow: hidden;
		-webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
		mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
	}

	.tech-stack-box-inner[data-animated='true'] {
		display: flex;
		padding: 0.8rem;
		gap: 1.2rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.tech-stack-box .tech-stack-box-inner:first-child {
		padding-top: 4rem;
	}

	.tech-stack-box-inner[data-direction='left'] {
		--_animation-direction: forwards;
	}

	.tech-stack-box-inner[data-direction='right'] {
		--_animation-direction: reverse;
	}

	.tech-stack-box[data-animated='true'] .tech-stack-box-inner {
		flex-wrap: nowrap;
		animation: scroll var(--_animation-duration, 40s) var(--_animation-direction, forwards) linear
			infinite;
		width: fit-content;
	}

	.tech-stack-box[data-animated='true'] .tech-stack-box-inner:hover {
		animation-play-state: paused;
	}

	.tech-stack-item {
		display: flex;
		padding: 1.8rem;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		position: relative;
	}

	.tech-stack-item:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.25);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.pico [data-tooltip] {
		border-bottom: none;
	}

	@keyframes scroll {
		to {
			transform: translate(calc(-50%));
		}
	}

	.tech-stack-title {
		text-align: center;
		padding: 0 2rem;
	}

	.tech-stack-title h2 {
		margin-bottom: 1rem;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	@media (max-width: 768px) {
		.tech-stack-title h2 {
			font-size: 2.8rem;
		}

		.tech-stack-title p {
			font-size: 1.6rem;
		}
	}
</style>
