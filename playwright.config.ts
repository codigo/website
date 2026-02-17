import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	timeout: 30000,
	expect: { timeout: 5000 },
	retries: process.env.CI ? 1 : 0,
	use: {
		baseURL: 'http://localhost:4173'
	},
	projects: [
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'mobile',
			use: { ...devices['Pixel 5'] }
		}
	]
});
