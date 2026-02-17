import { expect, test } from '@playwright/test';

test.describe('Layout and Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('renders header with all nav links', async ({ page, viewport }) => {
		await expect(page.locator('header')).toBeVisible();
		const links = ['Home', 'About me', 'Journal', 'Contact me'];

		if (viewport && viewport.width < 780) {
			// On mobile, links are hidden behind hamburger menu — open it first
			await page.getByRole('button', { name: /menu/i }).click({ force: true });
			await expect(page.locator('.main-nav-list.open')).toBeVisible();
		}

		for (const name of links) {
			await expect(page.getByRole('link', { name })).toBeVisible();
		}
	});

	test('highlights active nav link for current page', async ({ page, viewport }) => {
		if (viewport && viewport.width < 780) {
			await page.getByRole('button', { name: /menu/i }).click({ force: true });
		}
		const homeLink = page.locator('.main-nav-link.active');
		await expect(homeLink).toBeVisible();
		await expect(homeLink).toHaveText('Home');
	});

	test('navigates to each page via nav links', async ({ page, viewport }) => {
		if (viewport && viewport.width < 780) {
			await page.getByRole('button', { name: /menu/i }).click({ force: true });
		}
		await page.getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL(/\/about-me/);

		if (viewport && viewport.width < 780) {
			await page.getByRole('button', { name: /menu/i }).click({ force: true });
		}
		await page.getByRole('link', { name: 'Contact me' }).click();
		await expect(page).toHaveURL(/\/contact/);

		if (viewport && viewport.width < 780) {
			await page.getByRole('button', { name: /menu/i }).click({ force: true });
		}
		await page.getByRole('link', { name: 'Home' }).click();
		await expect(page).toHaveURL('/');
	});

	test('renders footer with current year', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer).toBeVisible();
		await expect(footer).toContainText(new Date().getFullYear().toString());
	});
});

test.describe('Mobile Navigation', () => {
	test.use({ viewport: { width: 375, height: 667 } });

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('shows hamburger menu and hides nav links on mobile', async ({ page }) => {
		await expect(page.locator('.hamburger-menu')).toBeVisible();
		await expect(page.locator('.main-nav-list')).not.toBeVisible();
	});

	test('opens nav menu on hamburger click', async ({ page }) => {
		await page.getByRole('button', { name: /menu/i }).click({ force: true });
		await expect(page.locator('.main-nav-list.open')).toBeVisible();
		await expect(page.getByRole('link', { name: 'About me' })).toBeVisible();
	});

	test('closes menu when a link is clicked', async ({ page }) => {
		await page.getByRole('button', { name: /menu/i }).click({ force: true });
		await expect(page.locator('.main-nav-list.open')).toBeVisible();

		await page.getByRole('link', { name: 'About me' }).click({ force: true });
		await expect(page.locator('.main-nav-list.open')).not.toBeVisible();
	});

	test('closes menu on second hamburger click', async ({ page }) => {
		await page.getByRole('button', { name: /menu/i }).click({ force: true });
		await expect(page.locator('.main-nav-list.open')).toBeVisible();

		await page.getByRole('button', { name: /menu/i }).click({ force: true });
		await expect(page.locator('.main-nav-list.open')).not.toBeVisible();
	});
});
