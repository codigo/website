---
order: 02
timeframe: 2013 - 2015
company: Selfie INC
description: As Principal Software Engineer, users were churning saying 'the app doesn't work' — timeline loads took ~1s and when Wiz Khalifa joined, the spike in activity made the sluggishness highly visible. I redesigned the architecture around CQRS with async queues and fan-out caching — bringing loads from ~1s to ~200ms, scaling capacity 3x, and stopping the user churn.
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

At Selfie INC, users were churning and saying 'the app doesn't work' — timeline loads took ~1s and the platform couldn't handle traffic spikes. When Wiz Khalifa joined and drove a wave of activity, the sluggishness became highly visible, accelerating user drop-off by the hundreds. I redesigned the architecture to handle burst traffic and bring the experience back to life.

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

- Stopped user churn caused by sluggish timelines — some users who had left came back after performance improvements.
- Brought timeline loads from ~1s to ~200ms; scaled capacity 3x through CQRS and fan-out caching.
- Reduced infrastructure costs by 25% through intelligent auto-scaling.
- Deployment time reduced by 75%, human error by 95%.
