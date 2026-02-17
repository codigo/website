<script lang="ts">
	// Number of skeleton cards to display
	let { count = 4 }: { count?: number } = $props();
</script>

<section class="section-capabilities b-border">
	<div class="pico capabilities">
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each Array(count) as _, i (i)}
			<div class="capability">
				<div class="capability-icon-skeleton">
					<svg width="60" height="60" viewBox="0 0 60 60">
						<circle cx="30" cy="30" r="30" class="skeleton-pulse" />
					</svg>
				</div>
				<h3 class="capability-text-skeleton">
					<span class="visually-hidden">Loading capability title</span>
					<svg width="150" height="20" viewBox="0 0 150 20">
						<rect width="150" height="20" rx="4" class="skeleton-pulse" />
					</svg>
				</h3>
				<ul class="capability-list">
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#each Array(5) as _, j (j)}
						<li class="capability-item-skeleton">
							<svg width="220" height="15" viewBox="0 0 220 15">
								<rect width="220" height="15" rx="3" class="skeleton-pulse" />
							</svg>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
	/* Reuse the same styles from Capabilities.svelte for consistency */
	.section-capabilities {
		padding: 8rem 0 8rem 0;
	}

	.capabilities {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 3.2rem;
		justify-items: center;
	}

	@media (max-width: 1205px) {
		.section-capabilities {
			padding: 3.2rem 0 3.2rem 0;
		}

		.capabilities {
			grid-template-columns: auto auto;
			gap: 6.4rem;
			justify-content: center;
		}
	}

	@media (max-width: 970px) {
		.section-capabilities {
			padding: 1.6rem 0 1.6rem 0;
		}

		.capabilities {
			grid-template-columns: repeat(1, auto);
			gap: 3.6rem;
			justify-content: center;
		}
	}

	.capability {
		display: flex;
		flex-direction: column;
		gap: 3.2rem;
		align-items: flex-start;
	}

	.capability-icon-skeleton {
		align-self: center;
	}

	.capability-text-skeleton {
		align-self: center;
		margin: 0;
	}

	.capability-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style: none;
		padding: 0;
	}

	/* Skeleton-specific styles */
	.capability-item-skeleton {
		/* Remove the list marker for skeleton items */
		list-style-type: none;
	}

	/* Visually hidden but accessible to screen readers */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	/* Skeleton animation */
	.skeleton-pulse {
		fill: #e0e0e0;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.6;
		}
	}
</style>
