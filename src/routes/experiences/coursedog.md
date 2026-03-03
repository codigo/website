---
order: 10
timeframe: '2023 - Present'
company: Coursedog
description: As Senior Software Engineer, I build and maintain real-time bi-directional integrations with ERP systems for 15+ universities — designing a TypeScript metadata decorator system (@sisField) to automatically surface field mapping information across all formatters, reducing integration support tickets from ~6/week to 1–2/week and cutting query times by 40%.
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

As a Senior Software Engineer at Coursedog, I play a pivotal role in building and
maintaining the integration layer that connects university ERP systems with Coursedog's
academic planning platform. My work spans requirement analysis, architectural design,
implementation, and ongoing maintenance of critical integrations for institutions across
North America.

### Key Contributions

#### @sisField Metadata Decorator System

One of my core architectural contributions was designing a **TypeScript decorator-based
metadata system** to bring transparency and discoverability to the ERP integration layer.
Each ERP integration at Coursedog relies on **formatter classes** — TypeScript classes
that take raw data from an ERP system (e.g., PeopleSoft, Ellucian Banner) and transform
it into Coursedog's internal data model. The challenge: there was no programmatic way
for users or support teams to understand what each field in a formatter did, where its
data came from, or whether it supported bidirectional sync.
I designed the `@sisField` decorator, which annotates each field on a formatter class
with a structured metadata object containing:

- **Source** — where the data originates in the ERP system
- **Bidirectional support** — whether the field supports read and write back to the ERP
- **Destination** — where the data maps to in the Coursedog platform
- **Description** — a human-readable explanation of the field's purpose
- **Data examples** — concrete sample values to aid integration setup and debugging
The system was designed to be **easily extensible** — new metadata properties could be
added to the decorator schema without breaking existing formatter definitions.
By exposing a dedicated API endpoint that introspects formatter classes at runtime, I
enabled the platform to **surface rich field-level metadata directly to users** — giving
university integration teams visibility into exactly what data flows through each
formatter, which fields are bidirectional, and what to expect at the destination. This
significantly reduced the ambiguity that previously caused misconfigured integrations
and support escalations.

---

#### ERP Integration Architecture

Designed real-time, bi-directional integrations with educational ERP systems including
PeopleSoft and Ellucian Banner. The `@sisField` decorator system served as the backbone
for automatic field mapping metadata, eliminating the manual configuration that
previously caused inconsistencies across 15+ university deployments.

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
on streamlining data management and improving user experience for class scheduling,
event planning, curriculum, and catalogue workflows
---

### Key Achievements

- Designed the `@sisField` TypeScript decorator system, enabling runtime introspection
  of ERP formatter field metadata (source, bidirectionality, destination, description,
  examples) and surfacing it to users through a dedicated API endpoint.
- Enabled seamless integrations for **15+ universities** through automatic, metadata-
  driven field mapping across heterogeneous ERP environments.
- Reduced integration support tickets from **~6/week to 1–2/week** through automated
  mapping and real-time monitoring.
- Cut user query time by **40%** with a purpose-built Vue.js search interface.

---

### Skills Deepened

Deep expertise in educational technology integrations, ERP data models, TypeScript
decorator patterns, and API introspection design. Strong proficiency in TypeScript
backend development, SQL, and Vue.js front-end engineering.
