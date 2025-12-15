---
title: Database Schema Design
description: PostgreSQL schema including users, projects, languages, and files.
---

The system uses PostgreSQL (via Supabase) to manage state, projects, and configurations.

## Tables

### `users`
Stores administrator accounts.
- `id` (UUID, PK)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `api_key` (String, Unique) - Used for CLI authentication
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `projects`
Stores information about documentation projects.
- `id` (UUID, PK)
- `name` (String)
- `slug` (String, Unique) - Used for fork repository naming
- `source_website_url` (String) - Technology website URL
- `source_repo_url` (String) - Upstream repository URL
- `source_branch` (String) - Default: 'main'
- `last_checked_at` (Timestamp) - Last time the system checked for updates
- `last_commit_hash` (String) - Hash of the last processed commit
- `description` (Text, Nullable)
- `is_active` (Boolean) - Default: true
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `languages`
Stores target languages for projects.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> projects.id)
- `code` (String) - e.g., 'es', 'fr', 'pt-BR'
- `name` (String)
- `domain` (String) - The domain where this language version is published
- `is_active` (Boolean) - Default: true
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `files`
Tracks the state of individual files within a project's language scope.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> projects.id)
- `language_id` (UUID, FK -> languages.id)
- `path` (String) - Relative path in the repository
- `checksum_original` (String) - Hash (SHA-256) of the upstream file content. Used to detect updates in the source.
- `checksum_translated` (String) - Hash of the translated file content. Used to validate that the translation matches the current file state.
- `status` (Enum: `pending`, `translated`, `outdated`)
- `last_synced_at` (Timestamp)
- `updated_at` (Timestamp)

> **Design Note:** While Git is the source of truth for file content, storing checksums in the database allows the API to serve project status queries (e.g., "Show me all outdated files") in O(1) time without performing expensive Git operations or file I/O for every request. It effectively acts as a high-performance state index.

### `configurations`
Stores system-wide key/value configuration records.
- `key` (String, PK)
- `value` (Text)
- **Usage:** Stores general configuration values.
  - `worker_wake_interval` (default: 1h)
  - `project_sync_interval` (default: 24h)
  - Prompt templates

### `user_preferences` (Admin Configuration)
Stores administrator preferences as key/value records.
- `user_id` (UUID, FK -> users.id)
- `key` (String)
- `value` (Text)
- Primary Key: (`user_id`, `key`)
- **Usage:** Primarily used by the Admin Panel frontend to store preferences like theme, table columns, sorting order, etc.

### `ignored_paths`
Paths to ignore for translation (similar to gitignore).
- `id` (UUID, PK)
- `project_id` (UUID, FK -> projects.id)
- `pattern` (String) - Glob pattern

### `special_paths`
Similar to `ignored_paths`, but for special purposes (e.g., disabling Analytics).
- `id` (UUID, PK)
- `project_id` (UUID, FK -> projects.id)
- `purpose` (String) - e.g., 'disable_analytics'
- `pattern` (String) - Glob pattern

## Relationships
- A **Project** has many **Languages**.
- A **Languages** has many **Files**
- A **User** manages the system (Admin).
