---
name: rag-generate-overview
description: Genera documentación de overview (propósito, objetivos, alcance, KPIs, stakeholders, dependencias, riesgos) en Markdown optimizado para RAG. Un único documento o varios con prefijo RAG_, metadatos en frontmatter y salida en .cursor/personal/RAG_NOMBRE_PROYECTO. Use when the user asks for RAG overview, overview para RAG, or wants to feed a RAG with project strategic context. Si el usuario no indica carpeta, se debe preguntar porque puede haber múltiples proyectos.
---

# RAG Generate Overview

**Anunciar al inicio:** "Usando la habilidad rag_generate_overview para generar el overview del proyecto en formato RAG."

## When to use this skill
- Cuando el usuario pida un "overview para RAG", "generar overview RAG" o documentación estratégica de un proyecto para alimentar un sistema RAG.
- Cuando se necesite el mismo contenido que generating-project-overview (propósito, objetivos, alcance, KPIs, stakeholders, dependencias, riesgos) pero en Markdown bien estructurado, con metadatos y nombres predecibles para ingestión RAG.
- Cuando se quiera documentar la carpeta que el usuario indique, con salida en `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`.

## Workflow
- [ ] **Entrada – carpeta de trabajo**:
  - Si el usuario **indica** la carpeta del proyecto (ej. `packages/admin`, `apps/api`), usarla como **path de análisis**.
  - Si **no** indica carpeta, **preguntar**: "¿Desde qué carpeta quieres generar el overview RAG? Puede haber varios proyectos; indica la ruta (ej. packages/api, apps/web)."
- [ ] **Nombre del proyecto**: Derivar un `NOMBRE_PROYECTO` (slug) del path (ej. último segmento: `admin`, `api`) para la carpeta de salida.
- [ ] **Carpeta de destino**: Crear y usar `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` (rutas con `/`).
- [ ] **Discovery**: Analizar package.json, README, estructura de directorios, archivos de entrada y config (igual que generating-project-overview).
- [ ] **Inference**: Extraer propósito, objetivos, alcance, KPIs, stakeholders, dependencias y riesgos con evidencia del código.
- [ ] **Síntesis**: Rellenar el contenido siguiendo [resources/RAG_OVERVIEW_TEMPLATE.md](resources/RAG_OVERVIEW_TEMPLATE.md); incluir frontmatter según [resources/RAG_FRONTMATTER_OVERVIEW.md](resources/RAG_FRONTMATTER_OVERVIEW.md).
- [ ] **Decisión uno vs varios documentos**: Si el overview es muy extenso o conviene segmentar (ej. dependencias/riesgos muy largos), generar documentos adicionales `RAG_OVERVIEW_<segmento>.md` con su frontmatter y `segment`.
- [ ] **Output**: Guardar todos los `RAG_*.md` en la carpeta destino; listar y confirmar.

## Scope the target
- **Path**: El usuario especifica la carpeta (ej. `.` para raíz, `packages/api`, `apps/backoffice`). Todo el análisis se acota a esa carpeta.
- **Base path**: Si hay subpaquetes en el path, analizar el subárbol relevante.

## Evidence collection
Recoger señales de las mismas fuentes que generating-project-overview:

| Fuente | Extraer |
|--------|--------|
| `package.json` / `pkg.json` | name, description, scripts, dependencies (direct + dev) |
| `README.md` | propósito, setup, audiencia |
| Estructura de directorios | módulos lógicos, entry points |
| Archivos de entrada principales | flujos core, integraciones |
| `.env.example` / config | servicios externos, API keys, infra |
| Setup de tests | expectativas de calidad |

## Inferring each section (contenido para RAG)
- **Propósito del proyecto**: `description` de package.json/README; "para quién" desde diseño de API, roles en código, docs.
- **Objetivos medibles**: características (ej. "automatizar X"), código de rendimiento, SLAs en config; si escaso, proponer 3–5 metas y marcar "[validar]".
- **Alcance in/out**: **In** = features/módulos en la carpeta; **Out** = paquetes/sistemas no incluidos en el path.
- **KPIs y SLOs**: librerías de métricas, config de monitoreo, health checks; proponer baseline/meta/frecuencia si se infiere.
- **Stakeholders**: no derivable del código; tabla placeholder para que el usuario complete.
- **Dependencias críticas**: dependencies, clientes de API externos, env vars; listar sistemas, vendors, equipos.
- **Riesgos top**: puntos únicos de fallo, vendor lock-in, zonas de complejidad, áreas sensibles de seguridad.

## One vs multiple documents
- **Por defecto**: Un único documento `RAG_OVERVIEW.md` con todas las secciones.
- **Varios documentos** cuando:
  - Una sección es muy larga (ej. dependencias o riesgos) y conviene `RAG_OVERVIEW_DEPENDENCIES.md`, `RAG_OVERVIEW_RISKS.md`.
  - Se quiere segmentar por audiencia o dominio (ej. `RAG_OVERVIEW_STRATEGIC.md`, `RAG_OVERVIEW_OPERATIONAL.md`).
- Cada documento adicional debe tener prefijo `RAG_OVERVIEW_` o `RAG_OVERVIEW`, frontmatter completo y `segment` si aplica (ej. `segment: dependencies`).

## Metadatos (frontmatter)
Todos los documentos deben comenzar con YAML frontmatter para que el RAG pueda filtrar, contextualizar y presentar. Ver [resources/RAG_FRONTMATTER_OVERVIEW.md](resources/RAG_FRONTMATTER_OVERVIEW.md).

Campos mínimos: `rag_document_type`, `project_name`, `scope`, `title`. Opcionales: `generated_at`, `segment`.

## Output location
- **Carpeta**: `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`
- **Nombres**: `RAG_OVERVIEW.md` (principal); opcionalmente `RAG_OVERVIEW_<segmento>.md`.
- **Formato**: Markdown bien estructurado (encabezados, listas, tablas), sin JSON ni formatos binarios.

## Resources
- [resources/RAG_OVERVIEW_TEMPLATE.md](resources/RAG_OVERVIEW_TEMPLATE.md) – Plantilla con secciones y frontmatter para el overview.
- [resources/RAG_FRONTMATTER_OVERVIEW.md](resources/RAG_FRONTMATTER_OVERVIEW.md) – Esquema de metadatos para documentos de tipo overview.
- Lógica de origen: [generating-project-overview](../generating-project-overview/SKILL.md) (misma recolección e inferencia; salida adaptada a RAG).
