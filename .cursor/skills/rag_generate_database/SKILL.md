---
name: rag-generate-database
description: Genera documentación de análisis de base de datos (modelos, relaciones, conceptos de dominio, uso en código) en Markdown optimizado para RAG. Incluye la totalidad de tablas y columnas para que el RAG pueda responder a todo. Documentos con prefijo RAG_, metadatos en frontmatter y salida en .cursor/personal/RAG_NOMBRE_PROYECTO. Use when the user asks for RAG database analysis, análisis de BD para RAG, or wants to feed a RAG with data model. Si el usuario no indica carpeta, se debe preguntar porque puede haber múltiples proyectos.
---

# RAG Generate Database

**Anunciar al inicio:** "Usando la habilidad rag_generate_database para generar el análisis de base de datos del proyecto en formato RAG."

## When to use this skill
- Cuando el usuario pida "análisis de base de datos para RAG", "generar database RAG" o documentación del modelo de datos para alimentar un RAG.
- Cuando se necesite el mismo contenido que generating-database-analysis (visión general, diccionario por tabla, conceptos de dominio, topología de relaciones, esquema completo) pero en Markdown bien estructurado, con metadatos y nombres predecibles para ingestión RAG.
- **Requisito RAG**: Incluir **la totalidad de las tablas y la totalidad de las columnas** en la documentación generada, sin omitir ninguna; el RAG debe poder responder preguntas sobre cualquier tabla o columna.

## Workflow
- [ ] **Entrada – carpeta de trabajo**:
  - Si el usuario **indica** la carpeta del proyecto (ej. `packages/admin`, `apps/api`), usarla como **path de análisis**.
  - Si **no** indica carpeta, **preguntar**: "¿Desde qué carpeta quieres generar el análisis de base de datos RAG? Puede haber varios proyectos; indica la ruta (ej. packages/api, apps/web)."
- [ ] **Nombre del proyecto**: Derivar un `NOMBRE_PROYECTO` (slug) del path (ej. último segmento: `admin`, `api`) para la carpeta de salida.
- [ ] **Carpeta de destino**: Crear y usar `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` (rutas con `/`). Reutilizar si ya existe (ej. por rag_generate_overview o rag_generate_architecture).
- [ ] **Descubrimiento del esquema**: Ubicar archivos de definición (`schema.prisma`, migraciones SQL, entidades TypeORM/Hibernate, etc.) dentro del alcance. En monorepos, el schema puede estar en un paquete compartido (ej. `packages/db/prisma/schema.prisma`) referenciado por el proyecto.
- [ ] **Extracción completa**: Para **cada** tabla y **cada** columna: tipo, restricciones, relaciones. Si el schema es **Prisma y grande** (muchas tablas/columnas o archivo que excede límites de lectura), **usar script de parseo** (ver sección "Extracción con script para Prisma" más abajo); en caso contrario, leer el schema y rellenar manualmente.
- [ ] **Conceptos de dominio**: Abstraer conceptos de negocio por tabla a partir del uso en código; explicar columnas que condicionan lógica (status, flags, FKs). Si se usó script, añadir al documento generado una sección breve de topología/uso (modelos centrales, relaciones clave).
- [ ] **Síntesis**: Rellenar contenido siguiendo [resources/RAG_DATABASE_TEMPLATE.md](resources/RAG_DATABASE_TEMPLATE.md) si existe; incluir frontmatter según [resources/RAG_FRONTMATTER_DATABASE.md](resources/RAG_FRONTMATTER_DATABASE.md). **Incluir listado exhaustivo de columnas por tabla** (todas las columnas, sin excepción).
- [ ] **Decisión uno vs varios documentos**: Por defecto un `RAG_DATABASE.md`. Si hay muchas tablas y el documento resulta muy largo, segmentar por dominio o módulo (ej. `RAG_DATABASE_users.md`, `RAG_DATABASE_orders.md`) manteniendo en cada segmento la lista completa de tablas/columnas de ese segmento y referencias al resto.
- [ ] **Output**: Guardar todos los `RAG_*.md` en la carpeta destino. Incluir al final el esquema completo en formato original (Prisma/SQL/entidades) **o** referenciar explícitamente la ruta al archivo del schema como fuente de verdad (suficiente cuando el documento ya lista todas las tablas y columnas). Listar y confirmar.

## Scope the target
- **Path**: El usuario especifica la carpeta (ej. `.` para raíz, `packages/api`). Todo el análisis se acota a esa carpeta.
- **Base path**: Para monorepos, analizar el subárbol relevante.

## Regla crítica: totalidad de tablas y columnas
- **Todas las tablas** del esquema descubierto deben aparecer documentadas (ninguna omitida).
- **Todas las columnas** de cada tabla deben aparecer en el documento: nombre, tipo de dato, restricciones (nullable, unique, default, @relation), y breve descripción o uso cuando se pueda inferir del código.
- **Schema Prisma muy grande**: Si el archivo no puede leerse entero o tiene muchas tablas/columnas, **usar el script de parseo** descrito en "Extracción con script para Prisma"; no confiar en lecturas parciales ni resúmenes, o el documento quedará incompleto.
- Objetivo: que el RAG pueda responder preguntas del tipo "¿qué columnas tiene la tabla X?", "¿qué tipo tiene el campo Y?", "¿en qué tablas aparece el campo Z?" sin huecos de información.

## Evidence collection
Recoger señales de las mismas fuentes que generating-database-analysis:

