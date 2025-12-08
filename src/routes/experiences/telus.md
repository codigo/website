---
order: '05'
timeframe: '2019 - 2020'
company: Telus
description: I provided best practices and guidance to the developer community, led a team in creating a NodeJS-based framework, and managed infrastructure automation using Terraform and GCP APIs.
previous: cto-ai
next: navarik
---

<!-- markdownlint-disable MD041 -->

## Sr Technology Architect

Apr 2019 - Sep 2020

### Technologies Used

- Restful API Design
- AWS
- JavaScript
- GCP
- PostgreSQL
- Node.js
- Fastify
- React.js
- Next.js
- Tap
- Jest
- SQL
- CI/CD (GitHub Actions)
- Hashicorp's Vault
- Hashicorp's Consul
- Firebase
- Kubernetes

As a critical member of the Telus Platform Tooling Team, I spearheaded initiatives that significantly improved development practices, deployment processes, and security measures. My contributions included:

### Architectural Design Decisions

- Architected plugin-based framework using Fastify's encapsulation model, enabling teams to extend core functionality without modifying base code
- Designed secret management architecture integrating Hashicorp Vault with Kubernetes secrets, balancing security requirements with developer experience
- Established architectural patterns for testing infrastructure code using mocks, defining standards adopted across 15+ development teams
- Created deployment architecture supporting multi-cloud strategy (AWS/GCP), designing abstraction layer for cloud-agnostic deployments

### Cloud Deployment Framework Architecture

- Architected a Fastify-based Node.js framework providing abstraction over cloud-specific APIs, enabling seamless deployment across GCP and AWS environments
- Designed plugin architecture leveraging Fastify's encapsulation model, allowing teams to extend core deployment functionality while maintaining stability
- Established event-driven deployment pipeline integrating GitHub Actions, Google Cloud APIs, and Kubernetes API for zero-downtime releases
- Reduced time to test and deploy to production by 80% through architectural optimization of the deployment workflow
- Documented architectural decision records (ADRs) for framework design choices, facilitating team alignment and future maintenance

### Testing Best Practices

- Established testing standards using nock.js and node-tap
- Created a comprehensive library of infrastructure mocks, enhancing test reliability

### Secret Management Implementation

- Implemented automatic rotation for 95% of secrets
- Decreased average secret lifespan from 180 to 30 days
- Improved audit trail coverage for secret access by 300%
- Eliminated the need for manual secret setting in environment variables
- Significantly reduced the risk of human error leading to security breaches

### Compliance and Scalability

- Standardized secret management across all development teams
- Supported a 200% increase in application deployment without additional overhead
- Reduced onboarding time for new team members by 50% due to consistent practices

This experience significantly enhanced Telus's development processes, security, and compliance, yielding a strong return on investment. It broadened my expertise in platform engineering, encompassing areas such as cross-functional collaboration, cloud deployment, and advanced security practices, thereby strengthening my overall skillset in modern software development.
