---
title: Configuration Database Schema
domain: configuration
---

# Configuration Database Schema

## Tables

### `configurations`
Stores system-wide key/value configuration records.
- `key` (String, PK)
- `value` (Text)
- **Usage:** Stores general configuration values.
  - `worker_wake_interval` (default: 1h)
  - `project_sync_interval` (default: 24h)
  - Prompt templates
