---
name: rag-generate-architecture
description: Genera documentación de arquitectura técnica (patrón, diagrama lógico, flujos, modelo de datos, decisiones, límites, riesgos, observabilidad, seguridad) en Markdown optimizado para RAG. Documentos con prefijo RAG_, metadatos en frontmatter y salida en .cursor/personal/RAG_NOMBRE_PROYECTO. Use when the user asks for RAG architecture, arquitectura para RAG, or wants to feed a RAG with system design. Si el usuario no indica carpeta, se debe preguntar porque puede haber múltiples proyectos.
---

# RAG Generate Architecture

**Anunciar al inicio:** "Usando la habilidad rag_generate_architecture para generar la documentación de arquitectura del proyecto en formato RAG."

## When to use this skill
- Cuando el usuario pida "arquitectura para RAG", "generar arquitectura RAG" o documentación técnica de diseño de sistema para alimentar un RAG.
- Cuando se necesite el mismo contenido que generating-architecture-doc (contexto técnico, diagrama, flujos, modelo de datos, decisiones, límites, riesgos, observabilidad, seguridad) pero en Markdown bien estructurado, con metadatos y nombres predecibles para ingestión RAG.
- Cuando se quiera documentar la carpeta que el usuario indique, con salida en `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`.

## Workflow
- [ ] **Entrada – carpeta de trabajo**:
  - Si el usuario **indica** la carpeta del proyecto (ej. `packages/admin`, `apps/api`), usarla como **path de análisis**.
  - Si **no** indica carpeta, **preguntar**: "¿Desde qué carpeta quieres generar la arquitectura RAG? Puede haber varios proyectos; indica la ruta (ej. packages/api, apps/web)."
