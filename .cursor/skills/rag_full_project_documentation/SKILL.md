---
name: rag-full-project-documentation
description: Orquesta las habilidades rag_generate_overview, rag_generate_architecture, rag_generate_database, rag_generate_domain_rules y rag_generate_endpoints para un proyecto indicado, generando en .cursor/personal/RAG_NOMBRE_PROYECTO toda la documentación RAG (overview, arquitectura, base de datos, reglas de dominio, endpoints). Use when the user asks for full RAG documentation, documentación RAG completa del proyecto, or to feed a RAG with the whole project. Si el usuario no indica carpeta, se debe preguntar porque puede haber múltiples proyectos.
---

# RAG Full Project Documentation

**Anunciar al inicio:** "Usando la habilidad rag_full_project_documentation para generar la documentación RAG completa del proyecto."

## When to use this skill
- Cuando el usuario pida "generar toda la documentación RAG del proyecto", "documentación RAG completa" o "alimentar el RAG con todo el proyecto" para un paquete o app.
- Cuando se necesite un set completo de documentos RAG (overview, arquitectura, base de datos, reglas de dominio, endpoints) para un path indicado.
- Cuando se quiera una única carpeta `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` con todos los artefactos generados por las habilidades RAG.

## Sub-habilidades que se utilizan
Esta habilidad **dispara en secuencia** las siguientes habilidades (el agente debe leer y seguir cada una; todas escriben en la **misma carpeta de destino**):

| Orden | Sub-habilidad | Documentos generados |
|-------|----------------|----------------------|
| 1 | `rag_generate_overview` | `RAG_OVERVIEW.md` (y opcionalmente `RAG_OVERVIEW_<segmento>.md`) |
| 2 | `rag_generate_database` | `RAG_DATABASE.md` (y opcionalmente `RAG_DATABASE_<segmento>.md`, `RAG_DATABASE_INDEX.md`) |
| 3 | `rag_generate_endpoints` | `RAG_ENDPOINTS_INDEX.md`, `RAG_ENDPOINTS_<segmento>.md` (varios) |
| 4 | `rag_generate_domain_rules` | `RAG_DOMAIN_RULES.md` (y opcionalmente `RAG_DOMAIN_RULES_<segmento>.md`) |
| 5 | `rag_generate_architecture` | `RAG_ARCHITECTURE.md` (y opcionalmente `RAG_ARCHITECTURE_<segmento>.md`) |

El orden permite que `rag_generate_architecture` pueda usar opcionalmente los documentos ya generados en la carpeta (por ejemplo `RAG_DATABASE.md`, `RAG_ENDPOINTS_*.md`) para enriquecer la arquitectura.

## Workflow
- [ ] **Entrada – carpeta de trabajo**:
  - Si el usuario **indica** la carpeta del proyecto (ej. `packages/admin`, `apps/api`), usarla como **path de análisis**.
  - Si **no** indica carpeta, **preguntar**: "¿Desde qué carpeta quieres generar la documentación RAG completa? Puede haber varios proyectos; indica la ruta (ej. packages/admin, apps/web)."
- [ ] **Nombre del proyecto**: Derivar un `NOMBRE_PROYECTO` (slug) del path (ej. último segmento: `admin`, `api`).
- [ ] **Carpeta de destino**: Crear y usar `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` (rutas con `/`). Todas las sub-habilidades escribirán aquí.
- [ ] **Ejecutar cada sub-habilidad en orden**:
  1. Leer el `SKILL.md` de la sub-habilidad en `.cursor/skills/<nombre>/` (ej. `rag_generate_overview`, `rag_generate_database`, etc.).
  2. Seguir su Workflow e Instructions con el **mismo path de análisis** y con **carpeta de destino** `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`.
  3. Cada sub-habilidad ya define como salida esa carpeta cuando el path de análisis es el indicado; no es necesario reescribir archivos en otro sitio.
- [ ] **Verificación**: Listar la carpeta de destino y confirmar que existen documentos RAG de cada tipo (overview, database, endpoints, domain_rules, architecture). Pueden ser varios archivos por tipo según segmentación.
- [ ] **Resumen**: Indicar al usuario la ruta `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` y los archivos generados.

## Instrucciones

### 1. Definir alcance y destino
- **Path de análisis**: Debe ser una ruta válida dentro del repositorio (ej. `packages/admin`). Todo el análisis de las sub-habilidades se limita a ese path.
- **Carpeta de destino**: Siempre `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`, donde `NOMBRE_PROYECTO` es el slug derivado del path. Crear la carpeta si no existe.
- No escribir los documentos en la raíz del código analizado; siempre en la carpeta RAG para mantener un único pack de documentación para ingestión RAG.

### 2. Cómo invocar cada sub-habilidad
El agente **no** llama a las sub-habilidades como funciones. Debe:
1. Abrir y leer el `SKILL.md` de la sub-habilidad (ej. `.cursor/skills/rag_generate_overview/SKILL.md`).
2. Ejecutar su flujo (Entrada, Discovery, Synthesis, Output, etc.) usando el **mismo path de análisis** acordado.
3. La sub-habilidad ya escribe por defecto en `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`; asegurarse de que el slug usado sea el mismo en todas (derivado del path). No cambiar la ubicación de salida.

### 3. Dependencias entre documentos
- `rag_generate_architecture` (última en la secuencia) puede usar como entrada opcional los documentos ya generados en la carpeta: `RAG_DATABASE.md`, `RAG_ENDPOINTS_*.md`. Al ejecutarla, el agente puede leer desde la carpeta de destino para enriquecer `RAG_ARCHITECTURE.md` si la skill lo indica.

### 4. Estructura final de la carpeta de destino
Al terminar, la carpeta `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` debe contener al menos:

```
.cursor/personal/RAG_<NOMBRE_PROYECTO>/
  RAG_OVERVIEW.md
  RAG_DATABASE.md
  RAG_ENDPOINTS_INDEX.md
  RAG_ENDPOINTS_<segmento>.md   (uno o más)
  RAG_DOMAIN_RULES.md
  RAG_ARCHITECTURE.md
```

Y opcionalmente más archivos por segmentación (ej. `RAG_OVERVIEW_DEPENDENCIES.md`, `RAG_DATABASE_users.md`, `RAG_ARCHITECTURE_SECURITY.md`, etc.).

### 5. Ejemplo de uso
- Usuario: "Genera la documentación RAG completa para packages/admin."
- El agente: anuncia la habilidad, usa path `packages/admin`, nombre proyecto `admin`, crea o usa `.cursor/personal/RAG_admin/`, ejecuta en orden rag_generate_overview → rag_generate_database → rag_generate_endpoints → rag_generate_domain_rules → rag_generate_architecture, y confirma los archivos generados.
- Usuario: "Quiero documentación RAG completa del proyecto."
- El agente: "¿Desde qué carpeta quieres generar la documentación RAG completa? Puede haber varios proyectos; indica la ruta (ej. packages/admin, apps/web)."

## Resources
- Sub-habilidades (todas bajo `.cursor/skills/`):
  - [rag_generate_overview](../rag_generate_overview/SKILL.md)
  - [rag_generate_architecture](../rag_generate_architecture/SKILL.md)
  - [rag_generate_database](../rag_generate_database/SKILL.md)
  - [rag_generate_domain_rules](../rag_generate_domain_rules/SKILL.md)
  - [rag_generate_endpoints](../rag_generate_endpoints/SKILL.md)
- [resources/SUB_SKILLS_ORDER.md](resources/SUB_SKILLS_ORDER.md) – Orden y propósito de cada sub-habilidad.
