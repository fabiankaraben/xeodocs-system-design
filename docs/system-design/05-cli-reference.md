---
title: CLI Reference
description: XeoDocs-CLI commands and local state management.
---

The XeoDocs CLI is a Go-based binary used by translators to interact with the system without needing deep knowledge of the underlying Git operations or database states.

## Commands

### `xeodocs login`
Authenticates the user with the XeoDocs API.
- **Input:** API Key (or username/password prompt depending on implementation).
- **Action:** Validates credentials and stores a session token or the API key locally.

### `xeodocs sync`
Synchronizes the local environment with the upstream changes.
- **Actions:**
  - Authenticates.
  - Pulls `main` branch from the fork.
  - Merges `main` into `local-[lang_code]`.
  - Handles basic git operations.
  - Alerts user on conflicts.

### `xeodocs status`
Shows the current status of the translation project.
- **Output:** List of pending files, outdated files, and progress percentage.

### `xeodocs list`
Lists all files requiring attention.
- **Output:** File paths and their status (`pending`, `outdated`).

### `xeodocs next`
Initiates the translation workflow for the next available file.
- **Actions:**
  - Queries API for the next high-priority file.
  - Creates/Updates `.xeodocs/` directory.
  - Generates a prompt for the AI (Windsurf/Cursor) and copies it to the clipboard.
  - Tracks processed files in `.xeodocs/translated` or `.xeodocs/irrelevant`.
  - Skips locally processed files on subsequent runs.

### `xeodocs submit`
Submits the completed work to the repository and updates the system.
- **Actions:**
  - Validates that pending files have been processed.
  - Cleans up `.xeodocs/` folder.
  - Commits changes to `local-[lang_code]`.
  - Pushes to the remote fork.
  - Calls API to update file statuses to `translated`.

## Local State Management (`.xeodocs/`)
- **.xeodocs/translated:** List of files modified by the AI/Translator during the current session.
- **.xeodocs/irrelevant:** List of files processed but deemed not requiring translation (unchanged).
- **Usage:** Used by `xeodocs next` to track session progress and by `xeodocs submit` for validation.

## Special Prompts & Capabilities
The CLI is capable of injecting specific instructions into the AI context to handle special system features:

### Special Editing Files
- **Purpose:** Handle file-specific rules defined in the Admin Panel (e.g., disabling Analytics scripts in translated versions).
- **Mechanism:** The CLI checks `special_paths` configuration and injects a reminder prompt to the AI when processing matching files.

### Feature Injection
The CLI provides specific prompts to help the AI implement XeoDocs system features:
1. **Floating Toolbar Script:** Prompt to insert the script tag required to load the XeoDocs floating toolbar.
2. **Translation Metadata:** Prompt to create or update a metadata JSON file in the public root directory, consumed by the toolbar.
3. **Banners:** Prompt to insert content banners (e.g., "This is an automatic translation") that are identified for easy future replacement.
