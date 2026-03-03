---
order: 11
timeframe: '*'
company: Codigo, Inc. Consulting
description: Founder and Principal Architect at Codigo Inc., delivering custom software architecture and consulting for clients across industries; building event-driven systems, API infrastructure, and AI-integrated platforms using Rust, Go, TypeScript, and Node.js.
next: coursedog
previous: freelance
---

<!-- markdownlint-disable MD041 -->

## Founder and Principal Architect

March 2019 - Present

### Technologies Used

- Node.js
- TypeScript
- Rust
- Go
- AWS
- GCP
- React.js
- Svelte
- Redis
- Kafka
- Elasticsearch
- WebSocket
- P2P (HolePunch)
- GraphQL
- CI/CD (GitHub Actions)
- Docker
- Terraform
- Firebase
- Supabase
- LLM / OpenAI API
- SQL
- RDS
- EC2

As the founder and principal consultant at Codigo Inc., I deliver end-to-end software
architecture and engineering for clients across various sectors — from greenfield
platform builds to complex system redesigns. My work spans backend systems engineering,
cloud infrastructure, AI integration, and full-stack development.

### What I Bring to Projects

- **Cloud Mastery:** I design and implement robust, scalable systems on AWS and GCP,
  including self-hosted infrastructure optimized for cost and performance.
- **Full-Stack Excellence:** From responsive front-end interfaces (React.js, Svelte) to
  powerful back-end architectures (Fastify, Node.js, Go, Rust), I ensure seamless
  integration across the entire stack.
- **DevOps Optimization:** Advanced CI/CD pipelines with GitHub Actions, Docker, and
  Terraform — from code commit to production with confidence.
- **AI Integration:** Custom integrations with LLMs and machine learning systems to
  unlock new capabilities in client applications.
- **End-to-End Project Leadership:** I guide projects from requirements and architecture
  through delivery and maintenance, ensuring alignment with client objectives and budget.

---

### Selected Projects

#### Event-Sourced Order Management System *(Private Client)*

A production-grade event sourcing and CQRS platform built in **Rust** for a private
client requiring highly auditable, append-only order state management.

- Implemented Event Sourcing with an append-only PostgreSQL event store and in-memory
  backend (runtime-swappable), CQRS with 4 read model projections, and the Saga pattern
  for distributed transactions.
- Achieved ~550,000 events/sec throughput on single-event appends and ~3.9M events/sec
  retrieval in benchmarks.
- Full observability with Prometheus metrics and structured tracing.
📂 [Reference implementation on GitHub](https://github.com/maumercado/event-sourcing-rust)

---

#### Multi-Tenant API Gateway *(Private Client)*

A production-ready API Gateway built with **TypeScript**, **Fastify**, and **Node.js**
for a client needing a centralized, resilient entry point across multiple backend
services.

- Multi-tenancy with API key isolation, Redis-cached auth, and per-tenant rate limiting
  using a sliding window algorithm.
- Full resilience layer: circuit breakers, retry with exponential backoff + jitter,
  upstream health checks, and fallback responses.
- Prometheus metrics with per-tenant labels, p50/p95/p99 latency histograms, and a
  pre-built Grafana dashboard.
📂 [Reference implementation on GitHub](https://github.com/maumercado/gateway-api)

---

#### Distributed Task Queue *(Private Client)*

A horizontally scalable task queue built in **Go** with Redis Streams for a client
requiring reliable async job processing with priority scheduling.

- 4-tier priority scheduling, at-least-once delivery via Redis consumer groups, dead
  letter queue, exponential backoff retry, and real-time WebSocket task events.
- Full admin API for worker management, queue inspection, and DLQ replay.
- Prometheus metrics and generated Go + TypeScript client SDKs.
📂 [Reference implementation on GitHub](https://github.com/maumercado/task-queue-go)

---

#### Unfold — Open Source JSON Viewer *(Personal / Open Source)*

A high-performance native JSON viewer built in **Rust** using the Iced GUI framework.

- Virtual scrolling for large files, tree view with Dadroit-style alignment, syntax
  highlighting, regex search, and full keyboard navigation.
- Native macOS menu bar, dark/light theme, multi-window support, and built-in update
  checking.
- Available for macOS, Windows, and Linux.
📂 [View on GitHub](https://github.com/maumercado/unfold)
