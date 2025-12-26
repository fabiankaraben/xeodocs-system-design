---
title: Projects Domain Architecture
domain: projects
---

# Projects Domain Architecture

## 1. Git Repository Strategy

The system relies on a strict branching strategy to manage translations:

- **`main` Branch:** Exact mirror of the *upstream* (English/original).
- **`[lang_code]` Branch:** Production branch for the target language (e.g., `es` for Spanish).
- **`local-[lang_code]` Branch:** Translator's working branch.

## 2. Special File Management

Configuration resides primarily in the Database, and the API and XeoDocs CLI consider them automatically.

- **Ignored Files:** Functionality similar to `.gitignore` but used to ignore files and directories for translation.
- **Special Editing Files:** (e.g., disabling Analytics). These rules are configured in the Admin Panel, and `xeodocs-cli` can inject specific *prompts* to remind the AI to apply them.

## 3. Additional System Features

- **Floating Toolbar Script:** The system provides prompts to insert the script that loads a floating XeoDocs Toolbar.
- **Translation Metadata:** Logic to create or update, in the root of the website's public directory, a translation metadata file for consumption by the XeoDocs Toolbar.
- **Banners:** Logic to insert banners in the content (e.g., "This is an automatic translation"), identified for future replacement if necessary.
