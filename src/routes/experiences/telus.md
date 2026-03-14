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
- Go
- Kubernetes
- HashiCorp Vault
- HashiCorp Consul
- PostgreSQL
- SQL
- Firebase
- OAuth2
- CI/CD (GitHub Actions)
- Tap
- Jest
- Restful API Design

At Telus, deployments took ~4 hours, secrets were being shared in chat messages and env files, and there were incidents of credentials ending up in private GitHub repos. The infra team was flagging developers who had access to data they shouldn't have. Meanwhile, every team copied a Kubernetes YAML template that drifted out of date, forcing complex rebases whenever the platform team made updates. I built the tooling to fix all of this.

### Cloud Deployment Framework

Previously, teams copied a Kubernetes template and modified it for their needs. When the platform team updated the template, every team had to rebase — a painful, error-prone process. I replaced this with a **Fastify-based application framework** — think of it like SvelteKit for Telus's cloud services. Teams could `npm create` to scaffold a new project and `npm update` to pull in the latest changes. The framework bundled secrets management (HashiCorp Vault), internal Telus linting rules, config, and deployment tooling as npm packages, so staying current was automatic.

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

### Auth-Aware API Gateway

Telus served different applications through both public-facing and internal services, but authentication was handled inconsistently and access control lacked central enforcement. I built an auth-aware API gateway that routed traffic to the proper services, kept and forwarded authentication where needed, and served as a centralized door to allow or disallow access depending on the requesting service.

- Centralized authentication for **20+ internal and public-facing services** using TypeScript, Fastify, and OAuth2.
- Enforced access control and standardized auth forwarding across all services.
- Eliminated inconsistent authentication handling that had been a recurring source of security gaps.

### Event-Sourced CI/CD Pipeline

The deployment pipeline lacked auditability and crash recovery, failing SOC2 compliance requirements. I designed an event-sourced CI/CD pipeline where a git push flowed through an append-only event log: `DeploymentTriggered → LintingPassed → BuildPassed → KubernetesManifestGenerated → SecretsSuccessfullyInjected → DeployedToStaging → ProductionPromotionApproved → DeployedToProduction`.

- The write side (CQRS commands) handled each step independently and emitted events; the read side maintained optimized read models for a developer dashboard showing pipeline status.
- Provided **full auditability** (SOC2/security audit compliance), **crash recovery** (the system could resume from the last successful event after a server reboot), and **time-travel debugging** (replaying events to recreate failure states).
- Processed **~30+ deployments/day** using TypeScript, Go, GCP, and AWS.

### Testing Infrastructure

- Established testing standards using **nock.js** and **node-tap**.
- Created a comprehensive library of infrastructure mocks, enhancing test reliability
  and adoption across 15+ teams.
- Reduced new team member onboarding time by **50%** through consistent tooling and
  documented practices.

### Key Achievements

- Cut deployment time by 80% by architecting a Fastify-based application framework with `npm create`/`npm update` workflow — enabling zero-downtime releases across AWS and GCP.
- Eliminated secret leakage by integrating HashiCorp Vault with Kubernetes secrets — achieving 95% automated rotation (lifespan cut from 180 to 30 days), improving audit trail coverage by 300%, and removing manual secret-setting from env files and chat messages.
- Drove adoption across 15+ teams by packaging the framework as npm packages with bundled linting, config, and secrets tooling — supporting 200% growth in deployment volume.
- Reduced onboarding time by 50% by establishing testing standards with nock.js and node-tap and creating a shared library of infrastructure mocks.
- Centralized authentication for 20+ services by building an auth-aware API gateway with OAuth2 — eliminating inconsistent auth handling that had been a recurring source of security gaps.
- Achieved SOC2-compliant deployment auditability by designing an event-sourced CI/CD pipeline processing ~30+ deployments/day — enabling crash recovery and time-travel debugging across GCP and AWS.
