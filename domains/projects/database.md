---
title: Projects Database Schema
domain: projects
---

# Projects Database Schema

## Tables

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
