# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio/blog built with SvelteKit and TypeScript. It features:

- Personal portfolio with experiences and tech stack showcase
- Blog/journal functionality powered by PocketBase
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

## Package Management & Upgrades

### Major Version Upgrades (November 2025)

The project was upgraded to Node.js 24.8.0 with the following major package updates:

**Breaking Changes & Migrations:**

1. **Vitest 3.x → 4.0.7**
   - Upgraded to Vitest 4 with new module-runner architecture
   - Requires Vite 6+ (currently on Vite 7)
   - Reporter changes: verbose reporter now shows list format instead of tree
   - Type system cleanup (deprecated types removed)
   - All tests passing with new version

2. **Zod 3.x → 4.1.12**
   - Upgraded to Zod 4 with improved validation
   - **Migration Required**: Updated `sveltekit-superforms` adapters from `zod/zodClient` to `zod4/zod4Client`
   - Changed imports in contact form: `src/routes/contact/+page.server.ts` and `src/routes/contact/+page.svelte`
   - All form validation working correctly

3. **UUID 11.x → 13.0.0**
   - v12 dropped CommonJS support (project uses ESM ✓)
   - v13 changed to browser exports as default
   - No code changes required

4. **Tailwind-variants 1.x → 3.1.1**
   - Main change: introduction of `/lite` build variant
   - Standard build now includes `tailwind-merge` statically
   - Project already has `tailwind-merge` as explicit dependency ✓
   - No code changes required

5. **Pino 9.x → 10.1.0**
   - Logging library updated to v10
   - No breaking changes affecting current usage

**Other Notable Updates:**

- Svelte: 5.38.6 → 5.43.3
- SvelteKit: 2.37.0 → 2.48.4
- TypeScript: 5.9.2 → 5.9.3
- ESLint: 9.34.0 → 9.39.1
- Tailwind CSS: 4.1.12 → 4.1.16
- Playwright: 1.55.0 → 1.56.1

**Verification Status:**

- ✅ Type checking passing (0 errors, 1 deprecation warning for `<slot>`)
- ✅ Unit tests passing (Vitest 4)
- ✅ Production build successful on Node 24
- ✅ All dependencies compatible with Node 24

**Known Deprecations:**

- Svelte 5 warning: `<slot>` is deprecated in favor of `{@render ...}` tags (non-breaking)

### Upgrade Process

When upgrading packages in the future:

1. Check migration guides for major version updates (especially from GitHub repos)
2. Test updates on current Node version first
3. Upgrade Node version after verifying package compatibility
4. For form validation: Always use `zod4` and `zod4Client` adapters with Zod 4+
5. Run full test suite and production build before committing
