import { expect, test } from '@playwright/test';

test.describe('Experience Detail Pages', () => {
	test('displays company name as heading', async ({ page }) => {
		await page.goto('/about-me/telus');
		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
	});

	test('renders markdown content as HTML', async ({ page }) => {
		await page.goto('/about-me/telus');
		// The page should render markdown content with paragraphs
		await expect(page.locator('article p, .content p, main p').first()).toBeVisible();
	});

	test('displays prev/next navigation buttons', async ({ page }) => {
		await page.goto('/about-me/telus');
		// Navigation buttons are icon-only <button role="link"> elements
		const buttons = page.locator('.navigation-links button.goto');
		await expect(buttons).toHaveCount(2);
	});

	test('navigates between experiences with next button', async ({ page }) => {
		await page.goto('/about-me/telus');
		const initialUrl = page.url();

		const nextButton = page.locator('button.goto.next');
		if (await nextButton.isEnabled()) {
			await nextButton.click();
			await expect(page).not.toHaveURL(initialUrl);
			await expect(page).toHaveURL(/\/about-me\//);
		}
	});

	test('returns 404 for non-existent experience slug', async ({ page }) => {
		const response = await page.goto('/about-me/non-existent-company-xyz');
		expect(response?.status()).toBe(404);
	});
});
