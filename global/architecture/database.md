---
title: Database Schema Design
description: Global overview of the database schema and links to domain-specific schemas.
---

# Database Schema Design

The system uses PostgreSQL (via Supabase) to manage state, projects, and configurations.

Following Domain-Driven Design principles, the schema definitions are distributed across their respective domains.

## Domain Schemas

*   **[Identity Schema](../../domains/identity/database.md)**
    *   `users`: Administrator accounts.
    *   `user_preferences`: UI/Admin preferences.

*   **[Projects Schema](../../domains/projects/database.md)**
    *   `projects`: Documentation repositories.
    *   `languages`: Translation targets.
    *   `files`: State tracking and checksums.
    *   `ignored_paths`: Translation exclusion patterns.
    *   `special_paths`: Special rule patterns.

*   **[Configuration Schema](../../domains/configuration/database.md)**
    *   `configurations`: System-wide dynamic settings.

## Global Relationships Overview

While each domain owns its tables, there are relationships that cross domain boundaries:

*   **Identity -> Projects**: Currently loosely coupled. Users manage projects, but there is no strict database foreign key constraint required for the core "Project" logic, although typically `users` manage the system.
*   **Projects -> Files/Languages**: Strictly coupled within the **Projects Domain**.

For detailed field definitions, please refer to the specific domain documentation linked above.
