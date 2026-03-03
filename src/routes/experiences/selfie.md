---
order: 02
timeframe: 2013 - 2015
company: Selfie INC
description: As Principal Software Engineer and Architect, I designed the full microservices architecture for a social platform handling 1M+ daily user interactions — using ZeroMQ for async messaging, MongoDB + Redis for data, Twilio for 2FA, and achieving 3x scalability improvement with ~200ms timeline loads.
next: freelance
previous: humanapi
---

<!-- markdownlint-disable MD041 -->

## Principal Software Engineer and Architect

May 2013 - Jul 2015

### Technologies Used

- Node.js
- Restify
- ZeroMQ
- MongoDB
- Redis
- Elasticsearch
- Amazon S3
- Twilio
- Apple Notification Service (APNS)
- Amazon SES
- Nginx
- Capistrano
- Sockets
- SQL
- Microservices

At Selfie INC, I architected and led the full implementation of a microservices-based
social platform handling **1M+ daily user interactions** — designing the system from
the ground up using event-driven patterns, CQRS, and domain-driven design.

### System Architecture

- Designed an event-driven microservices platform using **ZeroMQ** for asynchronous
  inter-service messaging and REST for synchronous operations, achieving a **3x
  scalability improvement** and reducing timeline load times from ~1s to ~200ms.
- Established service boundaries following domain-driven design principles across 5
  dedicated services: Media Service, Notification Service, Authentication Service,
  Timeline Service, and Deployment Service.
- Selected **MongoDB** for flexible user-generated content schemas supporting rapid
  feature iteration, **Redis** for session management and caching (reducing DB load by
  60%), and **Amazon S3** for media storage.
- Implemented circuit breaker patterns and retry logic for inter-service communication,
  achieving **99.9% uptime**.
- Designed auto-scaling architecture for Joyent infrastructure, reducing costs by **25%**
  while maintaining performance under variable load.

### Major Projects

#### Media Handler

Managed and validated all media received by the API, implemented a CDN + Nginx layer
improving media delivery speed by **70%**, and developed an asynchronous upload system
reducing user wait times by **50%**. Processed **10,000+ daily media uploads** for
faster streaming and compression.

#### APNS Receiver

Utilized socket.io for long-polling and managing push notifications to Apple devices.
Implemented a round-robin notification system adhering to APNS rate limits, reducing
notification failures by **90%** through queue-based processing.

#### Capistrano Deployer

Automated deployments across all 5+ services with integration to an in-house build
testing service — reducing deployment time by **75%** and human error by **95%**.

#### Ciruela (Continuous Integration Server)

Implemented automated testing for all microservices with real-time coverage reports and
issue notifications, catching **30% more bugs** before production.

#### Twilio 2FA Integration

Designed and implemented two-factor authentication using **Twilio**, improving platform
security by **40%** across the user base.

#### Scaler

Developed an automated scaling system for Joyent's infrastructure with a backoff
algorithm for efficient resource allocation, reducing infrastructure costs by **25%**
while maintaining performance.

### Key Achievements

- Architected platform handling 1M+ daily interactions with 99.9% uptime.
- Reduced timeline load from ~1s to ~200ms; achieved 3x scalability through CQRS and
  fan-out caching.
- Reduced infrastructure costs by 25% through intelligent auto-scaling.
- Deployment time reduced by 75%, human error by 95%.
