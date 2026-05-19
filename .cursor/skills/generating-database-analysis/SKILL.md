---
name: generating-database-analysis
description: Performs a deep analysis of the project's database structure, extracting models, relations, and extracting business concepts based on code usage. Generates a comprehensive DATABASE_ANALYSIS.md document containing all database information, usage context, and the full schema at the end.
---

# Generador de Análisis de Base de Datos

## When to use this skill
- Cuando el usuario solicita "analizar la base de datos", "generar el análisis de la base de datos" o "documentar el modelo de datos".
- Cuando el usuario pide entender cómo se relacionan las tablas, o qué conceptos funcionales giran en torno a ellas según su uso en el código.
- Cuando se requiere exportar el conocimiento de datos a un documento Markdown (`DATABASE_ANALYSIS.md`).

## Workflow
- [ ] **Alcance**: Identificar la ruta (repositorio completo o carpeta específica) indicada por el usuario para llevar a cabo el análisis.
- [ ] **Descubrimiento del Esquema**: Ubicar los archivos de definición de base de datos (`schema.prisma`, archivos de migraciones SQL, entidades TypeORM/Hibernate/etc.) dentro del alcance definido.
- [ ] **Extracción y Rastreo**: 
    - Analizar las tablas (modelos), columnas (campos), tipos de datos y restricciones.
    - Identificar las relaciones (1 a 1, 1 a N, N a M) y llaves foráneas.
    - **Rastrear el uso en el código**: Buscar dónde y cómo se utilizan las tablas y las columnas (ej: consultas, inserciones, actualizaciones) para entender su verdadero peso funcional.
- [ ] **Definición de Conceptos**: A partir de los usos encontrados en el código expuesto, abstraer y redactar los conceptos de negocio o dominio que giran en torno a cada tabla y sus campos clave.
- [ ] **Construcción (Markdown)**: Redactar un documento sumamente detallado con toda la información extraída.
- [ ] **Schema Final**: Adjuntar el esquema completo en el documento mediante bloques de código al final.
- [ ] **Salida**: Generar y guardar el resultado como `DATABASE_ANALYSIS.md`.

## Instructions

### 1. Extracción Estructural Activa
Explora tu alcance buscando la definición pura de los datos:
- Lee los archivos de definición detectados.
- Documenta rigurosamente las entidades, modelos, relaciones, índices estructurales, primary keys y constraints nativas.

### 2. Análisis de Contexto y Conceptos de Uso
No conformarse con enlistar las columnas, esta habilidad debe vincularlas a su funcionalidad en el ecosistema de código:
1.  **Búsqueda de Usos**: Realiza búsquedas usando herramientas (ej: `grep_search`) de los modelos de base de datos a lo largo de los servicios, repositorios o controladores.
2.  **Abstracción de Conceptos**: Deduce qué representa realmente la tabla. Por ejemplo: "*La tabla `User` no solo guarda información de login, según su uso asociado a `Subscription`, se considera la entidad que dicta los accesos premium en la aplicación.*"
3.  **Uso de Columnas Clave**: Explica las columnas que condicionan lógicas de negocio, tales como banderas (`is_active`, `deleted_at`, `status`) o roles, identificando su participación en condicionales y filtrados en la app.

### 3. Estructura Obligatoria del Archivo (`DATABASE_ANALYSIS.md`)
El archivo markdown a ser generado debe respetar exactamente las siguientes secciones:

# Análisis de Base de Datos y Modelos de Dominio

## 1. Visión General
- Breve sumario de las tecnologías de persistencia detectadas (ORM, motores relacionales o NoSQL).
- Resumen global de la estructura y enfoque general de la persistencia de los datos.

## 2. Diccionario de Datos y Conceptos de Dominio
Por cada tabla, modelo o entidad significativa encontrada en el código o esquema, debes crear una sub-sección:

### Tabla: [Nombre de la Tabla / Modelo]
- **Descripción Conceptual**: Explicación del concepto que representa en el sistema (su rol de dominio o negocio) basado puramente en cómo el código interactúa con ella.
- **Relaciones Clave**: Cómo interactúa con otras entidades estructural y lógicamente. Entidades "dueñas" o entidades "dependientes".
- **Columnas y Estados Relevantos**: Destacar los campos que gestionan el ciclo de vida (status, booleanos críticos, foreign keys de control) y explicar qué dictan o restringen de acuerdo a sus usos.
- **Patrones de Uso de Código**: Desglosar qué interacciones (Reads / Writes pesados), disparadores en código (triggers analíticos) o transacciones se descubrieron en torno a esta tabla puntualmente.

## 3. Topología de Relaciones Globales
- Un compendio o vista macro (preferiblemente descrito y si es viable, apoyado por sintaxis `mermaid` en Diagrama ER) de las ramificaciones transaccionales principales en toda la aplicación.

## 4. Esquema de Base de Datos Base (Schema)
- [OBLIGATORIO] Se debe añadir al final como un gran bloque de código en el formato original leído (TypeORM classes, \`schema.prisma\`, scripts `.sql` estructurales o lo que se haya descubierto base del proyecto analizado). Garantiza que toda la referencia técnica nativa no se pierda.

## Elementos deprecados - Aviso
Esta habilidad antes exportaba hacia esquemas JSON. **Esta nueva versión solo emite código Markdown (`DATABASE_ANALYSIS.md`)** e incluye los esquemas nativos y conceptualizaciones textuales enriquecidas.
