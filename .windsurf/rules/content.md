---
trigger: always_on
---

# System Design Repository Structure & Rules

This repository hosts the **pure system design content** (Markdown, OpenAPI, AsyncAPI) for the software project. It is decoupled from the application code and designed to be mounted as a volume into the **XeoContext** viewer via `docker-compose.yml`.

When analyzing this repository or generating code based on it, adhere to the following structural rules and Domain-Driven Design (DDD) principles.

## 1. Directory Structure Overview

The content is located at the **repository root**. It follows a strict separation between **Global Architecture** and **Bounded Contexts (Domains)**.

```text
.
├── docker-compose.yml            # Orchestration to run the viewer locally.
├── xeocontext.config.json        # [MANDATORY] The central navigation and metadata map.
├── global/                       # [MANDATORY] Cross-cutting architectural decisions & Master Roots.
│   ├── gateway/                  # 👈 UNIFIED SYSTEM API (Master Roots).
│   │   ├── openapi.yaml          # The "Master" REST API definition (imports from all domains).
│   │   └── asyncapi.yaml         # The "Master" Event definition (imports from all domains).
│   ├── adrs/                     # Architecture Decision Records.
│   └── standards/                # Coding conventions, API guidelines, etc.
└── domains/                      # [MANDATORY] Business Logic Modules.
    ├── {domain-name}/            # (e.g., identity, payments, inventory)
    │   ├── readme.md             # [MANDATORY] Domain overview and design.
    │   ├── openapi.yaml          # [OPTIONAL] Domain-specific REST API Root.
    │   └── asyncapi.yaml         # [OPTIONAL] Domain-specific Event Root.

```

## 2. The "Global" Directory (The Constitution)

This directory defines the laws of the system. **Always read this first** before generating implementation code.

* **Gateway (`/global/gateway`):** Contains the **Master Root** files. These files do not define schemas directly; they aggregate endpoints and channels from all domains to provide a unified "System View" (ideal for Frontend/Mobile clients).
* **ADRs (`/global/adrs`):** Explain *why* technical decisions were made.
* **Standards (`/global/standards`):** Define naming conventions, error handling patterns, and security protocols that apply to ALL domains.

## 3. Domain Modules (Bounded Contexts)

Each folder under `/domains` represents a specific business capability.

* **Co-location:** All documentation, API specs, and Event specs related to a domain must reside within that domain's folder.
* **Isolation:** A domain should be understandable in isolation, referencing `global` for shared patterns.

## 4. File Content Rules

### A. Markdown (Mandatory)

Every domain MUST contain at least one `.md` file (usually `readme.md`) describing:

* The problem it solves.
* Key entities and relationships.
* **Frontmatter:** Use YAML frontmatter to link to technical specs.

In global files, use the following frontmatter:

```yaml
---
title: ""
description: ""
---

```

In domain files, use the following frontmatter:

```yaml
---
title: ""
description: ""
domain: {domain-name}
specs:
  rest: ./openapi.yaml
  events: ./asyncapi.yaml
---

```

### B. OpenAPI & AsyncAPI (Fragmented & Aggregated Architecture)

You must use a **Fragmented Architecture** that supports two views: **Domain View** (Microservice) and **System View** (Gateway).

1. **Source of Truth (Components):** The actual definitions (Schemas, Paths, Messages) reside in `/domains/{name}/components/`.
2. **Domain Root:** The file `/domains/{name}/openapi.yaml` aggregates only the components of that specific domain.
3. **Master Root:** The file `/global/gateway/openapi.yaml` aggregates components from **ALL** domains using relative paths (e.g., `$ref: '../../domains/identity/components/paths/login.yaml'`).

**Required Folder Structure for Specs:**

```text
/domains/{domain-name}/
├── openapi.yaml            # [DOMAIN ROOT] Imports local ./components
├── asyncapi.yaml           # [DOMAIN ROOT] Imports local ./components
└── components/
    ├── schemas/            # Data models (Shared between REST and Events)
    ├── messages/           # AsyncAPI message definitions
    └── paths/              # OpenAPI path definitions

```

## 5. Instructions for LLM / Code Generation

1. **Context Selection:**
* **Frontend/Client Implementation:** Read `/global/gateway/openapi.yaml` to understand the unified public API.
* **Backend/Microservice Implementation:** Read `/domains/{target-domain}/openapi.yaml` to focus on the specific service contract.

2. **Standards:** Ensure generated code follows the patterns defined in `global/standards`.
3. **Spec Traversal:** Always resolve `$ref` links to understand the full structure.
4. **Schema Reuse:** Detect when the "Master Root" and "Domain Root" point to the same component files. Use this to generate shared types/interfaces to avoid code duplication.
