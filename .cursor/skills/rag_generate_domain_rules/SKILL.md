---
name: rag-generate-domain-rules
description: Genera documentación de reglas de negocio (reglas núcleo, prioridad, casos borde, excepciones, ejemplos, matriz de estados, validaciones, impacto regulatorio) en Markdown optimizado para RAG. Documentos con prefijo RAG_, metadatos en frontmatter y salida en .cursor/personal/RAG_NOMBRE_PROYECTO. Use when the user asks for RAG domain rules, reglas de negocio para RAG, or wants to feed a RAG with business logic. Si el usuario no indica carpeta, se debe preguntar porque puede haber múltiples proyectos.
---

# RAG Generate Domain Rules

**Anunciar al inicio:** "Usando la habilidad rag_generate_domain_rules para generar las reglas de dominio del proyecto en formato RAG."

## When to use this skill
- Cuando el usuario pida "reglas de negocio para RAG", "generar domain rules RAG" o documentación de la lógica de negocio para alimentar un RAG.
- Cuando se necesite el mismo contenido que generating-domain-rules (reglas núcleo, prioridad, casos borde, excepciones, ejemplos, matriz de estados, validaciones, impacto regulatorio) pero en Markdown bien estructurado, con metadatos y nombres predecibles para ingestión RAG.
- Cuando se quiera documentar la carpeta que el usuario indique, con salida en `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`.

## Workflow
- [ ] **Entrada – carpeta de trabajo**:
  - Si el usuario **indica** la carpeta del proyecto (ej. `packages/admin`, `apps/api`), usarla como **path de análisis**.
  - Si **no** indica carpeta, **preguntar**: "¿Desde qué carpeta quieres generar las reglas de dominio RAG? Puede haber varios proyectos; indica la ruta (ej. packages/api, apps/web)."
- [ ] **Nombre del proyecto**: Derivar un `NOMBRE_PROYECTO` (slug) del path (ej. último segmento: `admin`, `api`) para la carpeta de salida.
- [ ] **Carpeta de destino**: Crear y usar `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` (rutas con `/`). Reutilizar si ya existe (por otras skills RAG).
- [ ] **Discovery**: Examinar exhaustivamente el código (modelos, controladores, servicios, validadores, constantes, tests) en busca de la lógica core del negocio. Opcional: apoyarse en analyzing-endpoints o analyzing-databases para rutas/campos desde donde se ejecuta la lógica.
- [ ] **Extracción**: Recabar reglas en formato "Si [condición], entonces [acción/resultado]", prioridades, casos borde, excepciones por rol, ejemplos input→output, ciclos de vida y transiciones válidas/inválidas, pre/post-condiciones, reglas por país/canal/segmento.
- [ ] **Síntesis**: Rellenar contenido siguiendo [resources/RAG_DOMAIN_RULES_TEMPLATE.md](resources/RAG_DOMAIN_RULES_TEMPLATE.md); incluir frontmatter según [resources/RAG_FRONTMATTER_DOMAIN_RULES.md](resources/RAG_FRONTMATTER_DOMAIN_RULES.md).
- [ ] **Decisión uno vs varios documentos**: Por defecto un `RAG_DOMAIN_RULES.md`. Si el dominio es muy amplio, segmentar (ej. por flujo: `RAG_DOMAIN_RULES_orders.md`, `RAG_DOMAIN_RULES_payments.md`) con frontmatter y `segment`.
- [ ] **Output**: Guardar todos los `RAG_*.md` en la carpeta destino; listar y confirmar.

## Scope the target
- **Path**: El usuario especifica la carpeta (ej. `.` para raíz, `packages/api`). Todo el análisis se acota a esa carpeta.
- **Base path**: Para monorepos, analizar el subárbol relevante.

## Evidence collection
Recoger señales de las mismas fuentes que generating-domain-rules:

| Fuente | Extraer |
|--------|--------|
| Modelos / entidades | Estados, enums, campos que condicionan lógica |
| Controladores / rutas | Validaciones, respuestas por estado, permisos |
| Servicios | Reglas de negocio, condicionales, cálculos |
| Validadores | Pre-condiciones, mensajes de error |
| Constantes / config | Umbrales, códigos de estado, prioridades |
| Tests | Casos input→output, casos borde, flujos esperados |

## Estructura obligatoria (contenido para RAG)
El documento generado debe incluir todas estas secciones (ver plantilla):

1. **Reglas núcleo**: "Si [condición], entonces [acción/resultado]".
2. **Prioridad de reglas**: Qué regla prevalece en conflictos.
3. **Casos borde**: Nulos, duplicados, eventos out-of-order, expiraciones, etc.
4. **Excepciones permitidas**: Cuándo se puede romper una regla y qué rol/proceso lo autoriza.
5. **Ejemplos reales**: Casos extraídos del código en formato `input → output esperado`.
6. **Matriz de estados**: Ciclos de vida (Mermaid/tablas), transiciones válidas e inválidas.
7. **Validaciones obligatorias**: Pre-condiciones y post-condiciones de las funciones principales.
8. **Impacto regulatorio**: Reglas por país, canal, segmento (GDPR, bloqueos regionales, etc.).

## One vs multiple documents
- **Por defecto**: Un único documento `RAG_DOMAIN_RULES.md` con todas las secciones.
- **Varios documentos** cuando conviene segmentar por flujo o dominio (ej. órdenes, pagos, usuarios); cada segmento con su frontmatter y `segment`, manteniendo la misma estructura de secciones aplicable a ese segmento.

## Metadatos (frontmatter)
Todos los documentos deben comenzar con YAML frontmatter. Ver [resources/RAG_FRONTMATTER_DOMAIN_RULES.md](resources/RAG_FRONTMATTER_DOMAIN_RULES.md). Campos mínimos: `rag_document_type`, `project_name`, `scope`, `title`. Opcionales: `generated_at`, `segment`.

## Output location
- **Carpeta**: `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`
- **Nombres**: `RAG_DOMAIN_RULES.md` (principal); opcionalmente `RAG_DOMAIN_RULES_<segmento>.md`.
- **Formato**: Markdown estructurado (encabezados, listas, tablas, diagramas Mermaid si aplica).

## Resources
- [resources/RAG_DOMAIN_RULES_TEMPLATE.md](resources/RAG_DOMAIN_RULES_TEMPLATE.md) – Plantilla con todas las secciones obligatorias.
- [resources/RAG_FRONTMATTER_DOMAIN_RULES.md](resources/RAG_FRONTMATTER_DOMAIN_RULES.md) – Esquema de metadatos para documentos de tipo domain_rules.
- Lógica de origen: [generating-domain-rules](../generating-domain-rules/SKILL.md) (misma recolección e inferencia; salida adaptada a RAG).
