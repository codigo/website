# Mau App

Personal portfolio and blog application built with SvelteKit, featuring an AI-powered chatbot for interactive Q&A about experience and skills.

## Tech Stack

- **Runtime**: Node.js 24.8.0
- **Framework**: SvelteKit with Svelte 5 (Runes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: PocketBase (with Docker)
- **Testing**: Playwright (integration) + Vitest v4 (unit)
- **AI**: OpenAI (GPT-5 Nano for chatbot, text-embedding-3-small for semantic search)

## Prerequisites

- Node.js 24.x
- Docker and Docker Compose (for PocketBase)
- 1Password CLI (for local development environment variables)

## PocketBase Setup

Start PocketBase:

```bash
npm run pb:start
```

View PocketBase logs:

```bash
npm run pb:logs
```

Stop PocketBase:

```bash
npm run pb:stop
```

Restart PocketBase:

```bash
npm run pb:restart
```

PocketBase admin UI is available at `http://localhost:8090/_/`

### Data Management

PocketBase uses SQLite and includes built-in backup/restore functionality:

**Schema Migrations**: Managed via JavaScript files in `pb/pb_migrations/`

- Automatically run on PocketBase startup
- Version controlled in git

**Data Backups**: Created via PocketBase admin UI

- Go to Settings → Create backup (creates `.zip` file)
- Local backups stored in `pb/pb_data/backups/`
- Not committed to git (excluded via `.gitignore`)

**Restoring Data**:

1. Start PocketBase: `npm run pb:start`
2. Go to admin UI: `http://localhost:8090/_/`
3. Settings → Backups → Upload/Restore `.zip` file

**Production Backups**:

- Access admin UI at `pocketbase.codigo.sh/_/`
- Download backups regularly and store securely
- For fresh deployments: migrations create schema, then restore backup for data

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
- `PUBLIC_POCKETBASE_URL` - PocketBase instance URL (default: http://localhost:8090)
- `SECRET_OPENAI_API_KEY` - OpenAI API key for chatbot and semantic search
- `SECRET_POCKETBASE_ADMIN_EMAIL` - PocketBase admin email for embedding generation
- `SECRET_POCKETBASE_ADMIN_PASSWORD` - PocketBase admin password for embedding generation

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

### generateEmbeddings.js

Generates AI embeddings and summaries for blog posts to enable semantic search functionality.

Generate embeddings for posts without them:

```bash
npm run embeddings:generate
```

Regenerate all embeddings (useful after content updates):

```bash
npm run embeddings:regenerate
```

Options:

- `--regenerate` - Regenerate embeddings even if they already exist
- `--limit N` - Process only N posts (useful for testing)

Example:

```bash
node bin/generateEmbeddings.js --limit 5
```

## Semantic Search

The journal features AI-powered semantic search that understands the **meaning** of queries, not just keywords. This allows users to find relevant posts using natural language queries like "TypeScript performance tips" or "posts about React hooks."

### How It Works

1. **AI Summaries**: GPT-4o-mini generates search-optimized summaries extracting key concepts from each post
2. **Vector Embeddings**: OpenAI text-embedding-3-small creates 1536-dimensional vectors representing the semantic meaning
3. **Hybrid Search**: Combines semantic similarity with keyword boosting:
   - Base semantic score calculated via cosine similarity
   - 50% boost when query words match the title
   - 30% boost when query words match tags
4. **Automatic Generation**: PocketBase realtime subscriptions automatically generate embeddings when posts are created/updated

### First-Time Setup

After restoring your PocketBase backup or setting up a fresh instance:

1. **Ensure PocketBase is running**:

   ```bash
   npm run pb:start
   ```

2. **Generate embeddings for existing posts**:
   ```bash
   npm run embeddings:generate
   ```

The migration in `pb/pb_migrations/1730773000_add_embedding_fields.js` runs automatically on PocketBase startup and adds the required `ai_summary` and `embedding` fields to the posts collection.

### Workflow for New Posts

**Automatic** (default): When the app is running, embeddings are generated automatically when you create/update posts in the PocketBase admin UI.

**Manual** (if needed): If the app wasn't running when posts were created:

```bash
npm run embeddings:generate
```

### Cost

- **Per post**: ~$0.000035 (AI summary + embedding generation)
- **Per search**: ~$0.00002 (query embedding only)
- **100 posts**: ~$0.35 total

## Features

- **Portfolio**: Showcase of work experiences and technical skills
- **Blog/Journal**: Dynamic blog powered by PocketBase with AI-powered semantic search
- **Semantic Search**: Hybrid vector + keyword search for intelligent content discovery
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

The application is deployed as a standalone Docker stack using Docker contexts. The complete CI/CD pipeline runs on every push to `main`:

### Workflow Steps

1. **Test**: Playwright integration tests run in containerized environment
2. **Semantic Release**: Automated versioning and changelog generation
3. **Build & Push**: Docker image built with production secrets and pushed to container registry
4. **Deploy**: Direct deployment to VPS via Docker context over SSH

### Docker Stack Deployment

The app uses `docker-compose.yml` for both local development and production:

- **Development**: Uses bridge network, local PocketBase data
- **Production**: Uses Docker Swarm overlay network, persistent volumes on VPS

Deployment happens via Docker context:

```bash
docker context create vps --docker "host=ssh://codigo@VPS_IP"
docker --context vps stack deploy --compose-file docker-compose.yml mau-app
```

### Infrastructure

- **VPS Setup**: Managed by Pulumi in separate `services/` repository
  - Hetzner VPS provisioning
  - SSH key configuration
  - Docker Swarm initialization
  - Cloudflare Tunnel setup
  - Caddy reverse proxy configuration

- **App Deployment**: Standalone via Docker context (no Pulumi needed)
  - GitHub Actions connects directly via SSH
  - Deploys updated stack on every release
  - PocketBase migrations run automatically on startup

### Environment Variables

Production environment variables are set in the GitHub Actions workflow and passed to `docker-compose.yml`:

- `CONTAINER_REGISTRY_URL` - Container registry URL (GitHub variable)
- `NETWORK_DRIVER=overlay` - Use Docker Swarm overlay network
- `CADDY_NET_EXTERNAL=true` - Connect to existing Caddy network
- `PB_DATA_PATH` - PocketBase data directory on VPS
- `PB_MIGRATIONS_PATH` - PocketBase migrations directory
- All application secrets injected from GitHub Secrets

See `.github/workflows/test-containerize-deploy.yml` for the complete CI/CD pipeline.
