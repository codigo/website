---
order: 06
timeframe: 2020 - 2021
company: CTO.ai
description: As Senior Lead Engineer, internal engineering teams were struggling — projects being abandoned, employee churn rising, no visibility into project health. I built a GitHub App integrating DORA metrics (also the company's core product), deployed Go-based sidecar containers for monitoring, and drove open collaboration — giving leadership real-time visibility that reduced the churn.
next: telus
---

<!-- markdownlint-disable MD041 -->

## Senior Lead Engineer

Oct 2020 - Apr 2021

### Technologies Used

- TypeScript
- JavaScript
- Go
- Kubernetes
- Docker
- AWS Serverless Framework
- GitHub Actions
- CI/CD
- React.js
- Amazon S3
- SQL
- Microservices
- Webpack
- Slack API

At CTO.ai, engineering teams internally were struggling — projects were being abandoned, developers felt like they were fighting uphill battles, and employee churn was rising. There was no visibility into project health or team performance, and the containers running services had no monitoring. I built the observability platform that gave teams and leadership the visibility they needed — and this DORA metrics dashboard also became the company's core product offering.

### Technical Contributions

- **DORA Metrics Platform:** Architected and implemented a GitHub-integrated platform
  for collecting and visualizing DORA (DevOps Research and Assessment) metrics —
  deployment frequency, lead time for changes, change failure rate, and time to restore.
  This gave leadership and teams actionable insight into engineering performance for the
  first time.
- **Kubernetes Monitoring Infrastructure:** Led the design and deployment of custom
  Kubernetes pods for comprehensive application monitoring and performance analysis,
  tracking network latency, memory consumption, and CPU usage in real time.
- **Go Sidecar Container:** Developed a bespoke sidecar container in **Go** to optimize
  data relay processes between application containers and the monitoring layer, enhancing
  overall system efficiency.
- **Go Event Queue:** DevOps workflows were manual and disruptive, requiring engineers to context-switch for routine operations. Built a Go event queue processing **50+ daily Slack-driven commands** (deployments, restarts, metrics requests) with async responses — eliminating manual DevOps workflows and freeing engineers from context-switching for routine operations.
- **Open Collaboration Culture:** Championed an open-source collaboration model across
  engineering teams, integrating multiple APIs and fostering a more collaborative and
  transparent developer ecosystem.
- **API Design and Development:** Designed and maintained APIs focused on enhancing
  development workflow efficiency, reducing friction between tooling systems.

### Key Achievements

- Reduced employee churn by giving leadership real-time visibility into project health through a GitHub-integrated DORA metrics platform — which also became the company's core product offering to external customers.
- Enabled real-time performance monitoring across all running services by deploying custom Kubernetes pods with a Go-based sidecar container — tracking network latency, memory, and CPU usage.
- Eliminated manual DevOps workflows by building a Go event queue processing 50+ daily Slack-driven commands — freeing engineers from context-switching for routine operations.
