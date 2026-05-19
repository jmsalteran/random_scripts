---
name: generating-project-overview
description: Genera un documento PROJECT_OVERVIEW.md a partir de un repositorio o carpeta de código. Analiza la estructura, dependencias y propósito del código para sintetizar propósito, objetivos, alcance, KPIs, stakeholders, dependencias y riesgos. Use when the user asks for a project overview, PROJECT_OVERVIEW, or needs to document the strategic context of a codebase or folder.
---

# Generating Project Overview

**Announce at start:** "Usando la habilidad generating-project-overview para crear PROJECT_OVERVIEW.md."

## When to use this skill
- When the user asks to create PROJECT_OVERVIEW.md.
- When the user needs to document the strategic/business context of a repository or specific folder.
- When onboarding new stakeholders or preparing project documentation.

## Workflow
- [ ] **Input**: Confirm the target path (full repo or specific subfolder, e.g. `packages/services`, `apps/web`).
- [ ] **Discovery**: Analyze package.json, README, directory structure, key source files.
- [ ] **Inference**: Extract purpose, dependencies, and scope from code and config.
- [ ] **Synthesis**: Fill `resources/PROJECT_OVERVIEW_TEMPLATE.md` with evidence-based content.
- [ ] **Output**: Save as `PROJECT_OVERVIEW.md` in the analyzed path (or user-specified location).

## Instructions

### 1. Scope the Target
- **Path**: User specifies a folder (e.g. `.` for root, `packages/api`, `apps/backoffice`).
- **Base path**: All analysis is scoped to that folder. If it contains subpackages (monorepo), analyze the relevant subtree.

### 2. Evidence Collection
Gather signals from:

| Source | Extract |
|--------|--------|
| `package.json` / `pkg.json` | Name, description, scripts, dependencies (direct + dev) |
| `README.md` | Purpose, setup, intended audience |
| Directory structure | Logical modules, entry points |
| Main entry files | Core flows, integrations |
| `.env.example` / config | External services, API keys, infra |
| Test setup | Quality expectations |

### 3. Inferring Each Section

**Propósito del proyecto**
- Use `description` from package.json, README, or inferred from module names and responsibilities.
- Identify "para quién" from: API design (B2B/B2C), roles in code, docs.

**Objetivos medibles**
- Derive from features (e.g. "automatizar X"), performance-related code, SLAs in config.
- If sparse: propose 3–5 generic product/tech goals and mark as "to validate".

**Alcance in/out**
- **In**: Features/modules present in the target folder.
- **Out**: Adjacent packages or systems not included in the path; external concerns (e.g. billing, HR) not referenced.

**KPIs y SLOs**
- Look for metrics libraries, monitoring config, health checks.
- Propose baseline/meta/frequency based on domain. Mark clearly if inferred.

**Stakeholders**
- Not derivable from code. Use placeholder table; user must fill.

**Dependencias críticas**
- From `dependencies`, external API clients, env vars. List systems, vendors, teams implied by integrations.

**Riesgos top**
- Infer from: single points of failure, vendor lock-in, complexity hotspots, security-sensitive areas.

### 4. Output Location
Default: `PROJECT_OVERVIEW.md` at the **root of the analyzed path**.
Override if user specifies a different path.

## Resources
- [resources/PROJECT_OVERVIEW_TEMPLATE.md](resources/PROJECT_OVERVIEW_TEMPLATE.md) - Template for the generated document.
