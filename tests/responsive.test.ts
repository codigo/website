import { expect, test } from '@playwright/test';

test.describe('Responsive Design', () => {
	test.describe('Mobile viewport (375x667)', () => {
		test.use({ viewport: { width: 375, height: 667 } });

		test('shows hamburger menu on mobile', async ({ page }) => {
			await page.goto('/');
			await expect(page.locator('.hamburger-menu')).toBeVisible();
			await expect(page.locator('.main-nav-list')).not.toBeVisible();
		});

		test('skills grid shows single column on mobile', async ({ page }) => {
			await page.goto('/about-me');
			const skillsList = page.locator('.skills-competences-list');
			await expect(skillsList).toBeVisible();
			const style = await skillsList.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
			// Single column means one value in gridTemplateColumns
			const columns = style.split(' ').filter((v) => v !== '');
			expect(columns.length).toBe(1);
		});

		test('chatbot toggle adjusts size on mobile', async ({ page }) => {
			await page.goto('/about-me');
			const toggle = page.locator('.chatbot-toggle');
			await expect(toggle).toBeVisible();
			const box = await toggle.boundingBox();
			expect(box).not.toBeNull();
			// Mobile toggle should be smaller (5.6rem ≈ 56px at 10px base)
			expect(box!.width).toBeLessThanOrEqual(60);
		});

		test('contact form renders on mobile without overflow', async ({ page }) => {
			await page.goto('/contact');
			const form = page.locator('.contact-form');
			await expect(form).toBeVisible();
			const box = await form.boundingBox();
			expect(box).not.toBeNull();
			// Form should not exceed viewport width
			expect(box!.width).toBeLessThanOrEqual(375);
		});

		test('contact title starts below fixed header on mobile', async ({ page }) => {
			await page.goto('/contact');
			const headerBox = await page.locator('.header').boundingBox();
			const titleBox = await page.locator('.contact-title').boundingBox();

			expect(headerBox).not.toBeNull();
			expect(titleBox).not.toBeNull();
			expect(titleBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
		});
	});

	test.describe('Desktop viewport (1280x720)', () => {
		test.use({ viewport: { width: 1280, height: 720 } });

		test('hides hamburger menu on desktop', async ({ page }) => {
			await page.goto('/');
			await expect(page.locator('.hamburger-menu')).not.toBeVisible();
			await expect(page.locator('.main-nav-list')).toBeVisible();
		});

		test('skills grid shows two columns on desktop', async ({ page }) => {
			await page.goto('/about-me');
			const skillsList = page.locator('.skills-competences-list');
			await expect(skillsList).toBeVisible();
			const style = await skillsList.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
			const columns = style.split(' ').filter((v) => v !== '');
			expect(columns.length).toBe(2);
		});

		test('journal search starts below fixed header on desktop', async ({ page }) => {
			await page.goto('/journal/page/1');
			const headerBox = await page.locator('.header').boundingBox();
			const searchBox = await page.locator('.search-wrapper').boundingBox();

			expect(headerBox).not.toBeNull();
			expect(searchBox).not.toBeNull();
			expect(searchBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
		});
	});
});
