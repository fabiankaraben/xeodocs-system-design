---
title: Infrastructure and Security
description: Production/dev infrastructure and security measures.
---

## Infrastructure

### Production Environment
- **Hosting:** Docker Swarm on Virtual Private Server (VPS).
- **Database:** PostgreSQL (managed by Supabase).
- **Backend:** Go (Modular Monolith architecture) running in Docker containers.
- **Frontend (Web):** Next.js (SSG/SSR) running in Docker containers.
- **Frontend (Admin):** Tauri (Desktop App) or Next.js Web App interacting with the API.
- **Email Service:** Resend.

### Development Environment
- **Containerization:** Docker Compose on Docker Desktop.
- **Repositories:**
  - Uses the same GitHub account as production.
  - Fork names are prefixed with `staging-` or `dev-` to distinguish them from production forks.

## Security

### Authentication & Access Control
Authentication strategies (JWT, API Keys) and Access Control logic are defined in the **[Identity Architecture](../../domains/identity/architecture.md)**.

### Data Protection
- **Connection:** All communication between CLI, Frontend, and Backend should be over HTTPS.
- **Storage:** Sensitive data is handled according to the Identity domain security standards.
