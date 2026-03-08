---
order: 08
timeframe: 2021 - 2022
company: Galvanize / Diligent
description: As Senior Software Engineer, the test suite for an app serving 100K+ daily users took ~45 minutes and sometimes crashed from memory exhaustion, bottlenecking the entire release cycle. I parallelized Jest test execution and led Node.js testing standards adoption — cutting test time from ~45 to ~18 minutes and eliminating memory crashes.
previous: doc-ai
next: mobilelive
---

<!-- markdownlint-disable MD041 -->

## Senior Software Engineer

Oct 2021 - Mar 2022

### Technologies Used

- JavaScript
- Node.js
- Fastify
- AWS Lambda
- TypeScript
- Amazon S3
- SQL
- CloudFormation
- CI/CD (GitHub Actions)
- Terraform

At Galvanize (acquired by Diligent), the test suite for an application serving 100,000+ daily active users took ~45 minutes to run — sometimes consuming all available memory and crashing, forcing developers to restart and wait again. This bottleneck was slowing down the entire release cycle. I focused on unblocking the team.

### Technical Contributions

- **Performance Optimization:** The test suite sometimes consumed all available memory and crashed, forcing developers to restart and wait from scratch. I identified performance bottlenecks across core applications and parallelized Jest execution — cutting test time from ~45 to ~18 minutes and eliminating the memory crashes entirely.
- **Architecture Planning:** Proposed a transition plan from monolithic to microservices
  architecture using strangler patterns, outlining improvements in deployment efficiency,
  team autonomy, and scalability. Authored Architecture Decision Records (ADRs) to align
  the team around the migration path.
- **Developer Enablement:** Conducted workshops on Node.js best practices and created
  an internal knowledge base, significantly improving team-wide proficiency. Served as
  a go-to resource for architectural guidance and code quality.
- **Node.js Adoption:** Led the adoption of Fastify (Node.js) and AWS Lambda patterns
  within the team, mentoring developers on modern serverless and framework best practices.
- **Code Quality:** Conducted thorough code reviews, maintained comprehensive
  documentation, and enforced quality standards across the codebase.

### Key Achievements

- Cut test execution from ~45 minutes to ~18 minutes, eliminated memory crashes that were forcing restarts, and unblocked the release cycle for 100K+ daily users.
- Served applications with 100,000+ daily active users with improved stability and
  reduced latency.
- Produced a detailed monolith-to-microservices migration plan using strangler patterns,
  giving the team a clear architectural path forward.
