---
order: '05'
timeframe: '2019 - 2020'
company: Telus
description: As Senior Technology Architect, deployments took ~4 hours, secrets were being shared in chats and env files with incidents of credentials in repos. I built a Fastify-based deployment framework as an npm package with HashiCorp Vault integration — cutting deploy time to ~30 minutes, eliminating secret leakage, and getting 15+ teams to adopt it with simple npm updates.
previous: cto-ai
next: navarik
---

<!-- markdownlint-disable MD041 -->

## Sr Technology Architect

Apr 2019 - Sep 2020

### Technologies Used

- Node.js
- Fastify
- TypeScript
- JavaScript
- React.js
- Next.js
- GCP
- AWS
- Kubernetes
- HashiCorp Vault
- HashiCorp Consul
- PostgreSQL
- SQL
- Firebase
- CI/CD (GitHub Actions)
- Tap
- Jest
- Restful API Design

At Telus, deployments took ~4 hours, secrets were being shared in chat messages and env files, and there were incidents of credentials ending up in private GitHub repos. The infra team was flagging developers who had access to data they shouldn't have. Meanwhile, every team copied a Kubernetes YAML template that drifted out of date, forcing complex rebases whenever the platform team made updates. I built the tooling to fix all of this.

### Cloud Deployment Framework

Previously, teams copied a Kubernetes template and modified it for their needs. When the platform team updated the template, every team had to rebase — a painful, error-prone process. I replaced this with a **Fastify-based npm package**, so staying current became as simple as running `npm update`.

- Architected a **Fastify-based Node.js framework** providing a clean abstraction over
  cloud-specific APIs, enabling seamless deployment across both **GCP and AWS**
  environments from a single codebase.
- Designed a plugin architecture leveraging Fastify's encapsulation model, allowing
  teams to extend core deployment functionality without modifying base code.
- Established an event-driven deployment pipeline integrating GitHub Actions, Google
  Cloud APIs, and the Kubernetes API for **zero-downtime releases**.
- Reduced time to test and deploy to production by **80%** through architectural
  optimization of the deployment workflow.
- Documented Architecture Decision Records (ADRs) for all framework design choices,
  facilitating team alignment and long-term maintainability.
- Supported a **200% increase in application deployments** without additional
  operational overhead.

### Secret Management Architecture

Secrets were being shared in Slack, stored in .env files, and there were incidents of credentials committed to private GitHub repos. The infra team was flagging developers with access to data they shouldn't have. I designed a proper secret management architecture to close all of these gaps.

- Designed and implemented secret management integrating **HashiCorp Vault** with
  Kubernetes secrets, balancing security requirements with developer experience.
- Achieved **95% automated secret rotation**, reducing the average secret lifespan from
  **180 days to 30 days**.
- Improved audit trail coverage for secret access by **300%** and eliminated manual
  secret setting in environment variables — significantly reducing the risk of human
  error and credential leakage.
- Standardized secret management practices across all development teams.

### Testing Infrastructure

- Established testing standards using **nock.js** and **node-tap**.
- Created a comprehensive library of infrastructure mocks, enhancing test reliability
  and adoption across 15+ teams.
- Reduced new team member onboarding time by **50%** through consistent tooling and
  documented practices.

### Key Achievements

- Deployment time reduced by 80%; zero-downtime releases enabled across AWS and GCP.
- 95% of secrets now auto-rotated; secret lifespan cut from 180 to 30 days.
- Eliminated secret leakage via chat messages and env files; credentials no longer appearing in repos.
- Staying current became as simple as `npm update` for 15+ teams.
- Audit trail coverage improved by 300%.
- Framework adopted by 15+ teams; supported 200% growth in deployment volume.
