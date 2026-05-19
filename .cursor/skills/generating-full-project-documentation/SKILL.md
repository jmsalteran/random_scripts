---
name: generating-full-project-documentation
description: Orquesta las habilidades generating-project-overview, generating-endpoints-analysis, generating-database-analysis, generating-domain-rules y generating-architecture-doc para un proyecto indicado, generando una carpeta con todos los documentos (PROJECT_OVERVIEW.md, ENDPOINTS.jsonl, DATABASE_ANALYSIS.md, DOMAIN_RULES.md, ARCHITECTURE.md). Use when the user asks to document a project fully, generate all project docs, or create a documentation folder for a package or app.
---

# Generación de documentación completa de proyecto

**Anunciar al inicio:** "Usando la habilidad generating-full-project-documentation para generar toda la documentación del proyecto en una carpeta."

## When to use this skill
- Cuando el usuario pida "generar toda la documentación del proyecto", "documentar el proyecto X" o "crear la carpeta de documentación" para un paquete o app.
- Cuando se necesite un set completo de artefactos (overview, endpoints, base de datos, reglas de dominio, arquitectura) para un path indicado.
- Cuando se quiera replicar una estructura como `.cursor/personal/<proyecto>` con todos los archivos generados por las habilidades de información.

## Habilidades que se utilizan
Esta habilidad **invoca en secuencia** las siguientes habilidades (el agente debe leer y seguir cada una, escribiendo la salida en la **carpeta de destino**):

| Orden | Habilidad | Archivo generado |
|-------|-----------|------------------|
| 1 | `generating-project-overview` | `PROJECT_OVERVIEW.md` |
| 2 | `generating-endpoints-analysis` | `ENDPOINTS.jsonl` |
| 3 | `generating-database-analysis` | `DATABASE_ANALYSIS.md` |
| 4 | `generating-domain-rules` | `DOMAIN_RULES.md` |
| 5 | `generating-architecture-doc` | `ARCHITECTURE.md` |

El orden permite que `generating-architecture-doc` pueda usar opcionalmente `ENDPOINTS.jsonl` y análisis de base de datos si ya están en la carpeta de destino.

## Workflow
- [ ] **Entrada**: Obtener del usuario (o inferir):
  - **Ruta del proyecto a analizar**: carpeta con código (ej. `packages/admin`, `packages/api3`, `apps/web`). Por defecto puede ser la raíz del repo.
  - **Carpeta de destino** (opcional): donde escribir todos los archivos. Si no se indica, usar `.cursor/personal/<slug>`, donde `<slug>` es un identificador corto del proyecto (ej. `admin`, `api3`) derivado del path (último segmento o nombre del paquete).
- [ ] **Crear carpeta de destino**: Asegurar que existe (ej. `.cursor/personal/admin`). Usar siempre rutas con `/`.
- [ ] **Ejecutar cada habilidad en orden**:
  1. Leer el `SKILL.md` de la habilidad correspondiente en `.cursor/skills/<nombre-habilidad>/`.
  2. Seguir su Workflow e Instructions con el **mismo path de análisis** y con **output** dirigido a la **carpeta de destino**.
  3. Escribir el archivo generado en la carpeta de destino (no en la raíz del proyecto analizado).
- [ ] **Verificación**: Listar la carpeta de destino y confirmar que existen los cinco archivos.
- [ ] **Resumen**: Indicar al usuario la ruta de la carpeta y los archivos generados.

## Instrucciones

### 1. Definir alcance y destino
- **Path de análisis**: Debe ser una ruta válida dentro del repositorio (ej. `packages/admin`). Todo el análisis de las sub-habilidades se limita a ese path.
- **Carpeta de destino**: Debe ser una sola carpeta que contendrá todos los artefactos. Ejemplos:
  - `.cursor/personal/admin` para el proyecto en `packages/admin`
  - `.cursor/personal/api3` para el proyecto en `packages/api3`
  - La ruta que el usuario indique explícitamente
- No escribir los documentos en la raíz del código analizado; siempre en la carpeta de destino para mantener un único "pack" de documentación.

### 2. Cómo invocar cada sub-habilidad
El agente **no** llama a las habilidades como funciones. Debe:
1. Abrir y leer el `SKILL.md` de la habilidad (ej. `.cursor/skills/generating-project-overview/SKILL.md`).
2. Ejecutar su flujo (Discovery, Synthesis, etc.) sobre el **path de análisis** acordado.
3. Al generar el archivo de salida, **guardarlo en la carpeta de destino** en lugar del lugar por defecto que indique la sub-habilidad (ej. en lugar de guardar `PROJECT_OVERVIEW.md` en la raíz del proyecto, guardarlo en `<carpeta_destino>/PROJECT_OVERVIEW.md`).

### 3. Dependencias entre documentos
- `generating-architecture-doc` puede usar como entrada opcional `database_analysis` y `endpoints_analysis`. Como primero se generan `ENDPOINTS.jsonl` y `DATABASE_ANALYSIS.md` en la carpeta de destino, al ejecutar la quinta habilidad el agente puede **leer desde la carpeta de destino** esos archivos (si la habilidad lo menciona) para enriquecer `ARCHITECTURE.md`. Si las sub-habilidades esperan nombres como `endpoints_analysis.json` o `database_analysis.json`, el agente debe adaptar: usar `ENDPOINTS.jsonl` y el contenido de `DATABASE_ANALYSIS.md` como referencia al redactar la arquitectura.

### 4. Estructura final de la carpeta de destino
Al terminar, la carpeta debe contener:

```
<carpeta_destino>/
  PROJECT_OVERVIEW.md
  ENDPOINTS.jsonl
  DATABASE_ANALYSIS.md
  DOMAIN_RULES.md
  ARCHITECTURE.md
```

### 5. Ejemplo de uso
- Usuario: "Genera toda la documentación para el proyecto en packages/admin y guárdala en .cursor/personal/admin."
- El agente: anuncia la habilidad, crea `.cursor/personal/admin`, ejecuta en orden las cinco habilidades con path `packages/admin` y output en `.cursor/personal/admin`, y confirma los cinco archivos.

## Resources
- Habilidades de información (todas bajo `.cursor/skills/`):
  - [generating-project-overview](.cursor/skills/generating-project-overview/SKILL.md)
  - [generating-endpoints-analysis](.cursor/skills/generating-endpoints-analysis/SKILL.md)
  - [generating-database-analysis](.cursor/skills/generating-database-analysis/SKILL.md)
  - [generating-domain-rules](.cursor/skills/generating-domain-rules/SKILL.md)
  - [generating-architecture-doc](.cursor/skills/generating-architecture-doc/SKILL.md)
- Referencia de carpeta de documentación: `.cursor/personal/monorepo_admin` o `.cursor/personal/api3` (contienen ARCHITECTURE.md, DOMAIN_RULES.md, ENDPOINTS.jsonl, PROJECT_OVERVIEW.md, y opcionalmente DATABASE_ANALYSIS.md).