- [ ] **Nombre del proyecto**: Derivar un `NOMBRE_PROYECTO` (slug) del path (ej. último segmento: `admin`, `api`) para la carpeta de salida.
- [ ] **Carpeta de destino**: Crear y usar `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` (rutas con `/`). Si ya existe (ej. por rag_generate_overview), usar la misma carpeta.
- [ ] **Prerrequisitos opcionales**: Si existen `database_analysis.json` y `endpoints_analysis.json` en el path (o en carpeta de docs), cargarlos. Si no, analizar bases de datos y endpoints en el path para enriquecer.
- [ ] **Discovery**: Analizar package.json, esquemas Prisma/*.prisma, estructura de directorios, middleware/rutas, config, ADRs (docs/adr, docs/decisions, .adr).
- [ ] **Inference**: Extraer patrón arquitectónico, servicios, flujos, modelo de datos, decisiones, límites, riesgos, observabilidad y seguridad con evidencia del código.
- [ ] **Síntesis**: Rellenar el contenido siguiendo [resources/RAG_ARCHITECTURE_TEMPLATE.md](resources/RAG_ARCHITECTURE_TEMPLATE.md); incluir frontmatter según [resources/RAG_FRONTMATTER_ARCHITECTURE.md](resources/RAG_FRONTMATTER_ARCHITECTURE.md).
- [ ] **Decisión uno vs varios documentos**: Por defecto un `RAG_ARCHITECTURE.md`. Si el contenido es muy extenso o conviene segmentar (ej. flujos, seguridad, observabilidad), generar `RAG_ARCHITECTURE_<segmento>.md` con su frontmatter y `segment`.
- [ ] **Output**: Guardar todos los `RAG_*.md` en la carpeta destino; listar y confirmar.

## Scope the target
- **Path**: El usuario especifica la carpeta (ej. `.` para raíz, `packages/api`). Todo el análisis se acota a esa carpeta.
- **Base path**: Para monorepos, analizar el subárbol relevante.

## Evidence collection
Recoger señales de las mismas fuentes que generating-architecture-doc:

| Fuente | Extraer |
|--------|--------|
| `package.json` | Dependencies, scripts, runtime |
| Prisma schema / `*.prisma` | Modelos, relaciones |
| `endpoints_analysis.json` (si existe) | Superficie API, flujos |
| `database_analysis.json` (si existe) | Modelo de datos, usos |
| Estructura de directorios | Capas, módulos |
| Middleware / rutas | Auth, ciclo de vida |
| `.env.example` | Servicios externos |
| `docs/adr/` o `docs/decisions/` | Enlaces ADR |
| Config (Sentry, etc.) | Observabilidad |

## Inferring each section (contenido para RAG)
- **Contexto técnico**: Patrón (MVC, Clean, Hexagonal, Serverless, etc.) desde estructura y capas; justificación (modularidad, testabilidad, equipos).
- **Diagrama lógico**: Servicios (apps, APIs), BBDD, colas/eventos, integraciones terceros; Mermaid o ASCII si ayuda.
- **Flujos clave**: Request lifecycle (Middleware → Controller → Service → Repository/DB); eventos (Pub/Sub, queues, webhooks); reconciliaciones (jobs, cron, batch).
- **Modelo de datos de alto nivel**: Entidades clave y relaciones desde Prisma/ORM; si existe database_analysis.json, usar relations y usages.
- **Decisiones técnicas vigentes**: Buscar ADR en docs/adr, docs/decisions, .adr; listar enlaces y estado (accepted, superseded).
- **Límites y constraints**: Latencia (timeouts, SLAs), costo (rate limits, tiers), compliance (GDPR, auditoría, retención), throughput (concurrencia, rate limiting).
- **Riesgos técnicos**: SPOF, deuda (TODOs, deprecated), escalado (cuellos de botella, componentes stateful).
- **Observabilidad**: Logs, métricas, trazas, alertas (Winston/Pino, Prometheus, OpenTelemetry, Sentry, etc.).
- **Seguridad**: AuthN (JWT, OAuth, API keys, sessions), AuthZ (RBAC, middleware), cifrado, secretos, auditoría.

## One vs multiple documents
- **Por defecto**: Un único documento `RAG_ARCHITECTURE.md` con todas las secciones.
- **Varios documentos** cuando:
  - Una sección es muy larga (ej. flujos, seguridad, observabilidad) y conviene `RAG_ARCHITECTURE_FLOWS.md`, `RAG_ARCHITECTURE_SECURITY.md`, `RAG_ARCHITECTURE_OBSERVABILITY.md`.
  - Se quiere segmentar por dominio o por audiencia (devops vs desarrolladores).
- Cada documento adicional debe tener prefijo `RAG_ARCHITECTURE_`, frontmatter completo y `segment` (ej. `segment: security`).

## Metadatos (frontmatter)
Todos los documentos deben comenzar con YAML frontmatter para que el RAG pueda filtrar, contextualizar y presentar. Ver [resources/RAG_FRONTMATTER_ARCHITECTURE.md](resources/RAG_FRONTMATTER_ARCHITECTURE.md).

Campos mínimos: `rag_document_type`, `project_name`, `scope`, `title`. Opcionales: `generated_at`, `segment`.

## Output location
- **Carpeta**: `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`
- **Nombres**: `RAG_ARCHITECTURE.md` (principal); opcionalmente `RAG_ARCHITECTURE_<segmento>.md`.
- **Formato**: Markdown bien estructurado (encabezados, listas, tablas, diagramas Mermaid si aplica). Sin JSON ni binarios.

## Resources
- [resources/RAG_ARCHITECTURE_TEMPLATE.md](resources/RAG_ARCHITECTURE_TEMPLATE.md) – Plantilla con secciones y frontmatter para la arquitectura.
- [resources/RAG_FRONTMATTER_ARCHITECTURE.md](resources/RAG_FRONTMATTER_ARCHITECTURE.md) – Esquema de metadatos para documentos de tipo architecture.
- Lógica de origen: [generating-architecture-doc](../generating-architecture-doc/SKILL.md) (misma recolección e inferencia; salida adaptada a RAG).
