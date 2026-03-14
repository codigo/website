---
order: 09
timeframe: 2022 - 2023
company: Doc.Ai / Sharecare
description: As Staff Software Engineer, leadership was pushing for faster feature delivery but redundant API calls made SmartOmix sluggish for field researchers on mobile. I replaced Redux with React Context + react-query caching and built a shared Storybook component library across 5 projects — cutting API calls by 50%, raising test coverage from 80% to 95%, and accelerating feature delivery.
next: galvanize
previous: coursedog
---

<!-- markdownlint-disable MD041 -->

## Staff Software Engineer

Apr 2022 - Mar 2023

### Technologies Used

- TypeScript
- React.js
- Material-UI
- Storybook
- Jest
- React Query
- React Context API
- GitHub Actions
- CI/CD
- Docker

At doc.ai (acquired by Sharecare), leadership was pressuring the team to ship features faster on SmartOmix — a distributed health research platform — but redundant API calls made the app sluggish, especially for field researchers using mobile devices and tablets on poor connections. Meanwhile, duplicated UI code across 5 projects slowed development even further.

### Technical Contributions

- **Component Library:** Led the development of a reusable component library using
  Storybook and TypeScript, establishing consistent UI patterns and components shared
  across **5 different projects** within the platform — eliminating duplicated CSS and
  components that were slowing feature delivery, and **cutting feature delivery time
  from ~3 days to under 1 day**.
- **State Management Modernization:** Field researchers using the platform on mobile devices and tablets with poor connections were experiencing noticeably slow load times due to redundant API calls. I replaced Redux with React Context API and react-query, eliminating excessive API calls (~50 per page) through caching and request deduplication — cutting API calls by 50%, improving load times by 40%, and reducing data fetching errors by 80%.
- **Testing Infrastructure:** Established testing best practices and infrastructure,
  creating patterns for unit, integration, and component tests adopted as team standards.
  Raised coverage from **80% to 95%** and reduced post-release bugs by 70%.
- **Performance Optimization:** Implemented advanced React patterns including custom
  hooks for business logic reuse, higher-order components for cross-cutting concerns,
  and compound component patterns for composability.
- **Mentorship:** Mentored junior developers on TypeScript, React best practices, and
  test-driven development approaches. Led comprehensive code reviews and established
  frontend development standards.

### Key Achievements

- Cut API calls by 50% and reduced data fetching errors by 80% by replacing Redux with React Context + react-query caching — improving load times by 40% for field researchers on mobile and eliminating brittle data synchronization.
- Cut feature delivery time from ~3 days to under 1 day by eliminating duplicated CSS and components across 5 projects using a shared Storybook design system.
- Reduced post-release bugs by 70% by establishing testing infrastructure and patterns that raised coverage from 80% to 95%.

### Domain Expertise Gained

Healthcare technology, data privacy considerations (HIPAA-adjacent), decentralized
research platform architecture, and building user-centric interfaces for diverse
participant populations.
