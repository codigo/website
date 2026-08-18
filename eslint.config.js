import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'pb_data/', 'pb/', '.worktrees/']
	},
	{
		files: ['**/*.svelte'],
		rules: {
			// TypeScript typed routes via $app/paths already enforce correct route usage;
			// disabling this rule to allow static asset hrefs (e.g. /mm_resume.pdf)
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
];
