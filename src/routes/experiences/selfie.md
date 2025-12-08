---
order: 02
timeframe: 2013 - 2015
company: Selfie INC
description: Led a team through the design, planning, execution, and deployment of all micro-services that composed the social application. I integrated Twilio API for 2FA and used MongoDB and Redis for data management.
next: freelance
previous: humanapi
---

<!-- markdownlint-disable MD041 -->

## Principal Software Engineer and Architect

May 2013 - Jul 2015

### Technologies Used

- Microservices
- Amazon S3
- Elasticsearch
- SQL
- MongoDB
- Restify
- Node.js
- Redis
- Apple Notification Service
- Twilio
- ZeroMQ
- Capistrano
- Nginx
- Sockets
- Amazon SES

Architected and led the implementation of a microservices-based social platform consisting of 5+ distributed services handling 1M+ daily user interactions. I designed the system architecture using event-driven patterns with ZeroMQ for asynchronous inter-service communication and REST for synchronous operations, achieving 3x scalability improvement. Key architectural decisions included: selecting MongoDB for flexible user data schemas supporting rapid feature iteration, implementing Redis-based caching layer reducing database load by 60%, and designing Twilio integration for two-factor authentication improving security by 40%. I established service boundaries based on domain-driven design principles, ensuring loose coupling and high cohesion across the platform.

### System Architecture and Design

- Architected event-driven microservices platform using ZeroMQ for asynchronous messaging and REST for synchronous communication
- Designed service boundaries following domain-driven design principles: Media Service, Notification Service, Authentication Service, Timeline Service, and Deployment Service
- Established data architecture strategy: MongoDB for user-generated content (flexibility), Redis for session management and caching (performance), and S3 for media storage (scalability)
- Implemented circuit breaker patterns and retry logic for inter-service communication, achieving 99.9% uptime
- Designed auto-scaling architecture for Joyent infrastructure, reducing costs by 25% while maintaining performance under variable load

## Major Projects Developed

### Media Handler

- Managed and validated all media received by the API
- Implemented CDN and nginx for storage, improving media delivery speed by 70%
- Developed asynchronous upload system, reducing user wait times by 50%
- Processed 10,000+ daily media uploads for faster streaming and compression

### APNS Receiver

- Utilized socket.io for long polling and managing push notifications to Apple devices
- Implemented round-robin notification system, adhering to APNS rate limits
- Reduced notification failures by 90% through queue-based processing

### Capistrano Deployer

- Automated deployments of 5+ services
- Integrated with in-house build testing service
- Reduced deployment time by 75% and human error by 95%

### Ciruela (Continuous Integration Server)

- Implemented automated testing for all microservices
- Provided real-time coverage reports and issue notifications
- Improved code quality by catching 30% more bugs before production

### Scaler

- Developed automated scaling system for Joyent's Infrastructure
- Implemented backoff algorithm for efficient resource allocation
- Reduced infrastructure costs by 25% while maintaining performance

This role significantly enhanced my expertise in microservices architecture, API development, full-stack engineering, cloud infrastructure management, and continuous integration and deployment. The diverse range of projects and technologies I worked with contributed substantially to my professional growth, equipping me with a comprehensive skill set in modern software development practices.
