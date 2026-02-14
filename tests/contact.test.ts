import { expect, test } from '@playwright/test';

test.describe('Contact Form', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/contact');
	});

	test('displays heading and subtitle', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
		await expect(page.getByText("Let's discuss your next project")).toBeVisible();
	});

	test('displays name, email, and message fields', async ({ page }) => {
		await expect(page.getByLabel('Name')).toBeVisible();
		await expect(page.getByLabel('Email')).toBeVisible();
		await expect(page.getByLabel('Message')).toBeVisible();
	});

	test('displays Send Message button', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
	});

	test('shows validation error for empty name on submit', async ({ page }) => {
		// Fill email and message but leave name empty
		await page.getByLabel('Email').fill('test@example.com');
		await page.getByLabel('Message').fill('This is a test message with enough length');
		await page.getByRole('button', { name: 'Send Message' }).click();

		// The browser's native validation or superforms validation should trigger
		const nameInput = page.getByLabel('Name');
		const isInvalid = await nameInput.getAttribute('aria-invalid');
		const validationMessage = await nameInput.evaluate(
			(el: HTMLInputElement) => el.validationMessage
		);
		expect(isInvalid === 'true' || validationMessage.length > 0).toBe(true);
	});

	test('shows validation error for invalid email', async ({ page }) => {
		await page.getByLabel('Name').fill('Test User');
		await page.getByLabel('Email').fill('not-an-email');
		await page.getByLabel('Message').fill('This is a test message with enough length');
		await page.getByRole('button', { name: 'Send Message' }).click();

		const emailInput = page.getByLabel('Email');
		const isInvalid = await emailInput.getAttribute('aria-invalid');
		const validationMessage = await emailInput.evaluate(
			(el: HTMLInputElement) => el.validationMessage
		);
		expect(isInvalid === 'true' || validationMessage.length > 0).toBe(true);
	});

	test('form renders without crashing when Turnstile fails to load', async ({ page }) => {
		// In test env, Turnstile won't load - form should still be functional
		await expect(page.getByRole('button', { name: 'Send Message' })).toBeEnabled();
		await expect(page.getByLabel('Name')).toBeEnabled();
	});
});
