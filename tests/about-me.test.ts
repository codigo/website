import { expect, test } from '@playwright/test';
import { mockChatAPI, mockChatAPIError } from './fixtures/routes';

test.describe('About Me Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/about-me');
	});

	test('displays About Me heading and bio text', async ({ page }) => {
		await expect(page.locator('h2').filter({ hasText: 'About Me' })).toBeVisible();
		await expect(page.getByText('Barranquilla, Colombia')).toBeVisible();
		await expect(page.getByText('Vancouver, Canada')).toBeVisible();
	});

	test('displays resume download link', async ({ page }) => {
		const downloadLink = page.getByRole('link', { name: /download resume/i });
		await expect(downloadLink).toBeVisible();
		await expect(downloadLink).toHaveAttribute('href', '/mm_resume.pdf');
		await expect(downloadLink).toHaveAttribute('download', '');
	});

	test('displays 6 skill categories', async ({ page }) => {
		const skills = [
			'Frontend and Backend Development',
			'Systems Design & Architecture',
			'Databases',
			'Integration & Automation',
			'Development Practices',
			'AI Systems'
		];
		for (const skill of skills) {
			await expect(page.getByText(skill)).toBeVisible();
		}
	});

	test('displays skills in 2-column grid on desktop', async ({ page, isMobile }) => {
		test.skip(!!isMobile, 'Desktop-only test');
		const skillsList = page.locator('.skills-competences-list');
		await expect(skillsList).toBeVisible();
		const style = await skillsList.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
		// Should have 2 columns on desktop (two values in gridTemplateColumns)
		const columns = style.split(' ').filter((v) => v !== '');
		expect(columns.length).toBe(2);
	});

	test('displays experience timeline heading', async ({ page }) => {
		await expect(
			page.locator('h3').filter({
				hasText: 'My professional journey is marked by significant contributions'
			})
		).toBeVisible();
	});
});

test.describe('Chatbot', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/about-me');
	});

	test('renders chatbot toggle button', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Toggle chatbot' })).toBeVisible();
	});

	test('shows prompt bubble after ~3 seconds', async ({ page }) => {
		await expect(page.locator('.prompt-bubble')).not.toBeVisible();
		await expect(page.locator('.prompt-bubble')).toBeVisible({ timeout: 5000 });
		await expect(page.getByText('Have any questions about Mau?')).toBeVisible();
	});

	test('dismisses prompt bubble on dismiss click', async ({ page }) => {
		await expect(page.locator('.prompt-bubble')).toBeVisible({ timeout: 5000 });
		await page.getByRole('button', { name: 'Dismiss' }).click();
		await expect(page.locator('.prompt-bubble')).not.toBeVisible();
	});

	test('opens chat window and shows welcome message', async ({ page }) => {
		await page.getByRole('button', { name: 'Toggle chatbot' }).click();
		await expect(page.locator('.chatbot-container')).toBeVisible();
		await expect(page.locator('.chatbot-header h3')).toHaveText('Ask About Mauricio');
		await expect(
			page.getByText("Hi! I'm an AI assistant here to answer questions about Mauricio")
		).toBeVisible();
	});

	test('send button is disabled when input is empty', async ({ page }) => {
		await page.getByRole('button', { name: 'Toggle chatbot' }).click();
		await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
	});

	test('closes chat on close button click', async ({ page }) => {
		await page.getByRole('button', { name: 'Toggle chatbot' }).click();
		await expect(page.locator('.chatbot-container')).toBeVisible();
		await page.getByRole('button', { name: 'Close chat' }).click();
		await expect(page.locator('.chatbot-container')).not.toBeVisible();
	});

	test('sends message and displays streaming response', async ({ page }) => {
		await mockChatAPI(page, 'Mauricio is a backend and AI integration engineer');
		await page.getByRole('button', { name: 'Toggle chatbot' }).click();

		const input = page.locator('.chatbot-input input');
		await input.fill('What does Mauricio do?');
		await page.getByRole('button', { name: 'Send message' }).click();

		// User message should appear
		await expect(page.locator('.message.user')).toContainText('What does Mauricio do?');
		// AI response should stream in
		await expect(page.locator('.message.assistant').last()).toContainText(
			'Mauricio is a backend and AI integration engineer'
		);
	});

	test('shows error message when API fails', async ({ page }) => {
		await mockChatAPIError(page);
		await page.getByRole('button', { name: 'Toggle chatbot' }).click();

		const input = page.locator('.chatbot-input input');
		await input.fill('Test question');
		await page.getByRole('button', { name: 'Send message' }).click();

		await expect(page.locator('.error-message')).toBeVisible();
	});
});
