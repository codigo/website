<script lang="ts">
	import type { Testimonial } from '$lib/types';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	let {
		testimonials = [],
		itemsToShow = 1
	}: { testimonials?: Testimonial[]; itemsToShow?: number } = $props();

	// Calculate responsive basis classes
	let basisClass = $derived(itemsToShow === 1 ? 'basis-full' : 'basis-1/2');
</script>

<div class="carousel-wrapper">
	<Carousel.Root
		opts={{
			align: 'start',
			loop: true
		}}
		class="w-full"
	>
		<Carousel.Content class="-ml-2">
			{#each testimonials as testimonial (testimonial.author)}
				<Carousel.Item class="pl-2 {basisClass}">
					<figure class="testimonial">
						<enhanced:img
							class="testimonial-img"
							src={testimonial.image}
							alt={testimonial.author}
						/>
						<blockquote>
							<p class="testimonial-text">{testimonial.text}</p>
						</blockquote>
						<cite class="testimonial-author">&mdash; {testimonial.author}</cite>
					</figure>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="!-left-20 !size-16" />
		<Carousel.Next class="!-right-20 !size-16" />
	</Carousel.Root>
</div>

<style>
	.carousel-wrapper {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 0 6rem;
	}

	/* Ensure ShadCN carousel navigation buttons work properly */
	:global(.carousel-wrapper [data-slot='carousel-previous']),
	:global(.carousel-wrapper [data-slot='carousel-next']) {
		/* Override Pico CSS button styles */
		background-color: hsl(var(--background)) !important;
		border: 1px solid hsl(var(--border)) !important;
		color: hsl(var(--foreground)) !important;
		transition: all 0.2s ease-in-out !important;
	}

	:global(.carousel-wrapper [data-slot='carousel-previous']:hover),
	:global(.carousel-wrapper [data-slot='carousel-next']:hover) {
		background-color: hsl(var(--accent)) !important;
		color: hsl(var(--accent-foreground)) !important;
		transform: scale(1.05) !important;
	}

	/* Make arrow icons bigger */
	:global(.carousel-wrapper [data-slot='carousel-previous'] svg),
	:global(.carousel-wrapper [data-slot='carousel-next'] svg) {
		width: 2rem !important;
		height: 2rem !important;
	}

	.testimonial {
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 1s ease;
		padding: 2.4rem 4.8rem;
	}

	.testimonial-img {
		border-radius: 50%;
		width: 8rem;
		height: 8rem;
	}

	@media (max-width: 700px) {
		.testimonial {
			padding: 1.2rem 3.2rem;
		}

		.testimonial-img {
			width: 6rem;
			height: 6rem;
		}
	}

	.testimonial-text {
		padding-top: 1.2rem;
		font-size: var(--theme-font-size-small);
		line-height: 1.5;
	}

	.testimonial-author {
		font-size: var(--theme-font-size-small);
		padding: 1.4rem 0;
	}

	@media (max-width: 900px) {
		.testimonial {
			padding: 1.2rem 2.4rem;
		}
	}
</style>
