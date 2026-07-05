<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	const links = {
		home: { path: '/', name: 'Home' },
		about: { path: '/about-me', name: 'About me' },
		journal: { path: '/journal', name: 'Journal' },
		contact: { path: '/contact', name: 'Contact me' }
	} as const;

	let isMenuOpen = $state(false);
	let hoveredLink = $state<string | null>(null);
	let path = $derived($page.url.pathname);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleMouseEnter(key: string) {
		hoveredLink = key;
	}

	function handleMouseLeave() {
		hoveredLink = null;
	}
</script>

<div class="content-wrapper">
	<header class="header">
		<section class="main-nav">
			<ul class="main-nav-list" class:open={isMenuOpen}>
				{#each Object.entries(links) as [key, link] (key)}
					<li>
						<a
							class="main-nav-link"
							class:active={link.path === '/' ? path === '/' : path.startsWith(link.path)}
							class:hovered={hoveredLink === key}
							href={resolve(link.path)}
							onclick={() => (isMenuOpen = false)}
							onmouseenter={() => handleMouseEnter(key)}
							onmouseleave={handleMouseLeave}
						>
							{link.name}
						</a>
					</li>
				{/each}
			</ul>
			<button
				class="hamburger-menu"
				onclick={toggleMenu}
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				class:hovered={hoveredLink === 'hamburger-menu'}
			>
				<span class="hamburger-icon" class:open={isMenuOpen}></span>
			</button>
			{#if isMenuOpen}
				<span class="menu-connector"></span>
			{/if}
		</section>
	</header>
</div>

<style lang="postcss">
	.content-wrapper {
		margin-bottom: 6cqmin;
	}
	.header {
		backdrop-filter: blur(1.2rem);
		display: flex;
		justify-content: center;
		padding: 0 1.4rem;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 100;
	}

	.main-nav {
		padding: 3.6rem 0;
		width: 100%;
		max-width: 1200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main-nav-list {
		display: flex;
		gap: 2.8em;
	}

	.main-nav-link {
		transition: color 0.25s ease;
		padding: 0.5rem 1rem;
		position: relative;
		color: var(--theme-font-primary);
	}

	.main-nav-link:not(.active) {
		transition: color 0.25s ease;
	}

	.main-nav-link.hovered:not(.active) {
		color: var(--theme-font-secondary);
		transition: color 0.25s ease;
	}

	.active,
	.active:hover {
		color: var(--theme-font-active-link);
		transition: color 0.25s ease;
	}

	.active::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background-color: var(--theme-font-active-link);
		transition: background-color 0.25s ease;
	}

	.hamburger-menu {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 1.4rem;
		color: var(--theme-font-secondary);
		position: relative;
		z-index: 110;
	}

	.hamburger-menu::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 42px;
		height: 42px;
		background-color: var(--theme-card-background-default);
		border-radius: 50%;
		z-index: -1;
	}

	.hamburger-icon {
		display: block;
		width: 25px;
		height: 3px;
		background: currentColor;
		position: relative;
		transition: background 0.3s ease;
	}

	.hamburger-icon::before,
	.hamburger-icon::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: currentColor;
		left: 0;
		transition: all 0.3s ease;
	}

	.hamburger-icon::before {
		top: -8px;
	}

	.hamburger-icon::after {
		bottom: -8px;
	}

	.hamburger-icon.open {
		background: transparent;
	}

	.hamburger-icon.open::before {
		transform: rotate(45deg);
		top: 0;
	}

	.hamburger-icon.open::after {
		transform: rotate(-45deg);
		bottom: 0;
	}

	@media (max-width: 600px) {
		.header {
			backdrop-filter: unset;
			justify-content: flex-end;
		}

		.main-nav {
			justify-content: flex-end;
			padding: 0.8rem 0;
		}

		.hamburger-menu {
			display: block;
			position: relative;
			z-index: 110;
		}

		.main-nav-list {
			display: none;
			flex-direction: column;
			position: absolute;
			top: calc(100% + 8px);
			right: 1.2rem;
			width: 150px;
			background: var(--theme-card-background-default);
			border-radius: var(--theme-border-radius-default);
			padding: 1.4rem;
			z-index: 100;
			box-shadow: -2px 4px 6px rgba(0, 0, 0, 0.1);
			overflow: hidden;
		}

		.main-nav-list::before {
			backdrop-filter: blur(1.2rem);
			content: '';
			position: absolute;
			top: -50%;
			left: -50%;
			width: 200%;
			height: 200%;
			z-index: -1;
		}

		.main-nav-list.open {
			display: flex;
			gap: 1rem;
		}

		.main-nav-list li {
			margin: 0;
		}

		.main-nav-link {
			display: inline-block;
			padding: 0.5rem 0;
		}

		.active {
			box-shadow: none;
			position: relative;
		}

		.active::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 2px;
			background-color: var(--theme-font-active-link);
		}

		.menu-connector {
			display: none;
			position: absolute;
			top: 100%;
			right: 32px; /* Adjust based on your layout */
			width: 0;
			height: 0;
			border-left: 8px solid transparent;
			border-right: 8px solid transparent;
			border-bottom: 8px solid var(--theme-card-background-default);
			z-index: 105;
		}

		.main-nav-list.open + .hamburger-menu + .menu-connector {
			display: block;
		}
	}
</style>
