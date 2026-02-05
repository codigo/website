# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio/blog built with SvelteKit and TypeScript. It features:

- Personal portfolio with experiences and tech stack showcase
- Blog/journal functionality powered by PocketBase
- AI-powered semantic search for journal posts using OpenAI embeddings
- Markdown content processing with mdsvex
- Tailwind CSS v4 for styling
- Full-stack application with Node.js adapter

## Development Commands

### Core Development

- `npm run dev` - Start development server (uses 1Password CLI for env vars)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing

- `npm test` - Run all tests (integration + unit)
- `npm run test:integration` - Run Playwright integration tests
- `npm run test:unit` - Run Vitest unit tests
- `npm run test:unit:watch` - Run unit tests in watch mode

### Code Quality

- `npm run lint` - Check formatting and linting (Prettier + ESLint)
- `npm run format` - Auto-format code with Prettier
- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run type checking in watch mode

### Utility Scripts

- `node bin/getUnsplashInfo.js <API_KEY> <PHOTO_ID>` - Fetch Unsplash photo metadata
- `node bin/createAboutMeSummary.js [OUTPUT_PATH]` - Generate about-me summary from experiences
- `npm run embeddings:generate` - Generate embeddings for posts without them
- `npm run embeddings:regenerate` - Regenerate all embeddings

## Architecture

### Tech Stack

- **Runtime**: Node.js 24.8.0 (npm 11.6.0)
- **Framework**: SvelteKit with Svelte 5 (Runes)
- **Language**: TypeScript throughout
- **Styling**: Tailwind CSS v4 with component-based architecture
- **Backend**: Node.js adapter with PocketBase integration
- **Content**: Markdown processing via mdsvex
- **Testing**: Playwright (integration) + Vitest v4 (unit)
- **Images**: Enhanced image processing with `@sveltejs/enhanced-img`
- **AI**: OpenAI GPT-5 Nano for chatbot functionality

### Directory Structure

```dir
src/
├── components/           # Reusable Svelte components
│   ├── icons/           # Tech and social icons
│   └── Testimonials/    # Testimonial carousel components
├── constants/           # App constants (techStack.ts)
├── lib/                # Shared utilities and services
│   ├── components/     # Component utilities
│   ├── services/       # API services and business logic
│   └── stores/         # Svelte stores for state management
├── routes/             # SvelteKit file-based routing
│   ├── experiences/    # Markdown files for work experience
│   ├── about-me/       # About page with generated content
│   ├── contact/        # Contact form
│   └── journal/        # Blog/journal pages
└── types/              # TypeScript type definitions
```

### Key Configuration

- **Aliases**: `$components` → `./src/components`, `$routes` → `./src/routes`
- **Preprocessing**: Vite + mdsvex for markdown
- **Adapter**: `@sveltejs/adapter-node` for deployment
- **Pre-commit**: Auto-formatting enforced via hooks

### Content Management

- Experience content stored as markdown files in `src/routes/experiences/`
- Tech stack configuration in `src/constants/techStack.ts` with icon components
- Blog content managed through PocketBase backend
- Generated "about me" summaries combining experiences and tech stack

### Styling Approach

- Tailwind CSS v4 as primary styling system
- Component-scoped styles when needed
- Responsive design with mobile-first approach
- Icon system with custom SVG components

### Testing Strategy

- Unit tests for utilities and business logic (Vitest)
- Integration tests for user flows (Playwright)
- Type safety enforced via TypeScript compilation
- Pre-commit hooks ensure code quality

## PocketBase Integration

The application uses PocketBase as a backend service for dynamic content, particularly the blog/journal functionality. Ensure PocketBase is configured and running when working on blog-related features.

## AI Semantic Search for Journal Posts

The journal features AI-powered semantic search that understands the meaning of queries, not just keywords. This allows users to find relevant posts using natural language queries like "TypeScript performance tips" or "posts about React hooks."

### Implementation Details

- **AI Summaries**: GPT-4o-mini generates search-optimized summaries extracting key concepts
- **Vector Embeddings**: OpenAI text-embedding-3-small creates 1536-dimensional vectors
- **Similarity Search**: Cosine similarity matching finds relevant posts by semantic meaning
- **Storage**: Embeddings and AI summaries stored directly in PocketBase (no external vector DB needed)
- **Automatic Generation**: PocketBase realtime subscriptions automatically generate embeddings when posts are created/updated

### Components

1. **SearchBar Component** (`src/components/SearchBar.svelte`)
   - Pico CSS styled search input
   - Debounced search-as-you-type (500ms delay)
   - Real-time results dropdown with match scores
   - Responsive design matching contact form styling

2. **Search API** (`src/routes/api/journal/search/+server.ts`)
   - POST endpoint accepting natural language queries
   - Generates query embedding via OpenAI
   - Performs in-memory cosine similarity calculation
   - Returns top matches with similarity scores

3. **Embedding Generation API** (`src/routes/api/journal/generate-embeddings/+server.ts`)
   - Batch processes posts to generate AI summaries and embeddings
   - Single post mode: process specific post by ID
   - Can regenerate embeddings for existing posts
   - Supports incremental processing with limit parameter

4. **Automatic Generation** (`src/lib/services/postEmbeddingSubscription.ts`)
   - Subscribes to PocketBase posts collection via realtime API
   - Automatically generates embeddings when posts are created/updated
   - Activated in `src/hooks.server.ts` on app startup
   - Skips posts that already have embeddings

5. **Utilities**
   - `src/lib/services/embeddings.ts` - AI summary and embedding generation
   - `src/lib/utils/vectorSearch.ts` - Cosine similarity and search algorithms
   - `bin/generateEmbeddings.js` - Standalone CLI script for batch processing

### Database Schema

