# Metadatos (frontmatter) para documentos RAG de tipo Endpoints

Los documentos generados por rag_generate_endpoints deben comenzar con un bloque YAML entre `---` para que el RAG pueda identificar tipo, proyecto, alcance y segmento (si aplica).

## Campos obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `rag_document_type` | string | Siempre `endpoints` para este tipo de documento |
| `project_name` | string | Slug del proyecto (ej. `admin`, `api`). Coincide con la carpeta `.cursor/personal/RAG_<project_name>` |
| `scope` | string | Ruta del código analizado (ej. `packages/admin`, `apps/web`) |
| `title` | string | Título legible para búsqueda y presentación (ej. "Endpoints API – Admin") |

## Campos opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `generated_at` | string | Fecha/hora ISO8601 de generación (ej. `"2025-03-09T12:00:00Z"`) |
| `segment` | string | Si el documento es un segmento (ej. `users`, `orders`, `v1`), nombre del segmento. Para el índice global usar `index` o dejar vacío |

## Ejemplo – documento índice

```yaml
---
rag_document_type: endpoints
project_name: admin
scope: packages/admin
title: Índice de endpoints API – Admin
segment: index
generated_at: "2025-03-09T12:00:00Z"
---
```

## Ejemplo – documento segmentado

```yaml
---
rag_document_type: endpoints
project_name: admin
scope: packages/admin
title: Endpoints API – Módulo Users
segment: users
generated_at: "2025-03-09T12:00:00Z"
---
```

## Uso por el RAG
- **Filtrado**: recuperar solo documentos `rag_document_type: endpoints` o de un `project_name` concreto.
- **Contexto**: `scope` indica qué parte del repositorio representa el documento.
- **Presentación**: `title` (y `segment` si existe) para títulos en respuestas o listados.
- **Búsqueda**: el RAG puede responder "¿Qué hace POST /api/users?" recuperando el documento de endpoints (índice o segmento) y el bloque correspondiente al endpoint.
