<script lang="ts">
	import type { Capability } from '$lib/types';
	export let capabilities: Capability[];
</script>

<section class="section-capabilities b-border">
	<div class="pico capabilities">
		{#each capabilities as capability (capability.title)}
			<div class="capability capability-{capability.title.toLowerCase().replace(/\s+/g, '-')}">
				<div class="capability-icon">{capability.icon}</div>
				<h3 class="capability-text">{capability.title}</h3>
				<ul class="capability-list">
					{#each capability.items as item (item.text)}
						<li class="capability-item" data-tooltip={item.tooltip}>{item.text}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
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
			grid-template-columns: auto auto auto auto;
			gap: 6.4rem;
			justify-content: center;
		}

		.capability-systems-architecture {
			grid-column: 2 / 2;
		}

		.capability-developer-experience {
			grid-column: 3 / 3;
		}

		.capability-development {
			grid-column: 2 / 2;
		}

		.capability-ai {
			grid-column: 3 / 3;
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

		.capability-systems-architecture {
			grid-column: 1 / 1;
		}

		.capability-developer-experience {
			grid-column: 1 / 1;
		}

		.capability-development {
			grid-column: 1 / 1;
		}

		.capability-ai {
			grid-column: 1 / 1;
		}
	}

	.capability {
		display: flex;
		flex-direction: column;
		gap: 3.2rem;
		align-items: flex-start;
	}
	.capability-icon {
		font-size: 6.4rem;
		align-self: center;
	}

	.capability-text {
		align-self: center;
	}

	.capability-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style-position: inside;
	}

	.capability-list > .capability-item::marker {
		/* Add a custom marker for list with space */
		content: '\2713  ';
	}

	[data-tooltip]:hover::before {
		word-break: break-word;
		white-space: normal;
		min-width: 22rem;
		text-wrap: pretty;
	}

	.pico [data-tooltip] {
		border-bottom: none;
	}
</style>
