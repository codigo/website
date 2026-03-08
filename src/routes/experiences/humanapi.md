---
order: 03
timeframe: 2015 - 2018
company: HumanAPI
description: As Senior Software Engineer, customers were churning because they couldn't find their clinics — search was slow and inaccurate, partner integrations broke frequently with different data models, and releases were unreliable due to brittle test mocks. I introduced Elasticsearch for search, designed a microservices normalization layer, and rebuilt the test infrastructure — cutting search time by 70%, bringing sync failures from ~40/week to near-zero, and raising coverage from 65% to 92%.
previous: navarik
next: selfie
---

<!-- markdownlint-disable MD041 -->

## Senior Software Engineer

Jul 2015 - Jun 2018

### Technologies Used

- Node.js
- JavaScript
- Elasticsearch
- MongoDB
- Redis
- RabbitMQ
- AWS
- RDS
- Amazon S3
- SQL
- Prometheus
- Grafana
- Jest
- CI/CD (GitHub Actions)
- Microservices

At HumanAPI, customers were churning and filing support tickets because they couldn't find their clinics or data stores — search was slow, inconsistent, and sometimes inaccurate. Partner integrations broke frequently due to inconsistent data models across 15+ providers, and releases were unreliable because the test suite was full of brittle mocks requiring 2+ hours of manual verification per release.

### Technical Contributions

- **Microservices Architecture:** Partner integrations were breaking frequently because each of our 15+ health data providers had different data models — sync failures looked like bad data to customers and eroded trust. I designed a microservices layer to normalize and sync health data across all providers into a consistent format, bringing sync failures from ~40/week down to near-zero.
- **Elasticsearch Integration:** Customers were churning and filing support tickets because they couldn't find their clinics or data stores. I introduced Elasticsearch as a search layer on top of our existing data, replacing the direct MongoDB queries that were producing unreliable results — cutting search time from ~500ms to ~150ms and eliminating the support ticket backlog for missing clinics.
- **RabbitMQ Event Bus:** To prevent cascading failures between services, I used RabbitMQ as the event bus for asynchronous inter-service communication, enabling reliable, decoupled data synchronization between microservices.
- **Observability:** To gain visibility into a system that previously had no monitoring, I implemented comprehensive metrics instrumentation using **Prometheus and Grafana**, enabling real-time monitoring and reducing system downtime by **85%**.
- **Testing Infrastructure:** Releases were unreliable — the test suite was full of mocks that didn't catch real issues, so every release required 2+ extra hours of manual verification. Bugs still slipped through, sometimes flagged by partners, sometimes breaking things in production. I rebuilt the testing infrastructure, replacing brittle mocks with meaningful tests — raising coverage from 65% to 92% and cutting release verification from hours of manual checks to automated confidence.
- **Developer Enablement:** Reduced environment setup time by **90%**, enabling 20+ developers and product team members to work efficiently without backend dependencies.

### Key Achievements

- Customers stopped churning over missing clinics; search time cut from ~500ms to ~150ms across 15+ provider integrations.
- Sync failures dropped from ~40/week to near-zero, restoring partner trust.
- Release verification cut from 2+ hours of manual checks to automated confidence; coverage raised from 65% to 92%.
- Prometheus + Grafana monitoring reduced system downtime by 85%.
