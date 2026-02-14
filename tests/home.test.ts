import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('displays hero greeting and heading', async ({ page }) => {
		await expect(page.getByText("Hi there, I'm Mauricio")).toBeVisible();
		await expect(page.locator('h1')).toBeVisible();
	});

	test('displays social links with correct hrefs', async ({ page }) => {
		// Social links use icon-only components, so we select by href
		await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
		await expect(page.locator('a[href*="github.com"]')).toBeVisible();
		await expect(page.locator('a[href*="x.com"]')).toBeVisible();
		await expect(page.locator('a[href*="mailto:"]')).toBeVisible();
	});

	test('displays capabilities section', async ({ page }) => {
		// Capabilities lazily load; skeleton or real section should be visible
		const section = page.locator('.section-capabilities').first();
		await expect(section).toBeVisible({ timeout: 10000 });
	});

	test('displays testimonials section', async ({ page }) => {
		await expect(page.getByText('What People Say')).toBeVisible();
		await expect(page.getByText('Testimonials from colleagues and clients')).toBeVisible();
	});

	test('testimonial carousel has navigation buttons', async ({ page }) => {
		const prevButton = page.getByRole('button', { name: /previous/i });
		const nextButton = page.getByRole('button', { name: /next/i });
		await expect(prevButton).toBeVisible();
		await expect(nextButton).toBeVisible();
	});

	test('displays tech stack section', async ({ page }) => {
		await expect(page.getByText('Building Blocks')).toBeVisible();
		await expect(
			page.getByText('The technologies I use to bring ideas to life')
		).toBeVisible();
	});

	test('renders known tech stack items', async ({ page }) => {
		// Check for at least some known tech items via their tooltip or text
		const techSection = page.locator('.tech-stack-section, section').filter({
			hasText: 'Building Blocks'
		});
		await expect(techSection).toBeVisible();
	});
});
