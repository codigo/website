---
order: 10
timeframe: '2023 - Present'
company: Coursedog
description: As Senior Software Engineer, I stabilized 15+ university ERP integrations by improving field-level data handling, configurable retries, and dynamic header injection — cutting support tickets from ~6/week to 1-2/week. I also proposed and built the @sisField and @sisEntity TypeScript decorator system, giving sales, marketing, and product teams live visibility into our integration capabilities and field directionality.
previous: codigo
next: doc-ai
---

<!-- markdownlint-disable MD041 -->

## Senior Software Engineer

April 2023 - Present

### Technologies Used

- TypeScript
- Node.js
- Vue.js
- SQL
- PeopleSoft
- Ellucian Banner
- OAuth2
- CI/CD (GitHub Actions)

At Coursedog, I play a pivotal role in the integration layer connecting university ERP systems with Coursedog's academic planning platform. When I joined, support for the existing 15+ university integrations was poor — I personally worked through 50+ support tickets, and the platform was generating ~6 tickets per week from universities experiencing sync issues. I also identified that internal teams had no reliable way to understand our integration capabilities, leading me to propose the @sisField decorator system.

### Key Contributions

#### ERP Integration Architecture

Support for 15+ university ERP integrations was poor. I improved data handling at the field level, added configurable retries for failed syncs, and implemented dynamic header injection where integrations required it — cutting support tickets from ~6/week to 1-2/week. The `@sisField` decorator system served as the backbone for automatic field mapping metadata, eliminating the manual configuration that previously caused inconsistencies across all university deployments.

#### @sisField Metadata Decorator System

Internal teams — sales, marketing, product — had no reliable way to know what fields our integrations supported or whether they were bidirectional or read-only. The only reference was a stale Salesforce document that was manually updated and frequently out of date.

I designed the `@sisField` decorator, which annotates each field on a formatter class with a structured metadata object containing:

- **Source** — where the data originates in the ERP system
- **Bidirectional support** — whether the field supports read and write back to the ERP
- **Destination** — where the data maps to in the Coursedog platform
- **Description** — a human-readable explanation of the field's purpose
- **Data examples** — concrete sample values to aid integration setup and debugging

The system was designed to be **easily extensible** — new metadata properties could be
added to the decorator schema without breaking existing formatter definitions.

By exposing a dedicated API endpoint that introspects formatter classes at runtime, I enabled the platform to **surface rich field-level metadata directly to users** — giving university integration teams visibility into exactly what data flows through each formatter, which fields are bidirectional, and what to expect at the destination. This eliminated repetitive questions from internal teams, gave sales and marketing immediate visibility into integration capabilities, and sparked new product ideas.

---

#### Integration Monitoring

Implemented a sophisticated real-time monitoring system enabling rapid identification
and resolution of integration errors — reducing support tickets from **~6/week to
1–2/week** across all integration clients.

#### Search Interface

Developed an intuitive Vue.js search interface for historical CSV uploads, boosting
data accessibility and reducing user query time by **40%**.

#### Code Quality

Conducted regular code reviews and optimization initiatives for existing integrations,
contributing to a consistent and maintainable codebase.

#### Platform Features

Contributed to the broader Coursedog platform using Vue.js, developing features focused
on streamlining data management and improving user experience across multiple modules:

- Class scheduling
- Event planning
- Curriculum management
- Catalogue workflows

---

### Key Achievements

#### @sisField Decorator System

Designed the TypeScript decorator system, enabling runtime introspection of ERP formatter
field metadata (source, bidirectionality, destination, description, examples) and
surfacing it to users through a dedicated API endpoint.

#### University Integration Scale

Enabled seamless integrations for **15+ universities** through automatic, metadata-driven
field mapping across heterogeneous ERP environments.

#### Support Ticket Reduction

Reduced integration support tickets from **~6/week to 1–2/week** through improved field-level data handling, configurable retries, dynamic header injection, and real-time monitoring.

#### Search Performance

Cut user query time by **40%** with a purpose-built Vue.js search interface.

---

### Skills Deepened

Deep expertise in educational technology integrations, ERP data models, TypeScript
decorator patterns, and API introspection design. Strong proficiency in TypeScript
backend development, SQL, and Vue.js front-end engineering.
