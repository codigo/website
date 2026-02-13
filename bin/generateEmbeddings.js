#!/usr/bin/env node

/**
 * Standalone script to generate embeddings for all posts without embeddings
 * Used during deployment and can be run manually
 *
 * Usage:
 *   node bin/generateEmbeddings.js [--regenerate] [--limit N]
 *
 * Options:
 *   --regenerate  Regenerate embeddings even if they already exist
 *   --limit N     Process only N posts (useful for testing)
 *
 * Environment variables:
 *   PUBLIC_POCKETBASE_URL - PocketBase URL
 *   SECRET_OPENAI_API_KEY - OpenAI API key
 */

import PocketBase from 'pocketbase';

// Get environment variables
const POCKETBASE_URL = process.env.PUBLIC_POCKETBASE_URL;
const OPENAI_API_KEY = process.env.SECRET_OPENAI_API_KEY;
const ADMIN_EMAIL = process.env.SECRET_POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SECRET_POCKETBASE_ADMIN_PASSWORD;

if (!POCKETBASE_URL) {
	console.error('❌ Error: PUBLIC_POCKETBASE_URL environment variable is not set');
	process.exit(1);
}

if (!OPENAI_API_KEY) {
	console.error('❌ Error: SECRET_OPENAI_API_KEY environment variable is not set');
	process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
	console.error(
		'❌ Error: SECRET_POCKETBASE_ADMIN_EMAIL and SECRET_POCKETBASE_ADMIN_PASSWORD environment variables are required'
	);
	console.error('   These credentials are needed to authenticate with PocketBase to update posts');
	process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const regenerate = args.includes('--regenerate');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : undefined;

console.log('🚀 Starting embedding generation...');
console.log(`📋 Config: regenerate=${regenerate}, limit=${limit || 'all'}`);

// Initialize PocketBase
const pb = new PocketBase(POCKETBASE_URL);

/**
 * NOTE: The functions below (cleanContentForAI, generateEmbedding, generateAISummary,
 * generatePostEmbedding) are duplicated from src/lib/services/embeddings.ts.
 * They cannot be shared directly because the SvelteKit module uses $env/static/private
 * imports which are unavailable in standalone Node.js scripts.
 * If you update the logic here, update src/lib/services/embeddings.ts as well (and vice versa).
 */

/**
 * Cleans markdown content by removing images and truncating to a reasonable length.
 * This prevents sending massive amounts of image data to OpenAI API.
 */
function cleanContentForAI(content, maxLength = 100000) {
	// Remove base64-encoded images: ![alt](data:image/...)
	let cleaned = content.replace(/!\[([^\]]*)\]\(data:image\/[^)]+\)/g, '');

	// Remove markdown image references: ![alt](url)
	cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

	// Remove HTML img tags
	cleaned = cleaned.replace(/<img[^>]*>/gi, '');

	// Remove HTML picture tags
	cleaned = cleaned.replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '');

	// Trim whitespace
	cleaned = cleaned.trim();

	// Truncate if still too long
	if (cleaned.length > maxLength) {
		cleaned = cleaned.substring(0, maxLength) + '...';
	}

	return cleaned;
}

/**
 * Generate embedding from OpenAI
 */
