<script lang="ts">
	import type { Experience } from '$lib/types';
	import Timeline from './Timeline.svelte';
	import Chatbot from '$components/Chatbot.svelte';

	export let data: object & { experiences: Experience[] };
</script>

<svelte:head>
	<title>About me</title>
</svelte:head>

<div class="about-layout">
	<section class="section-about-me b-border">
		<!-- <div class="about-me-img"></div> -->
		<!--  end.about-me-img -->

		<div class="section-about-me-text">
			<div class="about-me-text">
				<h2 class="about-me-heading">About Me</h2>
				<p class="about-me-paragraph">
					I'm Mauricio Mercado, an Architect and seasoned Software Developer with over a decade's
					experience in the industry.
				</p>
				<p class="about-me-paragraph">
					My journey began in the vibrant city of Barranquilla, Colombia, and has led me to the
					beautiful surroundings of Vancouver, Canada, where I now call home.
				</p>
				<p class="about-me-paragraph">
					I've worked with various teams, from remote squads scattered around the globe to on-site.
					Together, we've delivered highly reliable, high-performing products.
				</p>
			</div>
			<!--  end.about-me-text -->

			<div class="about-me-pdf">
				<p class="resume-intro">
					You can explore the timeline below for a detailed view of my experience, or download my
					resume for a quick overview.
				</p>
				<a href="/mm_resume.pdf" download class="download-resume-btn">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Download Resume
				</a>
			</div>
		</div>
		<!--  end.section-about-me-text -->

		<!-- <div class="section-about-me-img">

		</div> -->
	</section>

	<Timeline experiences={data.experiences} />

	<section class="skills-competences b-border">
		<h3>I've honed a diverse skill set over the years ...</h3>
		<ul class="skills-competences-list">
			<li>
				<strong>Frontend and Backend Development:</strong> Proficient in ReactJS, SvelteKit, NodeJS,
				Fastify, micro frontends and modular composition. And I'm always eager to learn new tools and
				technologies, like Rust.
			</li>
			<li>
				<strong>Systems Design & Architecture:</strong> Specialist in designing scalable, maintainable
				systems. Versed in microservices and modular monoliths, allowing for flexible and scalable system
				design.
			</li>
			<li>
				<strong>Databases:</strong> Experience with NoSQL (e.g. Redis, MongoDB, Elasticsearch) and SQL
				(e.g. PostgreSQL).
			</li>
			<li>
				<strong>Integration & Automation:</strong> Skilled using tools like Docker, Kubernetes, GitHub
				Actions and Apps and Terraform.
			</li>
			<li>
				<strong>Development Practices:</strong> Strong advocate for agile methodologies, automated testing,
				and functional programming.
			</li>
			<li>
				<strong>AI Systems:</strong> Knowledgeable in using OpenAI API, Ollama, and other AI systems
				to create personal projects, enhancing my capability to integrate advanced AI functionalities
				into applications.
			</li>
		</ul>
	</section>

	<section class="skills-competences-outro b-border">
		<div class="skills-competences-outro-text">
			<p>
				Outside my work life, I firmly believe in the ethos of lifelong learning. My GitHub
				portfolio <a href="https://github.com/maumercado">https://github.com/maumercado</a> provides
				a glimpse of my wide-ranging skills and interests, featuring projects like a React Native
				app with Expo, my blog <a href="https://codigo.sh">https://codigo.sh</a>, and two Fastify
				plugins, one for the Jaeger distributed tracing system, and the second a plugin to inject
				secrets store in hashicorp vault into the service's environment at boot.
			</p>
			<p>
				I'm also a certified kitesurf instructor and love paddle boarding and surfing—the ocean is
				where I feel most at home. I enjoy hiking and, of course, the occasional drink with friends.
				Additionally, I believe in the power of mentorship, teaching others, and learning from those
				around me.
			</p>
			<p>
				My mission remains steadfast: to continue growing, learning, and contributing to the
				software development landscape. I'm eager to collaborate on new projects and contribute my
				unique perspective to the tech community. Feel free to reach out if you believe we can
				create something remarkable together!
			</p>
		</div>
		<!-- <div class="skills-competences-outro-img">
			<h2>Placeholder for images??</h2>
		</div> -->
	</section>
</div>

<!--  end.about-layout -->

<Chatbot />

<style>
	.about-layout {
		display: grid;
		row-gap: 6.4rem;
		justify-items: stretch;
	}

	.section-about-me {
		padding: 1.2rem 1.6rem 6.4rem 1.6rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 4.8rem;
	}

	.section-about-me-text {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
	}

	.about-me-text {
		display: grid;
		row-gap: 2.4rem;
		padding: 1.2rem 1.6rem 3.2rem 1.6rem;
	}

	.about-me-pdf {
		display: grid;
		row-gap: 2.4rem;
		padding: 1.2rem 1.6rem 3.2rem 1.6rem;
	}

	.download-resume-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
		width: fit-content;
	}

	.download-resume-btn svg {
		width: 2rem;
		height: 2rem;
	}

	.skills-competences {
		display: grid;
		grid-template-rows: 1fr auto;
		gap: 4.8rem;
		padding: 1.2rem 1.6rem 8rem 1.6rem;
	}

	.skills-competences-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3.2rem;
		align-items: start;
	}

	@media (max-width: 970px) {
		.skills-competences-list {
			grid-template-columns: 1fr;
		}
	}

	.skills-competences-outro {
		display: grid;
		grid-template-columns: 1fr;
		gap: 6.4rem;
		padding: 1.2rem 1.6rem 8rem 1.6rem;
	}

	.skills-competences-outro-text {
		display: grid;
		row-gap: 2.4rem;
	}

	/* .img-container {
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
		transform: translateY(1px);
		filter: grayscale(100%);
	}

	.img-container:hover .hero-img {
		transform: scale(1.05);
	} */

	@media (max-width: 980px) {
		.section-about-me {
			grid-template-columns: 1fr;
			justify-items: center;
		}
		.section-about-me-text {
			order: 2;
		}
		/* .section-about-me-img {
			order: 1;
		}
		.img-container {
			width: 300px;
			height: 300px;
		} */
	}
</style>
