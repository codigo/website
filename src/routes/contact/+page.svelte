<script lang="ts">
	import { PUBLIC_CF_TURNSTILE_KEY } from '$env/static/public';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Turnstile } from 'svelte-turnstile';
	import { ContactSchema } from '$routes/contact/schema';

	const { data } = $props();
	const { form, errors, constraints, message, enhance, submitting } = superForm(data.form, {
		customValidity: true,
		validators: zod4Client(ContactSchema)
	});

	const handleTurnstileCb = (ev: CustomEvent<{ token: string }>) => {
		$form['cf-turnstile-response'] = ev.detail.token;
	};
</script>

<svelte:head>
	<title>Contact me</title>
</svelte:head>

{#if $message}
	<div class="success-message">
		<span class="success-message-internal">
			<h2>{$message}</h2>
			<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
				><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path
					class="checkmark__check"
					fill="none"
					d="M14.1 27.2l7.1 7.2 16.7-16.8"
				/></svg
			>
		</span>
		<p class="go-back">Go back <a href="/">Home</a></p>
	</div>
{:else}
	<div class="contact-title">
		<h2>Get In Touch</h2>
		<p>Let's discuss your next project</p>
	</div>
	<form class="pico contact-form" method="POST" action="?/email" use:enhance>
		<div class="form-group">
			<label for="name">Name</label>
			<input
				autocomplete="name"
				aria-invalid={$errors.name ? 'true' : undefined}
				bind:value={$form.name}
				required
				type="text"
				name="name"
				id="name"
				placeholder="Full Name"
				{...$constraints.name}
			/>
			{#if $errors?.name}
				<label class="error-label" for="name">{$errors.name}</label>
			{/if}
		</div>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				autocomplete="email"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
				required
				type="email"
				name="email"
				id="email"
				placeholder="someone@example.com"
				{...$constraints.email}
			/>
			{#if $errors?.email}
				<label class="error-label" for="email">{$errors.email}</label>
			{/if}
		</div>
		<div class="form-group form-group--full-width">
			<label for="content">Message</label>
			<textarea
				aria-invalid={$errors.content ? 'true' : undefined}
				bind:value={$form.content}
				required
				name="content"
				id="content"
				rows="6"
				placeholder="What can I help you with..."
				{...$constraints.content}
			></textarea>
			{#if $errors?.content}
				<label class="error-label" for="content">{$errors.content}</label>
			{/if}
		</div>
		<div class="form-group">
			<Turnstile
				widgetId="turnstile"
				on:callback={handleTurnstileCb}
				siteKey={PUBLIC_CF_TURNSTILE_KEY}
			/>
			{#if $errors?.['cf-turnstile-response']}
				<label class="error-label" for="turnstile">{$errors.content}</label>
			{/if}
		</div>

		<button class="pico" type="submit" disabled={$submitting} aria-busy={$submitting}>
			Send Message
		</button>
	</form>
{/if}

<style>
	.success-message {
		display: grid;
		gap: 2.4rem;
		place-items: center;
		place-content: center;
		height: 100%;
	}

	.success-message-internal {
		display: grid;
		grid-auto-flow: column;
		gap: 2.4rem;
		place-items: center;
	}

	.checkmark {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		display: block;
		stroke-width: 2;
		stroke: #fff;
		stroke-miterlimit: 10;
		box-shadow: inset 0px 0px 0px hsl(137.52, 90.96%, 34.71%);
		animation:
			fill 0.4s ease-in-out 0.4s forwards,
			scale 0.3s ease-in-out 0.9s both;
	}

	.checkmark__circle {
		stroke-dasharray: 166;
		stroke-dashoffset: 166;
		stroke-width: 2;
		stroke-miterlimit: 10;
		stroke: hsl(137.52, 90.96%, 34.71%);
		fill: none;
		animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
	}

	.checkmark__check {
		transform-origin: 50% 50%;
		stroke-dasharray: 48;
		stroke-dashoffset: 48;
		animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
	}

	@keyframes stroke {
		100% {
			stroke-dashoffset: 0;
		}
	}
	@keyframes scale {
		0%,
		100% {
			transform: none;
		}
		50% {
			transform: scale3d(1.1, 1.1, 1);
		}
	}
	@keyframes fill {
		100% {
			box-shadow: inset 0px 0px 0px 30px hsl(137.52, 90.96%, 34.71%);
		}
	}

	.go-back {
		justify-self: center;
		align-self: start;
	}

	.contact-form {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.4rem;
		width: calc(var(--max-width) / 2);
		justify-content: stretch;
	}

	.form-group {
		display: grid;
		gap: 0.8rem;
	}

	.form-group--full-width {
		grid-column: 1 / -1;
	}

	.error-label {
		color: var(--theme-font-danger);
	}

	.contact-title {
		text-align: center;
		margin-bottom: 4rem;
		padding: 0 2rem;
	}

	.contact-title h2 {
		font-size: 3.6rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.contact-title p {
		font-size: 1.8rem;
		color: var(--theme-font-default);
		font-weight: 300;
		letter-spacing: 0.5px;
	}

	@media (max-width: 768px) {
		.contact-title h2 {
			font-size: 2.8rem;
		}

		.contact-title p {
			font-size: 1.6rem;
		}
	}

	@media (width <= 1200px) {
		.contact-form {
			width: calc(var(--max-width) / 1.8);
		}
	}

	@media (width <= 1000px) {
		.contact-form {
			width: calc(var(--max-width) / 1.6);
		}
	}

	@media (width <= 900px) {
		.contact-form {
			width: calc(var(--max-width) / 1.4);
		}
	}

	@media (width <= 750px) {
		.contact-form {
			width: calc(var(--max-width) / 1.2);
		}
	}
</style>
