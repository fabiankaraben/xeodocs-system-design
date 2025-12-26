---
title: Architecture and Components
description: Backend API, CLI, git strategy, and special file management.
---

## 1. Backend & API

- **Source of Truth:** The database maintains the state of each file (`pending`, `translated`, `outdated`).
- **REST API:** Provides endpoints for the CLI and Frontend to query project status and report progress.
- **Authentication:**
  - Administrators authenticate via username/password; internally uses JWT stored in HTTPOnly Secure Cookies.
  - XeoDocs CLI authenticates via an API Key assigned to an administrator.
- **Dashboard:** Requires endpoints for status data and relevant updates.
- **CRUD:** Requires CRUD endpoints for all system resources.

## 2. XeoDocs-CLI (Translator's Local Tool)

A lightweight tool developed in Go installed in the translator's local environment. Its function is to abstract Git complexity and generate context for the AI "on the fly".

- **Key Commands:** `xeodocs login`, `xeodocs clone`, `xeodocs sync`, `xeodocs status`, `xeodocs list`, `xeodocs next`, `xeodocs submit`, `xeodocs logout`, `xeodocs --help`, `xeodocs --version`.

## 3. Domain Architectures

Specific architectural decisions are delegated to their respective domains:

*   **[Projects Architecture](../../domains/projects/architecture.md):** Defines Git strategies, branching models, and special file handling.
*   **[Configuration Domain](../../domains/configuration/readme.md):** Defines system-wide settings management.

