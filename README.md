# Mau App

Personal portfolio and blog application built with SvelteKit, featuring an AI-powered chatbot for interactive Q&A about experience and skills.

## Tech Stack

- **Runtime**: Node.js 24.8.0
- **Framework**: SvelteKit with Svelte 5 (Runes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: PocketBase
- **Testing**: Playwright (integration) + Vitest v4 (unit)
- **AI**: OpenAI GPT-5 Nano for chatbot functionality

## Prerequisites

- Node.js 24.x
- 1Password CLI (for local development environment variables)

## Development

Install dependencies:

```bash
npm install
```

Start the development server (uses 1Password CLI for environment variables):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Testing

Run all tests (integration + unit):

```bash
npm test
```

Run only unit tests:

```bash
npm run test:unit
```

Run only integration tests:

```bash
npm run test:integration
```

## Code Quality

Check formatting and linting:

```bash
npm run lint
```

Auto-format code:

```bash
npm run format
```

Run type checking:

```bash
npm run check
```

## Environment Variables

The following environment variables are required:

- `PUBLIC_CF_TURNSTILE_KEY` - Cloudflare Turnstile site key
- `SECRET_CF_TURNSTILE_SECRET` - Cloudflare Turnstile secret key
- `PUBLIC_POCKETBASE_URL` - PocketBase instance URL
- `SECRET_OPENAI_API_KEY` - OpenAI API key for chatbot functionality

In development, these are managed via 1Password CLI. In production, they are set via GitHub secrets and Docker build args.

## Utility Scripts

The `bin/` directory contains utility scripts for various tasks:

### getUnsplashInfo.js

Fetches metadata for Unsplash photos (blur hash, URLs, color, descriptions).

```bash
node bin/getUnsplashInfo.js <API_KEY> <PHOTO_ID>
```

### createAboutMeSummary.js

Generates an "About Me" summary by combining experience markdown files and tech stack information. This is used as context for the AI chatbot.

```bash
node bin/createAboutMeSummary.js [OUTPUT_PATH]
```

Default output: `.generated/about-me.txt`

## Features

- **Portfolio**: Showcase of work experiences and technical skills
- **Blog/Journal**: Dynamic blog powered by PocketBase
- **AI Chatbot**: Interactive Q&A about experience and skills using GPT-5 Nano
- **Contact Form**: Cloudflare Turnstile-protected contact form
- **Responsive Design**: Mobile-first Tailwind CSS v4 styling

## Project Structure

```
src/
├── components/           # Reusable Svelte components
├── constants/           # App constants (techStack.ts)
├── lib/                # Shared utilities and services
├── routes/             # SvelteKit file-based routing
│   ├── experiences/    # Markdown files for work experience
│   ├── about-me/       # About page with AI chatbot
│   ├── contact/        # Contact form
│   └── journal/        # Blog/journal pages
└── types/              # TypeScript type definitions
```

## Deployment

The application is containerized using Docker and deployed via GitHub Actions:

1. Tests run on every push
2. Semantic versioning and changelog generation
3. Docker image built and pushed to container registry
4. Automated deployment trigger to infrastructure repository

See `.github/workflows/test-containerize-deploy.yml` for the complete CI/CD pipeline.
