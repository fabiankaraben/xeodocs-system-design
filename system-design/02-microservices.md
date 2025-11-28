---
title: Microservices Architecture
description: The backend is split into specific domains to decouple Git operations (heavy I/O) and LLM processing (latency/cost) from the core business logic.
---

The backend is split into specific domains to decouple Git operations (heavy I/O) and LLM processing (latency/cost) from the core business logic.

## 1. Auth Service (`auth-service`)
Handles identity and access management.
- **Responsibilities:**
  - User Login/Registration (Internal).
  - JWT Token generation and validation.
  - Role Management (RBAC).
  - Middleware for other services to validate tokens.
- **Data:** `users`, `roles`, `permissions`.

## 2. Core Service (`core-service`)
The central brain of the application.
- **Responsibilities:**
  - CRUD for Projects (Websites).
  - Managing Target Languages and Domains.
  - Storing file metadata (which files are tracked, their hash/checksums to detect changes).
  - API Gateway entry point for frontend/CLI.
  - Dispatching jobs to RabbitMQ.
- **Data:** `projects`, `project_languages`, `tracked_files`, `translation_status`.

## 3. Git Worker Service (`git-service`)
Handles all interaction with the filesystem and Git providers.
- **Responsibilities:**
  - Interacting with GitHub/GitLab APIs to Fork/Star/Watch.
  - Cloning repositories to Persistent Volumes (PV).
  - Managing branches (`main`, `lang-*`).
  - Detecting translatable files (scanning directories).
  - Committing and Pushing changes.
  - Performing `git merge` or `git rebase` for syncing.
- **Infrastructure:** Requires a Persistent Volume Claim (PVC) shared or dedicated to store repo clones.

## 4. Translator Service (`translator-service`)
Interface for AI translation.
- **Responsibilities:**
  - Consuming translation tasks from RabbitMQ.
  - Managing context windows and prompts for LLMs.
  - Calling OpenAI, xAI, or Gemini APIs.
  - Handling rate limits and retries.
  - Returning translated content to the Git Worker or Core.

## 5. Scheduler Service (`scheduler-service`)
Handles periodic tasks.
- **Responsibilities:**
  - Triggering "Sync" jobs for all active projects periodically.
  - Checking for repository updates (polling or webhook handling).

## 6. Notification Service (`notification-service`)
- **Responsibilities:**
  - Sending emails (SMTP/SES).
  - Dispatching Webhooks to the external hosting system when a language is fully translated/updated.

---

## Inter-Service Communication

### Synchronous (gRPC/REST)
- **Auth** -> **Core**: Token validation.
- **Core** -> **Git**: Immediate requests (e.g., "Check if repo exists", "Get file tree"). *Note: Heavy operations should be Async.*

### Asynchronous (RabbitMQ)
- **Core** -> **Git**: `GIT_CLONE_REQUEST`, `GIT_SYNC_REQUEST`.
- **Git** -> **Core**: `FILE_DISCOVERED`, `GIT_OP_COMPLETED`.
- **Core** -> **Translator**: `TRANSLATE_FILE_REQUEST`.
- **Translator** -> **Git**: `WRITE_TRANSLATION_REQUEST` (Or Translator -> Core -> Git).
- **Git** -> **Notifier**: `TRANSLATION_PUSHED`.
