import { expect, test } from '@playwright/test';
import { mockSearchAPI, mockSearchAPIEmpty, mockSearchAPIError } from './fixtures/routes';

test.describe('Journal Redirect', () => {
	test('redirects /journal to /journal/page/1', async ({ page }) => {
		await page.goto('/journal');
		await expect(page).toHaveURL(/\/journal\/page\/1/);
	});
});

test.describe('SearchBar', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/journal/page/1');
	});

	test('displays search input with placeholder', async ({ page }) => {
		const searchInput = page.getByPlaceholder('Search posts...');
		await expect(searchInput).toBeVisible();
	});

	test('shows loading state while searching', async ({ page }) => {
		// Delay the API response to catch loading state
		await page.route('**/api/journal/search', async (route) => {
			await new Promise((r) => setTimeout(r, 1000));
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ results: [], query: 'test', total: 0 })
			});
		});

		await page.getByPlaceholder('Search posts...').fill('test query');
		await expect(page.getByPlaceholder('Search posts...')).toHaveAttribute('aria-busy', 'true');
		await expect(page.getByText('Searching...')).toBeVisible();
		await expect(page.locator('.loading-spinner')).toBeVisible();
	});

	test('displays search results after typing', async ({ page }) => {
		await mockSearchAPI(page);
		await page.getByPlaceholder('Search posts...').fill('typescript');

		// Wait for debounce + response
		await expect(page.locator('.results-dropdown')).toBeVisible({ timeout: 3000 });
		await expect(page.locator('.results-list li')).toHaveCount(3);
	});

	test('shows result title, summary, and score', async ({ page }) => {
		await mockSearchAPI(page);
		await page.getByPlaceholder('Search posts...').fill('typescript');

		await expect(page.locator('.results-dropdown')).toBeVisible({ timeout: 3000 });
		await expect(page.locator('.result-main h3').first()).toBeVisible();
		await expect(page.locator('.result-main p').first()).toBeVisible();
		await expect(page.locator('.score').first()).toBeVisible();
	});

	test('shows "No results found" for empty results', async ({ page }) => {
		await mockSearchAPIEmpty(page);
		await page.getByPlaceholder('Search posts...').fill('xyznonexistent');

		await expect(page.getByText('No results found')).toBeVisible({ timeout: 3000 });
	});

	test('shows "Search failed" when API errors', async ({ page }) => {
		await mockSearchAPIError(page);
		await page.getByPlaceholder('Search posts...').fill('test error');

		await expect(page.getByText('Search failed')).toBeVisible({ timeout: 3000 });
	});

	test('closes results when clicking outside', async ({ page }) => {
		await mockSearchAPI(page);
		await page.getByPlaceholder('Search posts...').fill('typescript');
		await expect(page.locator('.results-dropdown')).toBeVisible({ timeout: 3000 });

		// Click outside the search wrapper
		await page.locator('body').click({ position: { x: 10, y: 10 } });
		await expect(page.locator('.results-dropdown')).not.toBeVisible();
	});
});

test.describe('Pagination', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/journal/page/1');
	});

	test('displays pagination nav with aria-label', async ({ page }) => {
		await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
	});

	test('disables previous button on page 1', async ({ page }) => {
		const prevButton = page.getByRole('link', { name: 'Previous page' });
		await expect(prevButton).toHaveClass(/disabled/);
	});

	test('highlights current page with aria-current', async ({ page }) => {
		const activePage = page.locator('[aria-current="page"]');
		await expect(activePage).toBeVisible();
		await expect(activePage).toHaveText('1');
	});
});
