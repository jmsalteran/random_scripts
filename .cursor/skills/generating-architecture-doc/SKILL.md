---
name: generating-architecture-doc
description: Genera un documento ARCHITECTURE.md a partir de un repositorio o carpeta de código. Analiza patrón arquitectónico, servicios, flujos, modelo de datos, decisiones técnicas, límites, riesgos, observabilidad y seguridad. Use when the user asks for ARCHITECTURE.md, technical architecture, or needs to document the system design of a codebase or folder.
---

# Generating Architecture Document

**Announce at start:** "Usando la habilidad generating-architecture-doc para crear ARCHITECTURE.md."

## When to use this skill
- When the user asks to create ARCHITECTURE.md.
- When the user needs technical architecture documentation for a repo or specific folder.
- When onboarding developers or preparing design reviews.

## Workflow
- [ ] **Input**: Confirm the target path (full repo or subfolder, e.g. `packages/api`, `apps/web`).
- [ ] **Optional Prerequisites**: If `database_analysis.json` and `endpoints_analysis.json` exist, load them. Else run `analyzing-databases` and `analyzing-endpoints` on the target path.
- [ ] **Discovery**: Analyze package.json, Prisma/schema, directory structure, middleware, config, ADRs.
- [ ] **Synthesis**: Fill `resources/ARCHITECTURE_TEMPLATE.md` with evidence-based content.
- [ ] **Output**: Save as `ARCHITECTURE.md` at the root of the analyzed path (or user-specified location).

## Instructions

### 1. Scope the Target
- **Path**: User specifies folder (e.g. `.` for root, `packages/services`).
- All analysis scoped to that path. For monorepos, analyze the subtree.

### 2. Evidence Collection
Gather from:

| Source | Extract |
|--------|--------|
| `package.json` | Dependencies, scripts, runtime |
| Prisma schema / `*.prisma` | Models, relations |
| `endpoints_analysis.json` | API surface, flows |
| `database_analysis.json` | Data model, usages |
| Directory structure | Layers, modules |
| Middleware / routes | Auth, lifecycle |
| `.env.example` | External services |
| `docs/adr/` or `docs/decisions/` | ADR links |
| Config (Sentry, etc.) | Observability |

### 3. Inferring Each Section

**Contexto técnico**
- Identify pattern (MVC, Clean Architecture, Hexagonal, Serverless, etc.) from folder structure and layering.
- Explain why (modularity, testability, team boundaries).

**Diagrama lógico**
- List: servicios (apps, APIs), bases de datos, colas/eventos, integraciones con terceros.
- Use Mermaid or ASCII for a simple diagram if useful.

**Flujos clave**
- **Request lifecycle**: Middleware → Controller → Service → Repository/DB.
- **Eventos**: Pub/Sub, queues, webhooks.
- **Reconciliaciones**: Jobs, cron, batch sync.

**Modelo de datos de alto nivel**
- Key entities and relations from Prisma/ORM schema.
- If `database_analysis.json` exists, use its `relations` and `usages`.

**Decisiones técnicas vigentes**
- Scan `docs/adr/`, `docs/decisions/`, `.adr/` for ADR files.
- List links; summarize status (accepted, superseded).

**Límites y constraints**
- Latency: timeouts, SLA hints in config/code.
- Costo: rate limits, external API tiers.
- Compliance: GDPR, audit trails, retention.
- Throughput: concurrency, rate limiting.

**Riesgos técnicos**
- SPOF: single DB, single service, no failover.
- Deuda: TODOs, deprecated patterns, tech debt comments.
- Escalado: bottlenecks, stateful components.

**Observabilidad**
- Logs: Winston, Pino, console.
- Métricas: Prometheus, StatsD, custom.
- Trazas: OpenTelemetry, Jaeger, Datadog.
- Alertas: Sentry, PagerDuty, thresholds in config.

**Seguridad**
- **AuthN**: JWT, OAuth, API keys, sessions.
- **AuthZ**: RBAC, middleware, permissions.
- **Cifrado**: TLS, at-rest encryption, libs.
- **Secretos**: env vars, vault, rotation.
- **Auditoría**: audit logs, who/what/when.

### 4. Output Location
Default: `ARCHITECTURE.md` at the root of the analyzed path.
Override if user specifies different path.

## Resources
- [resources/ARCHITECTURE_TEMPLATE.md](resources/ARCHITECTURE_TEMPLATE.md) - Template for the generated document.