PocketBase `posts` collection includes:

- `ai_summary` (Text, optional) - AI-generated search-optimized summary
- `embedding` (JSON, optional) - 1536-dimensional vector array

### Cost & Performance

- **Per post**: ~$0.000035 (AI summary + embedding generation)
- **Per search**: ~$0.00002 (query embedding only)
- **Performance**: In-memory cosine similarity handles < 1000 posts efficiently
- **Migration Path**: Can move to Pinecone or TrailBase for > 1000 posts if needed

### Setup Guide

See `SEMANTIC_SEARCH_SETUP.md` for complete setup instructions including:

- PocketBase schema updates
- Generating embeddings for existing posts
- Testing and troubleshooting

## Image Handling

Images are processed through `@sveltejs/enhanced-img` for optimization. Use the enhanced image components for better performance and responsive behavior.

## AI Chatbot Integration

The about-me page includes an AI-powered chatbot that answers questions about Mauricio's experience and skills.

### Implementation Details

- **Model**: OpenAI GPT-5 Nano - optimized for fast, low-latency Q&A interactions
- **Pricing**: $0.05/1M input tokens, $0.40/1M output tokens
- **Context Window**: 400K tokens
- **API**: Chat Completions API (fully supported, industry standard)

### Components

1. **Chatbot UI Component** (`src/components/Chatbot.svelte`)
   - Fixed position floating chat button with gradient styling
   - Expandable chat window with message history
   - Built with Svelte 5 runes ($state, $effect)
   - Responsive design for mobile and desktop
   - Loading states and error handling

2. **API Endpoint** (`src/routes/api/chat/+server.ts`)
   - POST endpoint for chat requests
   - Validates message format
   - Generates context from experiences and tech stack
   - Caches context for performance
   - Returns AI responses with error handling

3. **Context Generator** (`src/lib/services/aboutMeContext.ts`)
   - Dynamically generates context from markdown experiences
   - Reads tech stack from `src/constants/techStack.ts`
   - Prevents hallucinations by using only factual content
   - Same logic as `bin/createAboutMeSummary.js` script

### Environment Variables

Requires `SECRET_OPENAI_API_KEY` to be set in the environment (managed via 1Password CLI in dev mode).

### Usage

The chatbot appears on the about-me page as a floating button in the bottom-right corner. Visitors can click to ask questions about Mauricio's experience, skills, projects, and interests. The AI only responds based on the content in the experiences markdown files and tech stack configuration.

## Package Versions & Configuration

### Current Package Versions

The project uses the following major package versions:

- **Vitest**: 4.0.7 (with new module-runner architecture, requires Vite 6+)
- **Zod**: 4.1.12 (uses `zod4` and `zod4Client` adapters with sveltekit-superforms)
- **UUID**: 13.0.0 (ESM-only, browser exports as default)
- **Tailwind-variants**: 3.1.1 (includes `tailwind-merge` dependency)
- **Pino**: 10.1.0 (logging library)
- **Svelte**: 5.43.3
- **SvelteKit**: 2.48.4
- **TypeScript**: 5.9.3
- **ESLint**: 9.39.1
- **Tailwind CSS**: 4.1.16
- **Playwright**: 1.56.1

### Infrastructure Configuration

- **Dockerfile**: Uses `node:24-slim` base image
- **GitHub Actions**: Uses Node 24 for all workflows
- **Environment Variables**: `SECRET_OPENAI_API_KEY` is configured in all workflows for build compatibility

### Deployment Architecture

The application is deployed as a **standalone Docker stack** using Docker contexts, separating infrastructure management from application deployment:

#### Infrastructure (Pulumi - `services/` repository)

- VPS provisioning (Hetzner)
- SSH key configuration
- Docker Swarm initialization
- Cloudflare Tunnel setup
- Caddy reverse proxy setup
- Generic tooling (Dozzle, monitoring)

#### Application Deployment (Docker Context - this repository)

- GitHub Actions builds and pushes Docker image
- Deployment happens via Docker context over SSH:
  ```bash
  docker context create vps --docker "host=ssh://codigo@VPS_IP"
  docker --context vps stack deploy --compose-file docker-compose.yml mau-app
  ```
- No Pulumi needed for app deployment
- PocketBase migrations run automatically on startup

#### Docker Compose Configuration

The `docker-compose.yml` supports both development and production via environment variables:

**Development** (`.env.example`):

- `NETWORK_DRIVER=bridge` - Local bridge network
- `CADDY_NET_EXTERNAL=false` - No external Caddy network
- `PB_DATA_PATH=./pb/pb_data` - Local PocketBase data
- `DEBUG=true` - Enable debug mode

**Production** (GitHub Actions env vars):

- `NETWORK_DRIVER=overlay` - Docker Swarm overlay network
- `CADDY_NET_EXTERNAL=true` - Connect to existing Caddy network
- `PB_DATA_PATH=/home/codigo/mau-app/data/pocketbase/pb_data` - VPS persistent storage
- `DEBUG=false` - Production mode

#### Caddy Routing

Only publicly exposed services need Caddy routes in `services/tooling/data/caddy/Caddyfile`:

- `mau-app-codigo:3000` → codigo.sh, maumercado.com
- `pocketbase:8090` → pocketbase.codigo.sh (admin UI)
- `dozzle:8080` → dozzle.codigo.sh (monitoring)

Internal service-to-service communication (e.g., mau-app → pocketbase) happens via Docker network and does not require Caddy routes.

### Important Notes

- **Form Validation**: Always use `zod4` and `zod4Client` adapters (not `zod`/`zodClient`) in contact forms and server routes
- **Known Deprecations**: Svelte 5 shows deprecation warning for `<slot>` element (non-breaking, should migrate to `{@render ...}` tags)
