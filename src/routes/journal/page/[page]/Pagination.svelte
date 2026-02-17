<script lang="ts">
	import { resolve } from '$app/paths';

	const { currentPage, totalPages } = $props<{ currentPage: number; totalPages: number }>();

	const getPageNumbers = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];
		let l;

		range.push(1);

		for (let i = currentPage - delta; i <= currentPage + delta; i++) {
			if (i < totalPages && i > 1) {
				range.push(i);
			}
		}

		if (totalPages > 1) {
			range.push(totalPages);
		}

		for (let i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	};
</script>

<nav class="pagination-wrapper" aria-label="Pagination">
	<ul class="pagination">
		<li>
			<a
				href={resolve('/journal/page/[page]', { page: String(Math.max(1, currentPage - 1)) })}
				class:disabled={currentPage === 1}
				aria-label="Previous page">&lt;</a
			>
		</li>
		{#each getPageNumbers() as pageNum, i (i)}
			<li>
				{#if pageNum === '...'}
					<span class="dots">...</span>
				{:else}
					<a
						href={resolve('/journal/page/[page]', { page: String(pageNum) })}
						class:active={currentPage === pageNum}
						aria-label={`Page ${pageNum}`}
						aria-current={currentPage === pageNum ? 'page' : undefined}>{pageNum}</a
					>
				{/if}
			</li>
		{/each}
		<li>
			<a
				href={resolve('/journal/page/[page]', {
					page: String(Math.min(totalPages, currentPage + 1))
				})}
				class:disabled={currentPage === totalPages}
				aria-label="Next page">&gt;</a
			>
		</li>
	</ul>
</nav>

<style>
	.pagination-wrapper {
		display: flex;
		justify-content: center;
		margin: 4rem 0;
	}

	.pagination {
		display: flex;
		gap: 0.8rem;
		padding: 1rem;
		background-color: var(--theme-card-background-default);
		border-radius: 4rem;
		box-shadow: 6px 6px 8px 3px rgba(0, 0, 0, 0.3);
	}

	.pagination li {
		display: inline-block;
	}

	.pagination a,
	.pagination .dots {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		text-align: center;
		text-decoration: none;
		color: var(--theme-font-default);
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		font-size: 1.6rem;
	}

	.pagination a {
		background-color: var(--theme-background-default);
		box-shadow:
			inset 0 5px 10px rgba(0, 0, 0, 0.2),
			0 2px 5px rgba(0, 0, 0, 0.3);
	}

	.pagination a:hover:not(.disabled),
	.pagination a.active {
		color: var(--theme-font-default);
		background-color: var(--color-primary);
		transform: translateY(-2px);
	}

	.pagination li:first-child a {
		border-radius: 2rem 0.5rem 0.5rem 2rem;
	}

	.pagination li:last-child a {
		border-radius: 0.5rem 2rem 2rem 0.5rem;
	}

	.pagination a.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.dots {
		cursor: default;
	}
</style>
