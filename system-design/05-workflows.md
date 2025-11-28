---
title: System Workflows
description: System Workflows
---

## 1. Project Initialization (Onboarding)

When a user adds a new repository to be translated.

```mermaid
sequenceDiagram
    participant User
    participant Core as Core Service
    participant Git as Git Worker
    participant DB as PostgreSQL
    participant MQ as RabbitMQ

    User->>Core: Create Project (Repo URL, Langs)
    Core->>DB: Save Project (Status: INITIALIZING)
    Core->>MQ: Publish `PROJECT_INIT` event
    
    MQ->>Git: Consume `PROJECT_INIT`
    Git->>Git: Fork Repository (GitHub API)
    Git->>Git: Clone Fork locally
    Git->>Git: Create Branches (lang-es, lang-fr...)
    Git->>Git: Scan for Translatable Files
    
    Git->>Core: Return File List & Hashes
    Core->>DB: Insert `source_files`
    Core->>DB: Insert `file_translations` (Status: PENDING)
    
    Core->>MQ: Publish `TRANSLATION_REQUIRED` events (for each file/lang)
```

## 2. Translation Process

How a single file gets translated.

```mermaid
sequenceDiagram
    participant MQ as RabbitMQ
    participant Translator as Translator Service
    participant LLM as External LLM API
    participant Git as Git Worker
    participant Core as Core Service
    participant DB as PostgreSQL

    MQ->>Translator: Consume `TRANSLATION_REQUIRED` <br/> (FileID, Lang, Content)
    Translator->>LLM: Send Prompt + Content
    LLM-->>Translator: Return Translated Content
    
    Translator->>MQ: Publish `TRANSLATION_COMPLETED`
    
    MQ->>Git: Consume `TRANSLATION_COMPLETED`
    Git->>Git: Checkout Branch (lang-es)
    Git->>Git: Write File
    Git->>Git: Commit & Push
    
    Git->>Core: Notify Push Success
    Core->>DB: Update `file_translations` (Status: DONE)
    
    opt If all files done
        Core->>MQ: Publish `PROJECT_TRANSLATION_FINISHED`
    end
```

## 3. Synchronization (Continuous Updates)

Periodically checking for changes in the source repository.

```mermaid
sequenceDiagram
    participant Scheduler
    participant Core as Core Service
    participant MQ as RabbitMQ
    participant Git as Git Worker
    participant DB as PostgreSQL

    Scheduler->>Core: Trigger Sync (Cron)
    Core->>MQ: Publish `SYNC_CHECK`
    
    MQ->>Git: Consume `SYNC_CHECK`
    Git->>Git: Fetch Upstream/Main
    Git->>Git: Check for new commits
    
    alt Changes Detected
        Git->>Git: Pull Changes to Local Main
        Git->>Git: Re-scan Files
        Git->>Core: Report File Changes (New Hashes)
        
        Core->>DB: Update `source_files`
        Core->>DB: Set `file_translations` to OUTDATED (if hash changed)
        Core->>MQ: Publish `TRANSLATION_REQUIRED` (for outdated files)
        
        Git->>Git: Merge/Rebase Main into Language Branches
        Git->>Git: Push Language Branches
    end
```