async function generateEmbedding(text) {
	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'text-embedding-3-small',
			input: text,
			encoding_format: 'float'
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${error}`);
	}

	const data = await response.json();
	return data.data[0].embedding;
}

/**
 * Generate AI summary from OpenAI
 */
async function generateAISummary(title, content) {
	// Clean content by removing images and truncating
	const cleanedContent = cleanContentForAI(content);

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are a content analyzer that creates search-optimized summaries.
Extract key concepts, topics, themes, and important keywords from blog posts.
Focus on what makes this content unique and searchable.
Keep summaries concise (2-3 sentences, max 150 words) but information-dense.
Include technical terms, frameworks, tools, and concepts mentioned.`
				},
				{
					role: 'user',
					content: `Title: ${title}\n\nContent:\n${cleanedContent}\n\nGenerate a search-optimized summary:`
				}
			],
			temperature: 0.3,
			max_tokens: 200
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${error}`);
	}

	const data = await response.json();
	return data.choices[0].message.content.trim();
}

/**
 * Generate embedding for a post
 */
async function generatePostEmbedding(title, aiSummary, content) {
	// Clean content by removing images and truncating
	const cleanedContent = cleanContentForAI(content);
	const combinedText = `${title}\n\n${aiSummary}\n\n${cleanedContent}`;
	return await generateEmbedding(combinedText);
}

/**
 * Main function
 */
async function main() {
	try {
		// Authenticate with PocketBase
		console.log('🔐 Authenticating with PocketBase...');
		console.log(`   Using email: ${ADMIN_EMAIL}`);
		console.log(`   PocketBase URL: ${POCKETBASE_URL}\n`);

		try {
			await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
			console.log('✅ Authentication successful\n');
		} catch (authError) {
			console.error('❌ Authentication failed!');
			console.error('   Error:', authError.message);
			console.error('\n💡 Troubleshooting:');
			console.error('   1. Check if your PocketBase user account exists');
			console.error(
				`   2. Open ${POCKETBASE_URL}/_/ and verify the user has permissions to update posts`
			);
			console.error(
				'   3. Verify SECRET_POCKETBASE_ADMIN_EMAIL and SECRET_POCKETBASE_ADMIN_PASSWORD are correct'
			);
			console.error('   4. Create a user account with proper permissions if needed\n');
			throw authError;
		}

		// Fetch all published posts
		console.log('📥 Fetching posts from PocketBase...');
		const posts = await pb.collection('posts').getFullList({
			filter: 'publish=true',
			sort: '-created'
		});

		console.log(`✅ Found ${posts.length} published posts`);

		// Filter posts that need processing
		let postsToProcess = posts;
		if (!regenerate) {
			postsToProcess = posts.filter((post) => !post.embedding || !post.ai_summary);
		}

		// Apply limit if specified
		if (limit && limit > 0) {
			postsToProcess = postsToProcess.slice(0, limit);
		}

		console.log(`🔄 Processing ${postsToProcess.length} posts...\n`);

		if (postsToProcess.length === 0) {
			console.log('✅ All posts already have embeddings. Nothing to do!');
			process.exit(0);
		}

		const results = {
			success: 0,
			failed: 0,
			errors: []
		};

		// Process each post
		for (let i = 0; i < postsToProcess.length; i++) {
			const post = postsToProcess[i];
			const progress = `[${i + 1}/${postsToProcess.length}]`;

			try {
				console.log(`${progress} Processing: "${post.title}"`);

				// Generate AI summary if missing
				let aiSummary = post.ai_summary;
				if (!aiSummary || regenerate) {
					console.log(`  ├─ Generating AI summary...`);
					aiSummary = await generateAISummary(post.title, post.content);
				}

				// Generate embedding
				console.log(`  ├─ Generating embedding...`);
				const embedding = await generatePostEmbedding(post.title, aiSummary, post.content);

				// Update post in PocketBase
				console.log(`  └─ Saving to PocketBase...`);
				await pb.collection('posts').update(post.id, {
					ai_summary: aiSummary,
					embedding: embedding
				});

				console.log(`  ✅ Success!\n`);
				results.success++;
			} catch (error) {
				console.error(`  ❌ Failed: ${error.message}\n`);
				results.failed++;
				results.errors.push({
					postId: post.id,
					title: post.title,
					error: error.message
				});
			}
		}

		// Print summary
		console.log('\n' + '='.repeat(60));
		console.log('📊 SUMMARY');
		console.log('='.repeat(60));
		console.log(`✅ Successful: ${results.success}`);
		console.log(`❌ Failed: ${results.failed}`);
		console.log(`📝 Total processed: ${postsToProcess.length}`);

		if (results.errors.length > 0) {
			console.log('\n❌ Errors:');
			results.errors.forEach((err) => {
				console.log(`  - ${err.title}: ${err.error}`);
			});
		}

		// Clear auth state
		pb.authStore.clear();

		// Exit with error code if any failed
		process.exit(results.failed > 0 ? 1 : 0);
	} catch (error) {
		console.error('❌ Fatal error:', error.message);
		// Clear auth state on error too
		pb.authStore.clear();
		process.exit(1);
	}
}

main();
