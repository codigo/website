<script lang="ts">
	import { onMount } from 'svelte';

	import Carousel from './Carousel.svelte';
	import type { Testimonial } from '$lib/types';

	import aaron from '$lib/assets/imgs/profiles/aaron-fagan.jpeg?enhanced';
	import austin from '$lib/assets/imgs/profiles/austin-tackaberry.jpeg?enhanced';
	import gene from '$lib/assets/imgs/profiles/gene-goykhman.jpeg?enhanced';
	import gil from '$lib/assets/imgs/profiles/gilbert-kwan.jpeg?enhanced';
	import jake from '$lib/assets/imgs/profiles/jake-alstyne.jpeg?enhanced';
	import jared from '$lib/assets/imgs/profiles/jared-halpern.jpeg?enhanced';
	import luispallares from '$lib/assets/imgs/profiles/luis-pallares.jpeg?enhanced';
	import luisporras from '$lib/assets/imgs/profiles/luis-porras.jpeg?enhanced';
	import matt from '$lib/assets/imgs/profiles/matt-cantelon.jpeg?enhanced';
	import sayde from '$lib/assets/imgs/profiles/sayde-deng.jpeg?enhanced';
	import stephen from '$lib/assets/imgs/profiles/stephenmarie-rhodes.jpeg?enhanced';
	import stevenStamaria from '$lib/assets/imgs/profiles/steven-santamaria.jpeg?enhanced';
	import suprada from '$lib/assets/imgs/profiles/suprada-urval.jpeg?enhanced';

	let testimonials: Testimonial[] = [
		{
			author: 'Matthew Cantelon',
			text: `Working with Mauricio for the last year has been the highlight of my career thus far.
      Mauricio's passion for software development is infectious and his natural ability to lead
      a team is a sight to behold.`,
			image: matt as string
		},
		{
			author: 'Gilbert Kwan',
			text: `Mau is an excellent developer. He is very detail oriented and hard-working.
        On many occasions he would drop everything and discuss an issue or find elegant solutions
        to difficult problems. It was always a pleasure working with him.`,
			image: gil as string
		},
		{
			author: 'Sayde Deng',
			text: `Mau is an awesome mentor who provides constructive feedback, shows deep understanding,
      and turns ideas into great products. Working with Mau is a joy!`,
			image: sayde as string
		},
		{
			author: 'Aaron Fagan',
			text: `Mauricio is a solid developer and architect, with a solid understanding and vision
      for the future. He is able to both understand and execute on technical requirements,
      in addition to being able to communicate those same requirements down to non technical
      customers as needed.`,
			image: aaron as string
		},
		{
			author: 'Stephen Marie-Rhodes',
			text: `Mau knows all the things (in a good way). He brings momentum and precision to any
      project. He's just as comfortable leading a team of developers as running
      solo on a mission-critical project. Mau is also a fantastic teacher.`,
			image: stephen as string
		},
		{
			author: 'Suprada Urval',
			text: `It was great working with Mauricio at HumanAPI.\nHis interest in the landscape of web
      development, thirst to learn and explore new technologies is infectious and inspiring.\n      He models the "disagree but commit" approach when as a team, we make a decision.
      And then champions that decision.`,
			image: suprada as string
		},
		{
			author: 'Steven Santa Maria',
			text: `I worked with Mauricio at Human API. He delivers the product and -just as
      important- is responsive. There were times when customers were breathing down our necks and
      that responsiveness was so helpful to the team. Mauricio will be key contributor to any
      engineering team!`,
			image: stevenStamaria as string
		},
		{
			author: 'Austin Tackaberry',
			text: `Mauricio was my first software engineering mentor. He was open, encouraging, and easy
      to get along with. He was always able to come up with simple solutions to complex problems. He
      has passion for his work, and that passion spreads to others on his team.`,
			image: austin as string
		},
		{
			author: 'Gene Goykhman',
			text: `In addition to his technical talent, Mau is a thoughtful, considerate and dedicated person.
      He remains consistently engaged and focused on the work at hand while never failing to bring
      levity and a smile when it is needed the most. Mau is a true pleasure to work with.`,
			image: gene as string
		},
		{
			author: 'Luis Porras',
			text: `Working with Mauricio have been a great experience, I have learned a lot from his
      Node.js experience since I started working with him.\nHe is a curious
      developer that enjoys learning new programming languages, and technologies. He is capable
      of solving problems quickly and is always looking to improve things.`,
			image: luisporras as string
		},
		{
			author: 'Jake Van Alstyne',
			text: `Mau is a very highly skilled and charismatic developer who is a real pleasure to
      work with. He produces timely solutions to difficult problems and works hard to ensure high
      quality results. In addition to being a critical part of our development team, he possesses
      admirable character and dedication.`,
			image: jake as string
		},
		{
			author: 'Jared Halpern',
			text: `Mau is the type of guy you want on your team when things get tough. His technical
      skills were critical to the rapid development of Selfie, and his enthusiasm is contagious.
      Mau also has a great ability to see things further down the road than just the immediate or
      next feature.`,
			image: jared as string
		},
		{
			author: 'Luis Pallares',
			text: `He is a developer that you want to have working on your software engineers team.`,
			image: luispallares as string
		}
	];

	let screenWidth = $state(900);

	onMount(() => {
		screenWidth = window.innerWidth;
		const handleResize = () => {
			screenWidth = window.innerWidth;
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	let itemsToShow = $derived(screenWidth < 1060 ? 1 : 2);
</script>

<section class="section-testimonials b-border">
	<div class="testimonials-title">
		<h2>What People Say</h2>
		<p>Testimonials from colleagues and clients</p>
	</div>
	<Carousel {testimonials} {itemsToShow} />
</section>

<style>
	.section-testimonials {
		padding: 4.8rem 0;
		overflow: hidden;
	}

	@media (max-width: 1040px) {
		.section-testimonials {
			margin: 0 auto;
			padding-left: 4.8rem;
			padding-right: 4.8rem;
		}
	}

	@media (max-width: 950px) {
		.section-testimonials {
			margin: 0 auto;
			padding-left: 3.2rem;
			padding-right: 3.2rem;
		}
	}

	@media (max-width: 700px) {
		.section-testimonials {
			margin: 0 auto;
			padding-left: 0.8rem;
			padding-right: 0.8rem;
		}
	}

	.testimonials-title {
		text-align: center;
		margin-bottom: 4rem;
		padding: 0 2rem;
	}

	.testimonials-title h2 {
		margin-bottom: 1rem;
	}

	.testimonials-title p {
		font-size: 1.8rem;
		color: var(--theme-font-default);
		font-weight: 300;
	}

	@media (max-width: 768px) {
		.testimonials-title h2 {
			font-size: 2.8rem;
		}

		.testimonials-title p {
			font-size: 1.6rem;
		}
	}
</style>
