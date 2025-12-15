---
title: Workflows
description: The 5-phase workflow from automatic detection to deployment.
---

## Phase 0: Project Provisioning & Fork Management
Synchronization mechanisms are triggered at specific lifecycle events:

1. **On Project Creation (`POST /projects`)**:
   - Immediately verifies that the fork exists on GitHub or creates it if it doesn't.
   - *Note:* At this step, neither the commit hash is saved nor the "Sync" executed; only the existence of the fork repository is guaranteed.

2. **On Project Update (`PATCH /projects/{id}`)**:
   - Immediately re-verifies that the fork exists (in case the slug or original repo URL was changed).

## Phase 1: Automatic Detection (Background Worker)
The system uses a background worker for periodic synchronization:

1. **Wake Cycle:** The worker wakes up every **1 hour** (configurable via `worker_wake_interval`).
2. **Check:** In each execution, it reviews all active projects.
   - Compares the `last_checked_at` date against the configured interval (default **24 hours**, configurable via `project_sync_interval`).
3. **Execution:** If the time has passed (or if it has never been checked):
   - **Poll:** Consults the latest commit of the original repository (upstream).
   - **Sync:** If the hash differs from `projects.last_commit_hash`, executes the synchronization (`merge-upstream`) on GitHub.
   - **Update:** Updates the database with the new hash (`last_commit_hash`) and the check date (`last_checked_at`).
   - **Analysis:** Analyzes the *diff* and updates the file statuses:
     - Calculates new checksums.
     - Marks files as `outdated` or `pending` accordingly.
   - **Notify:** Sends a notification to the administrator/translator.

**Flow Summary for a New Project:**
1. Created -> Fork created on GitHub instantly.
2. Within the next hour -> Worker detects it has never been checked, fetches current commit, syncs (if needed), and saves initial hash/date.
3. Afterwards -> Checked every "X" time (defined in `project_sync_interval`).

## Phase 2: Local Synchronization (Translator + CLI)
Before executing `xeodocs sync`, the translator must:
1. **Authenticate:** Run `xeodocs login` if not done before.
2. **Clone Repository:** Run `xeodocs clone` if not done before.
3. **Open Directory:** Open the cloned repository directory with their favorite editor (Windsurf, Cursor, VSCode).
4. **Switch Branch:** Switch to the `local-[lang_code]` branch using the editor's graphical options (the branch should already exist in the repository).

Now, proceed to run `xeodocs sync`. The CLI automatically performs:
1. **Authentication Check:** Verifies credentials against the API.
2. **Git Ops:** Pulls the `main` branch and merges changes into `local-[lang_code]`.
   - If conflicts arise, prompts the user to resolve them using standard Git tools.

**Special Case:** A `xeodocs sync` can be executed prior to switching to the `local-[lang_code]` branch to download the branch itself (e.g., when the target language was configured after the repository was locally cloned).

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
