# Plantilla para RAG_DATABASE

Usar este esquema al generar el análisis de base de datos para RAG. Sustituir los placeholders por el contenido extraído. Incluir siempre el frontmatter según RAG_FRONTMATTER_DATABASE.md.

**Regla obligatoria:** Incluir la **totalidad** de las tablas y, por cada tabla, el **listado completo de columnas** (nombre, tipo, restricciones, descripción/uso cuando se pueda inferir). No omitir ninguna tabla ni ninguna columna; el RAG debe poder responder sobre cualquier campo.

---

```yaml
---
rag_document_type: database
project_name: "<NOMBRE_PROYECTO>"
scope: "<ruta analizada, ej. packages/admin>"
title: "<título legible, ej. Análisis de base de datos del proyecto Admin>"
generated_at: "<ISO8601 opcional>"
# segment: "<opcional si es segmento>"
---
```

# Análisis de Base de Datos y Modelos de Dominio – [Nombre del proyecto]

> Documento generado para RAG a partir del análisis de `scope`. Incluye todas las tablas y todas las columnas para cobertura completa.

---

## 1. Visión General

- **Tecnologías de persistencia:** [ORM, motor relacional o NoSQL detectados.]
- **Resumen:** [Estructura global y enfoque de la persistencia en el proyecto.]

---

## 2. Diccionario de Datos y Conceptos de Dominio

Por **cada** tabla o modelo encontrado en el esquema/código, crear una subsección. No omitir ninguna tabla.

### Tabla: [Nombre de la Tabla / Modelo]

- **Descripción conceptual:** [Qué representa en el sistema según el uso en código; rol de dominio o negocio.]
- **Relaciones clave:** [Entidades con las que se relaciona; dueñas/dependientes; cardinalidad.]

- **Listado completo de columnas (OBLIGATORIO – todas las columnas):**

  | Columna | Tipo | Nullable | Default / Restricciones | Descripción / Uso en código |
  |---------|------|----------|--------------------------|-----------------------------|
  | id | uuid / bigint / … | No | … | … |
  | … | … | … | … | … |

  *(Repetir una fila por cada columna de la tabla; no dejar ninguna sin documentar.)*

- **Columnas y estados relevantes:** [Destacar campos que gestionan ciclo de vida: status, deleted_at, is_active, FKs de control; explicar qué condicionan según el código.]
- **Patrones de uso en código:** [Reads/writes frecuentes, transacciones, disparadores o lógica asociada descubierta.]

---

*(Repetir la subsección "Tabla: …" para todas y cada una de las tablas del esquema.)*

---

## 3. Topología de Relaciones Globales

- [Vista macro de las relaciones entre entidades; flujos transaccionales principales.]
- Diagrama ER en Mermaid (si es viable):

```mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : "relación"
  ...
```

---

## 4. Esquema de Base de Datos (Schema completo)

- **[OBLIGATORIO]** Incluir al final el esquema completo en el formato original del proyecto (Prisma, SQL estructural, entidades TypeORM, etc.) dentro de un bloque de código, para que el RAG tenga la referencia técnica nativa.

````markdown
```prisma
// schema.prisma o equivalente – contenido completo
model User { ... }
model Order { ... }
// ... todas las tablas
```
````

O para SQL:

````markdown
```sql
-- DDL o migraciones estructurales relevantes
CREATE TABLE ...
```
````

---

*Fin del documento. Si se usan segmentos (ej. RAG_DATABASE_users.md), cada segmento debe incluir al menos: visión breve del segmento, todas las tablas de ese segmento con todas sus columnas en tabla, y relaciones con otras tablas; opcionalmente un índice global en RAG_DATABASE_INDEX.md que liste todas las tablas y en qué documento aparecen.*
