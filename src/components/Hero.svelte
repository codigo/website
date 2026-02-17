<script lang="ts">
	import X from './icons/social/X.svelte';
	import { MailUnreadOutline, LogoLinkedin, LogoGithub } from 'svelte-ionicons';
	import type { EnhancedImage } from '$lib/types';
	import heroImg from '$lib/assets/imgs/my_profile_with_bg.webp?enhanced';

	// Type assertion for enhanced image
	const heroImageSrc = (heroImg as EnhancedImage).img.src;
</script>

<section class="section-hero">
	<div class="hero-intro">
		<div class="hero-img-box">
			<div class="img-container">
				<div class="img-wrapper">
					<enhanced:img class="hero-img" src={heroImageSrc as string} alt="Mauricio Mercado" />
				</div>
			</div>
		</div>
		<!--  end.hero-img-box -->

		<div class="hero-text-box">
			<div class="hero-heading-name">
				<p>Hi there, I'm Mauricio &nbsp;</p>
				<div class="wave">👋</div>
			</div>
			<h1 class="hero-title">Backend & AI Integration Engineer based in Canada.</h1>
			<p class="hero-text">
				I specialize in building robust backend systems and integrating AI into workflows.<br />
				With my expertise in systems architecture, backend technologies, and AI integration, I can help
				you bring your ideas to life.
			</p>

			<div class="hero-social-icons">
				<ul class="social-icons">
					<li class="social-icon">
						<a href="https://www.linkedin.com/in/mauromercado/" target="_blank" rel="external">
							<LogoLinkedin />
						</a>
					</li>
					<li class="social-icon">
						<a href="https://github.com/maumercado" target="_blank" rel="external">
							<LogoGithub />
						</a>
					</li>
					<li class="social-icon">
						<a href="https://x.com/maumercado" target="_blank" rel="external">
							<X />
						</a>
					</li>
					<li class="social-icon">
						<a href="mailto:mau@codigo.sh" target="_blank" rel="external">
							<MailUnreadOutline />
						</a>
					</li>
				</ul>
			</div>
			<!--  end.hero-social-icons -->
		</div>
		<!--  end.hero-text-box -->
	</div>
	<!--  end.hero -->
</section>

<style>
	.section-hero {
		padding: 1.2rem 1.6rem;
	}

	.hero-intro {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		place-items: center;
		column-gap: 3.6rem;
	}

	@media (max-width: 980px) {
		.hero-intro {
			grid-template-columns: auto;
		}
	}

	.hero-text-box {
		display: grid;
		row-gap: 3.2rem;
	}

	@media (max-width: 980px) {
		.hero-text-box {
			row-gap: 1.6rem;
		}
	}

	.hero-heading-name,
	.hero-text {
		display: flex;
		align-items: center;
		& > .wave {
			font-size: 2.4rem;
		}
	}

	.wave {
		animation: wave-hand 1.5s linear 0.5s 1 normal;
		transform-origin: 50% 50%;
	}

	.hero-title {
		opacity: 0;
		animation: bottomFadeIn 1s linear 0.75s normal forwards;
	}

	.hero-text {
		opacity: 0;
		animation: bottomFadeIn 1s linear 1.25s normal forwards;
	}

	.hero-social-icons {
		opacity: 0;
		animation: bottomFadeIn 1s linear 1.25s normal forwards;
	}

	.social-icons {
		display: flex;
		gap: 3.6rem;
	}

	.social-icon {
		transition: 0.25s ease;
		cursor: pointer;

		&:hover {
			transform: scale(1.25);
		}
		& > a:hover {
			box-shadow: none;
		}
	}

	.hero-img-box {
		padding-bottom: 3.2rem;
	}

	.img-container {
		position: relative;
		width: 380px;
		height: 380px;
		border-radius: 50%;
		overflow: visible;
	}

	.img-container::before {
		content: '';
		position: absolute;
		top: -2.4rem;
		left: -2.4rem;
		right: -2.4rem;
		bottom: -2.4rem;
		background: conic-gradient(from 150deg, #fff, #fff 46%, transparent 46%);
		-webkit-mask: radial-gradient(
			farthest-side,
			transparent calc(100% - 3px),
			#fff calc(100% - 3px + 1px)
		);
		mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px + 1px));
		border-radius: 50%;
		z-index: -1;
		opacity: 0.8;
	}

	.img-wrapper {
		position: relative;
		overflow: hidden;
		border-radius: 50%;
		height: 100%;
		width: 100%;
	}

	.img-wrapper::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			circle at center,
			rgba(0, 0, 0, 0.05) 30%,
			rgba(0, 0, 0, 0.2) 60%,
			rgba(0, 0, 0, 0.4) 100%
		);
		pointer-events: none;
	}

	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
		transform: translateX(5px);
		filter: grayscale(100%);
	}

	.img-container:hover .hero-img {
		transform: translateX(5px) scale(1.05);
	}

	@media (max-width: 980px) {
		.hero-img-box {
			padding: 3rem;
		}
		.img-container {
			width: 300px;
			height: 300px;
		}
	}

	@keyframes wave-hand {
		0% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(20deg);
		}
		20% {
			transform: rotate(-10deg);
		}
		30% {
			transform: rotate(20deg);
		}
		40% {
			transform: rotate(-6deg);
		}
		50% {
			transform: rotate(12deg);
		}
		60% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
</style>
