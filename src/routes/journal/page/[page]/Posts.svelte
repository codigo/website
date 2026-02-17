<script lang="ts">
	import { blurhashToCssGradientString } from '@unpic/placeholder';
	import { Image } from '@unpic/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Post } from '$lib/types';
	let { posts }: { posts: Post[] } = $props();

	const onClick = (slug: string) => {
		goto(resolve('/journal/[slug]', { slug }));
	};

	const onLoadImage = (event: Event) => {
		const target = event.target as HTMLImageElement | null;
		target?.classList.add('fade-in-image');
	};
</script>

<div class="posts-wrapper">
	<ul class="posts-list">
		{#each posts as { title, slug, tags, photo_metadata, created, summary }, idx (slug)}
			<li class="post-item">
				<article class="article">
					<button class="article-wrapper" role="link" tabindex={idx} onclick={() => onClick(slug)}>
						<div
							class="background-blur background-blur-radius"
							style={`background-image: ${blurhashToCssGradientString(photo_metadata.blur_hash)}`}
						>
							<Image
								layout="fullWidth"
								class="post-image"
								src={photo_metadata.urls.small}
								alt={photo_metadata.alt_description}
								loading="lazy"
								height={180}
								onload={(ev: Event) => onLoadImage(ev)}
							/>
						</div>
						<ul class="post-tags">
							{#each tags.split(',') as tag (tag)}
								<li class="post-tag-item">#{tag.trim()}</li>
							{/each}
						</ul>
						<h3>{title}</h3>
						<p>{summary}</p>
						<p class="post-date">
							{created}
						</p>
					</button>
				</article>
			</li>
		{/each}
	</ul>
</div>

<style>
	.posts-wrapper {
		padding: 3.2rem;
	}

	.posts-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}

	@media screen and (max-width: 78rem) {
		.posts-list {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media screen and (max-width: 48rem) {
		.posts-list {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.post-item {
		background: var(--theme-card-background-default);
		border-radius: var(--theme-border-radius-default);
		box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
		transition: all 0.4s ease-out;
		height: 78rem;
	}

	.article {
		height: 100%;
	}

	.article-wrapper {
		display: grid;
		padding: 2.4rem;
		row-gap: 1.4rem;
		height: 100%;

		border: unset;
		text-align: start;
		background-color: unset;
		align-content: space-between;
		justify-content: stretch;
	}

	.background-blur {
		height: 180px;
	}

	.background-blur-radius {
		border-radius: 0.5rem;
	}

	.post-item:hover {
		transform: scale(1.02);
		transition: 0.3s;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.post-tag-item {
		border: 1px solid var(--theme-background-secondary);
		padding: 0 1rem;
		border-radius: var(--theme-border-radius-default);
		box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
		font-size: 1.2rem;
	}

	.post-date {
		font-size: 1.4rem;
		font-weight: 200;
		color: var(--theme-text-secondary);
	}
</style>
