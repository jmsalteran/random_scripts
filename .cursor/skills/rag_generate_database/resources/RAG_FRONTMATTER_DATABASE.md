# Metadatos (frontmatter) para documentos RAG de tipo Database

Los documentos generados por rag_generate_database deben comenzar con un bloque YAML entre `---` para que el RAG pueda identificar tipo, proyecto, alcance y segmento (si aplica).

## Campos obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `rag_document_type` | string | Siempre `database` para este tipo de documento |
| `project_name` | string | Slug del proyecto (ej. `admin`, `api`). Coincide con la carpeta `.cursor/personal/RAG_<project_name>` |
| `scope` | string | Ruta del código analizado (ej. `packages/admin`, `apps/web`) |
| `title` | string | Título legible para búsqueda y presentación (ej. "Análisis de base de datos – Admin") |

## Campos opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `generated_at` | string | Fecha/hora ISO8601 de generación (ej. `"2025-03-09T12:00:00Z"`) |
| `segment` | string | Si el documento es un segmento (ej. `users`, `billing`, `core`), nombre del segmento. Vacío o ausente = documento principal con todas las tablas o índice global |

## Ejemplo – documento principal

```yaml
---
rag_document_type: database
project_name: admin
scope: packages/admin
title: Análisis de base de datos del proyecto Admin
generated_at: "2025-03-09T12:00:00Z"
---
```

## Ejemplo – documento segmentado

```yaml
---
rag_document_type: database
project_name: admin
scope: packages/admin
title: Base de datos – Módulo Users
segment: users
generated_at: "2025-03-09T12:00:00Z"
---
```

## Uso por el RAG
- **Filtrado**: recuperar solo documentos `rag_document_type: database` o de un `project_name` concreto.
- **Contexto**: `scope` indica qué parte del repositorio representa el documento.
- **Presentación**: `title` (y `segment` si existe) para títulos en respuestas o listados.
- **Segmentos**: si hay varios archivos (ej. RAG_DATABASE_users.md), `segment` permite distinguir módulos sin parsear el nombre del archivo.
