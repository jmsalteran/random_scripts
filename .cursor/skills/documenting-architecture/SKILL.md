---
name: documenting-architecture
description: Synthesizes structured data from existing analysis skills (databases, endpoints) and performs general code inspection to generate a deep, robust technical architecture document. Includes detailed mapping of project modules, third-party libraries, external services, and security patterns. Use when the user wants a "master view" of the system or a technical deep-dive.
---

# Documenting Architecture

## When to use this skill
- When the user asks for a "comprehensive system overview" or "architecture documentation".
- **Mandatory**: Use this after running `analyzing-databases` and `analyzing-endpoints` to synthesize their outputs.
- When the user needs to understand the relationship between the API surface, internal modules, and the Data layer.
- When you need to document the security posture and external service dependencies of the project.

## Workflow
- [ ] **Prerequisite Check**: Verify that `database_analysis.json` and `endpoints_analysis.json` exist. If not, trigger the `analyzing-databases` and `analyzing-endpoints` skills first.
- [ ] **Data Ingestion**: Read and parse the structured JSON outputs from the prerequisite skills.
- [ ] **Eco-System Discovery**:
    - Analyze `package.json` (or equivalent) to categorize all installed libraries (e.g., Auth, Persistence, State, Utils).
    - Scan for external service integrations (API keys in `.env.example`, service clients in code).
- [ ] **Internal Module Mapping**:
    - Identify logical modules based on directory structure and responsibility.
    - Map module interactions (how `/services` talk to `/repositories`, etc.).
- [ ] **Security Profile**:
    - Identify authentication strategies (JWT, OAuth, Sessions).
    - Document authorization middleware and data protection patterns found in the endpoint analysis.
- [ ] **Synthesis & Evaluation**:
    - **Cross-Reference**: Map which Endpoints trigger which Modules and touch which Database Models.
    - **Architecture Style**: Confirm if it follows MVC, Clean Architecture, Serverless, etc.
- [ ] **Drafting**: Fill out the `resources/ARCHITECTURE_TEMPLATE.md`.
- [ ] **Output**: Save as `ARCHITECTURE.md` (or user-specified filename).

## Instructions

### 1. Ingesting Analysis Data
- **Load `endpoints_analysis.json`**: Extract the `decision_tree` and `method_calls` to understand the logical flow of the system.
- **Load `database_analysis.json`**: Use the `relations` and `usages` to map the data backbone.
- *Goal*: Synthesize these into a cohesive narrative (e.g., "The Order Module manages the transition of 'Pending' orders to 'Shipped' by calling the Shipping Service and updating the Inventory table").

### 2. Dependency & Service Analysis
Do not just list dependencies. Categorize them:
- **Core Frameworks**: The foundation of the app.
- **Data & Persistence**: ORMs, Query builders, Cache clients.
- **Security & Identity**: Libraries for hashing, tokens, or OAuth.
- **External Services**: Identify third-party APIs (Stripe, SendGrid, AWS) used in the code.

### 3. Module Archetype Identification
Analyze the project structure to define the architecture:
- **Folder Mapping**: Assign responsibilities to top-level folders.
- **Internal API**: Note how different layers of the app communicate (e.g., Dependency Injection, Event Emitters).

### 4. Security & Authentication Patterns
Extract security details from the codebase:
- **Auth Flow**: Describe how a user identifies themselves.
- **Authorization**: Explain how permissions are checked (e.g., RBAC, ABAC) based on the `decision_tree` in the endpoint analysis.
- **Data Protection**: Note encryption or sanitization libraries used.

### 5. Writing the Document
Use the `resources/ARCHITECTURE_TEMPLATE.md`. Ensure every section is populated based on the gathered evidence.
- **System Overview**: High-level summary.
- **Library Ecosystem**: Categorized deep-dive into dependencies.
- **Internal Architecture**: Module map and directory explanation.
- **API & Data Flow**: Synthesized view of the system's "pipes".
- **Security Posture**: Auth and permission details.

## Resources
- [resources/ARCHITECTURE_TEMPLATE.md](resources/ARCHITECTURE_TEMPLATE.md) - The master structure for the final report.
