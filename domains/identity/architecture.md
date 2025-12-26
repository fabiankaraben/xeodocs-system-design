---
title: Identity Architecture & Security
domain: identity
---

# Identity Architecture & Security

## Authentication Mechanisms

### Admin Panel
- **Method:** JWT (JSON Web Token).
- **Storage:** HTTPOnly Secure Cookies.
- **Flow:** Standard Username/Password login exchanges credentials for a session cookie.

### CLI (Command Line Interface)
- **Method:** Long-lived API Keys.
- **Flow:** The Administrator generates an API Key. The CLI stores it locally and sends it in headers (e.g., `X-API-Key`) for requests.

## Access Control (RBAC)
- **Current State:** Single role (**Administrator**) with full access.
- **Future Design:** Granular permissions (Editor, Viewer, etc.).

## Data Protection
- **Passwords:** Hashed using bcrypt/argon2 before storage.
- **API Keys:** Generated securely and stored in the database.
