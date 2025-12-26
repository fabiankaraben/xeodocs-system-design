---
title: Identity Database Schema
domain: identity
---

# Identity Database Schema

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

### `user_preferences` (Admin Configuration)
Stores administrator preferences as key/value records.
- `user_id` (UUID, FK -> users.id)
- `key` (String)
- `value` (Text)
- Primary Key: (`user_id`, `key`)
- **Usage:** Primarily used by the Admin Panel frontend to store preferences like theme, table columns, sorting order, etc.
