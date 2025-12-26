---
title: Workflows
description: The 5-phase workflow from automatic detection to deployment.
---

## Overview

The XeoDocs workflow orchestrates the interaction between the Background Worker, the Translator (via CLI), and the Deployment pipeline.

Detailed business rules and logic are defined in the **[Projects Domain Workflows](../../domains/projects/workflows.md)**.

## Phase 0: Project Provisioning
*Triggered by API interactions.*

- **Action:** Verification and creation of GitHub forks.
- **Responsibility:** Projects Domain.

## Phase 1: Automatic Detection
*Triggered by Background Worker.*

- **Action:** Periodic monitoring of upstream repositories.
- **Logic:** Detects changes (Diff Analysis) and marks files as `outdated` or `pending`.
- **See:** [Automatic Synchronization Logic](../../domains/projects/workflows.md#1-automatic-synchronization-background-worker).

## Phase 2: Local Synchronization
*Triggered by Translator (CLI).*

1.  **Authenticate:** `xeodocs login`
2.  **Clone/Open:** `xeodocs clone`
3.  **Sync:** `xeodocs sync` pulls the latest changes from the system's fork to the local environment.

## Phase 3: Assisted Translation
*Triggered by Translator (CLI + AI).*

1.  **Selection:** `xeodocs next` queries the API for the next task.
2.  **Processing:** AI Agent (Windsurf/Cursor) translates content using context-aware prompts.
3.  **Classification:** Files are locally categorized as `translated` or `irrelevant`.
4.  **See:** [Assisted Translation Logic](../../domains/projects/workflows.md#2-assisted-translation-logic-next-file).

## Phase 4: Delivery and Validation
*Triggered by Translator (CLI).*

1.  **Submit:** `xeodocs submit` performs validation and pushes changes.
2.  **State Update:** System updates database status to `translated`.
3.  **See:** [Submission & Validation](../../domains/projects/workflows.md#3-submission--validation).

## Phase 5: Deployment
*Triggered by Pull Request.*

1.  **Release:** Translator creates a PR from `local-[lang]` to `[lang]`.
2.  **CI/CD:** External pipeline triggers site deployment.
