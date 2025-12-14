---
title: Workflows
description: The 5-phase workflow from automatic detection to deployment.
---

## Phase 1: Automatic Detection (Server)
1. System detects a new *commit* in the original repository (upstream).
2. Synchronizes the `main` branch of the *fork*.
3. Analyzes the *diff* and updates the database:
   - Marks affected files as `outdated` (if they already existed).
   - Marks new files as `pending`.
4. Sends a notification to the administrator/translator (Email/Dashboard).

## Phase 2: Local Synchronization (Translator + CLI)
The translator opens their terminal and runs `xeodocs sync`. The CLI automatically performs:
1. **Authentication:** Verifies credentials against the API.
2. **Git Ops:** Pulls the `main` branch and merges changes into `local-[lang_code]`.
   - If conflicts arise, prompts the user to resolve them using standard Git tools.

## Phase 3: Assisted Translation (Human + AI)
1. **Consultation via `xeodocs next`:**
   - Queries the API: *"Which files should I translate?"*.
   - Creates a hidden folder (e.g., `.xeodocs/`).
   - XeoDocs CLI determines the next step and copies the prompt to translate the next file into the clipboard.
   - **Context-Aware Prompts:** The generated prompt automatically includes instructions for:
     - Special file rules (e.g., disabling analytics).
     - Inserting system features (Banners, Toolbar scripts).
     - Updating translation metadata.
   - The translator executes the prompt in Windsurf/Cursor.
   - **File Processing Logic:**
     - If the file remains unchanged after AI processing, it is added to `.xeodocs/irrelevant` (content not suitable for translation).
     - If the file is modified, it is added to `.xeodocs/translated`.
     - These lists allow the translator to edit or re-evaluate files.
     - If `xeodocs next` is interrupted and re-run, it ignores files locally registered as already processed.
2. **Verification:** The translator verifies the changes.

## Phase 4: Delivery and Validation (CLI + System)
1. Translator runs `xeodocs submit`.
2. **Local Validation:** CLI verifies that files marked as pending (and those in `.xeodocs/irrelevant`) have been physically modified or processed.
3. **Cleanup:** CLI deletes the temporary `.xeodocs/` folder.
4. **Push:** CLI commits and pushes to `local-[lang_code]`.
5. **State Update:** CLI notifies the API that the task is complete. API updates file statuses to `translated`.

## Phase 5: Deployment
1. When the translator decides to release a version, they create a Pull Request (manual or via CLI) from `local-[lang_code]` to `[lang_code]`.
2. Upon approval and merge, the external CI/CD pipeline triggers the site deployment.
