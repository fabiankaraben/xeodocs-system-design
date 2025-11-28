# XeoDocs System Design

This directory contains the technical specifications for the XeoDocs system.

## Table of Contents

1. **[Overview](./01-overview.md)**
   - High-level architecture
   - Technology stack
   - Key concepts (Project, Syncing, etc.)

2. **[Microservices Architecture](./02-microservices.md)**
   - Service breakdown (Auth, Core, Git Worker, Translator, etc.)
   - Responsibilities and communication patterns (gRPC, RabbitMQ)

3. **[Data Model & Schema](./03-data-model.md)**
   - ER Diagram
   - PostgreSQL schema definitions
   - File tracking strategy

4. **[Infrastructure & Deployment](./04-infrastructure.md)**
   - Kubernetes setup (Production vs. Dev)
   - GitOps (Argo CD)
   - Secrets Management (Infisical)

5. **[Workflows](./05-workflows.md)**
   - Sequence diagrams for:
     - Project Initialization
     - Translation Process
     - Synchronization Loop
