---
title: Projects Domain Workflows
domain: projects
---

# Projects Domain Workflows

This document details the internal business logic and state transitions for the Projects domain.

## 1. Automatic Synchronization (Background Worker)

The system maintains an active mirror of the upstream repository through a background worker process.

### Logic & Rules
1.  **Wake Cycle:** The worker runs periodically (configured via `worker_wake_interval`, default **1 hour**).
2.  **Project Eligibility:** Checks active projects where `last_checked_at` > configured interval (default **24 hours**).
3.  **Sync Process:**
    *   **Poll:** Fetches the latest commit hash from the upstream repository.
    *   **Diff Analysis:** If `upstream_hash` != `project.last_commit_hash`:
        *   Performs `git merge` on the cached repository.
        *   Calculates new checksums (SHA-256) for all files.
        *   Updates `files` table:
            *   **New File:** Insert with status `pending`.
            *   **Modified File:** Update status to `outdated` if previously `translated`.
            *   **Deleted File:** Mark as deleted or remove from tracking.
    *   **State Update:** Updates `projects.last_commit_hash` and `last_checked_at`.
    *   **Notification:** Triggers event for administrators.

## 2. Assisted Translation Logic (Next File)

Logic determining which file is served to the translator via `xeodocs next`.

### Context-Aware Prompts
The system generates prompts including:
*   **Special Rules:** Checks `special_paths` (e.g., "disable analytics").
*   **Metadata:** Instructions to update frontmatter.

### File Processing Rules
When the CLI processes a file, the system categorizes the result:
*   **Irrelevant:** If the content remains unchanged after AI processing (added to `.xeodocs/irrelevant`).
*   **Translated:** If the content is modified (added to `.xeodocs/translated`).

## 3. Submission & Validation

When `xeodocs submit` is executed:
1.  **Validation:** Verifies that all files marked as `pending` (or `outdated`) in the current batch have been processed locally.
2.  **State Transition:** Upon successful push, the API updates the `files.status` to `translated`.

## 4. Provisioning Hooks

*   **On Creation:** Verifies/Creates the fork on GitHub.
*   **On Update:** Re-verifies repository connectivity.