| Fuente | Extraer |
|--------|--------|
| `schema.prisma` / `*.prisma` | Modelos, campos, tipos, relaciones, índices, @@map |
| Migraciones SQL | Tablas, columnas, FKs, índices, constraints |
| Entidades TypeORM/Hibernate/etc. | Clases, propiedades, relaciones |
| Código (servicios, repos, controladores) | Uso de modelos: queries, creates, updates, filtros por columna |

## Extracción con script para Prisma (schema grande)

Cuando el schema es **Prisma** y el archivo es **muy grande** (p. ej. >100k caracteres, muchas tablas/columnas) o no puede leerse por completo en una sola pasada, **obligatorio** usar un script que parsee el archivo y genere el Markdown con todas las tablas y columnas. Así se garantiza la **totalidad** sin depender del límite de contexto.

1. **Ubicar el schema**: Ruta al `schema.prisma` (p. ej. `packages/db/prisma/schema.prisma`). Si el proyecto analizado (ej. `packages/admin`) usa un paquete compartido `@meru/db` o similar, el schema suele estar en ese paquete.
2. **Crear un script temporal** (Node.js recomendado) que:
   - Lea el archivo completo con `fs.readFileSync(schemaPath, 'utf8')` y recorra las líneas.
   - Detecte bloques `enum Nombre { ... }`: extraer nombre y **todos** los valores (líneas hasta `}`).
   - Detecte bloques `model Nombre { ... }`: extraer nombre y **cada** línea que sea un campo (patrón: espacios, identificador, tipo, atributos opcionales). Regex de referencia: `^\s{2,}(\w+)\s+(\S+(?:\s*\?\s*)?|\S+\[\])\s*(.*)$` para capturar nombre de campo, tipo y resto (atributos).
   - Genere un único Markdown con: frontmatter (rag_document_type, project_name, scope, title, generated_at); sección 1 Visión general; sección 2 Enums (cada enum con todos sus valores); sección 3 Modelos (por cada modelo: título "### Tabla: Nombre", tabla con columnas | Columna | Tipo | Atributos/notas |); sección 4 Topología/uso breve; referencia al schema como fuente de verdad.
   - Escriba el resultado en `.cursor/personal/RAG_<NOMBRE_PROYECTO>/RAG_DATABASE.md`.
3. **Ejecutar el script** desde la raíz del monorepo (ej. `node packages/db/scripts/generate-rag-database-md.js` o la ruta donde se haya creado el script).
4. **Eliminar el script** tras la ejecución; no dejar scripts temporales en el repositorio.
5. **Comprobar**: Que el documento generado incluya todos los enums y todos los modelos con todas sus columnas (por ejemplo, un modelo User con decenas de columnas debe aparecer completo).

Si el schema está en un paquete distinto al path de análisis, el script debe recibir o tener configuradas: ruta al `schema.prisma` y ruta de salida del `RAG_DATABASE.md` (derivada de NOMBRE_PROYECTO).

## Inferring content (contenido para RAG)
- **Visión general**: Tecnologías de persistencia (ORM, motor), resumen de la estructura.
- **Por cada tabla (todas)**: Descripción conceptual, relaciones clave, **listado completo de columnas** (nombre, tipo, restricciones, rol cuando sea relevante), patrones de uso en código.
- **Topología global**: Vista macro de relaciones; diagrama Mermaid ER si es viable.
- **Schema final**: Bloque de código con el esquema completo en formato original (Prisma, SQL, etc.).

## One vs multiple documents
- **Por defecto**: Un único documento `RAG_DATABASE.md` con todas las tablas y todas las columnas.
- **Varios documentos** cuando el número de tablas hace el documento demasiado grande para el RAG; entonces segmentar (ej. por dominio: `RAG_DATABASE_core.md`, `RAG_DATABASE_billing.md`) y en cada uno incluir las tablas/columnas de ese segmento más un índice o referencia al resto. Opcionalmente un `RAG_DATABASE_INDEX.md` que liste todas las tablas y apunte a los segmentos.
- Cada documento adicional: prefijo `RAG_DATABASE_`, frontmatter con `segment` (ej. `segment: users`).

## Metadatos (frontmatter)
Todos los documentos deben comenzar con YAML frontmatter. Ver [resources/RAG_FRONTMATTER_DATABASE.md](resources/RAG_FRONTMATTER_DATABASE.md). Campos mínimos: `rag_document_type`, `project_name`, `scope`, `title`. Opcionales: `generated_at`, `segment`.

## Output location
- **Carpeta**: `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`
- **Nombres**: `RAG_DATABASE.md` (principal); opcionalmente `RAG_DATABASE_<segmento>.md`, `RAG_DATABASE_INDEX.md`.
- **Formato**: Markdown estructurado; listados de columnas en tablas Markdown; esquema completo al final en bloque de código.

## Resources
- [resources/RAG_DATABASE_TEMPLATE.md](resources/RAG_DATABASE_TEMPLATE.md) – Plantilla con secciones y requisito de listado completo de columnas por tabla.
- [resources/RAG_FRONTMATTER_DATABASE.md](resources/RAG_FRONTMATTER_DATABASE.md) – Esquema de metadatos para documentos de tipo database.
- Lógica de origen: [generating-database-analysis](../generating-database-analysis/SKILL.md) (misma recolección e inferencia; salida adaptada a RAG con cobertura total de tablas y columnas).
