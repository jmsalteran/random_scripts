---
name: rag-generate-endpoints
description: Genera documentación de todos los endpoints API (método, ruta, descripción, árbol de decisiones, middlewares, llamadas a métodos) en Markdown optimizado para RAG. Es obligatorio incluir el 100% de los endpoints y generar TODOS los archivos segmentados (RAG_ENDPOINTS_INDEX.md + un RAG_ENDPOINTS_<segmento>.md por cada segmento). Por cada endpoint se rastrea la ejecución leyendo el código (sin asumir flujos). Si hay muchos segmentos, usar script para generar todos los archivos y luego eliminarlo. Salida en .cursor/personal/RAG_NOMBRE_PROYECTO. Use when the user asks for RAG endpoints, análisis de endpoints para RAG, or wants to feed a RAG with API map. Si el usuario no indica carpeta, se debe preguntar porque puede haber múltiples proyectos.
---

# RAG Generate Endpoints

**Anunciar al inicio:** "Usando la habilidad rag_generate_endpoints para generar el análisis de endpoints del proyecto en formato RAG."

## When to use this skill
- Cuando el usuario pida "endpoints para RAG", "generar análisis de endpoints RAG" o documentación de la API para alimentar un RAG.
- Cuando se necesite el mismo contenido que generating-endpoints-analysis (descubrimiento exhaustivo, rastreo por middlewares/controladores/servicios, método, ruta, descripción, decision tree, method calls) pero en **Markdown** bien estructurado, con metadatos y nombres predecibles para ingestión RAG (no JSONL).
- **Requisito RAG**: Incluir **el 100% de los endpoints** del proyecto; ninguna ruta puede quedar sin documentar. Se **recomienda** generar **múltiples documentos** (por prefijo, módulo o grupo de rutas) para no superar límites de contexto y facilitar la recuperación en el RAG.

## Workflow
- [ ] **Entrada – carpeta de trabajo**:
  - Si el usuario **indica** la carpeta del proyecto (ej. `packages/admin`, `apps/api`), usarla como **path de análisis**.
  - Si **no** indica carpeta, **preguntar**: "¿Desde qué carpeta quieres generar el análisis de endpoints RAG? Puede haber varios proyectos; indica la ruta (ej. packages/api, apps/web)."
- [ ] **Nombre del proyecto**: Derivar un `NOMBRE_PROYECTO` (slug) del path para la carpeta de salida.
- [ ] **Carpeta de destino**: Crear y usar `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` (rutas con `/`). Reutilizar si ya existe.
- [ ] **Descubrimiento exhaustivo**: Encontrar el framework web (Express, FastAPI, Django, Next.js, etc.) y localizar **todos** los archivos de rutas. Combinar: punto de entrada → importaciones y routers; búsquedas por patrones de declaración de rutas (`app.get(`, `@app.route(`, `router.post(`, `export async function GET(`, etc.). **Garantizar que no falte ningún endpoint.** Si es necesario crear **scripts** (p. ej. Node, Bash, Python) para detectar o listar endpoints de forma sistemática, **crearlos, ejecutarlos** para obtener la lista completa y **eliminarlos** después; no dejar scripts temporales en el repositorio.
- [ ] **Por cada endpoint encontrado** (sin excepciones; **100% obligatorio**):
  - **Rastrear la ejecución** desde el punto de entrada: seguir el flujo pasando por **middlewares → controladores → servicios**. Usar **Read** (o view_file) para **leer estrictamente el código**; no asumir ni inventar flujos lógicos o rutas.
  - **Extraer e indicar**: **método HTTP** y **ruta completa** (ej. `POST /auth/signin`).
  - **Generar una descripción concisa** (qué hace el endpoint en una o dos frases).
  - **Mapear el "Decision Tree"**: árbol de decisiones, condiciones en cascada, validaciones, manejo de errores (if/else, try/catch, switch) tal como aparecen en el código.
  - **Listar todo llamado a métodos internos** involucrado en el flujo (solo nombres de métodos, sin parámetros).
  - **Identificar middlewares** que aplican a la ruta (globales y por ruta).
- [ ] **Síntesis**: Documentar cada endpoint en Markdown siguiendo [resources/RAG_ENDPOINTS_TEMPLATE.md](resources/RAG_ENDPOINTS_TEMPLATE.md); incluir frontmatter según [resources/RAG_FRONTMATTER_ENDPOINTS.md](resources/RAG_FRONTMATTER_ENDPOINTS.md).
- [ ] **Segmentación**: Dado que es obligatorio incluir el 100% de los endpoints, **generar siempre** (1) `RAG_ENDPOINTS_INDEX.md` con todos los endpoints y (2) **un documento de segmento por cada segmento**: `RAG_ENDPOINTS_<segmento>.md`. Ver sección **"Obligación: generar TODOS los archivos segmentados"** más abajo.
- [ ] **Verificación**: Antes de dar por cerrada la generación: (1) Listar todos los endpoints descubiertos. (2) Comprobar que cada uno aparece en el índice y tiene su bloque detallado en un documento segmentado (ruta completa, descripción, middlewares, decision tree, métodos llamados). (3) **Comprobar que existe un archivo RAG_ENDPOINTS_<segmento>.md por cada segmento referenciado en el índice**; ningún segmento puede quedar sin archivo. (4) Confirmar que el número de endpoints documentados coincide con el total descubierto (100%, cero omisiones).
- [ ] **Output**: Guardar todos los `RAG_*.md` (índice + **todos** los segmentos) en la carpeta destino; listar y confirmar.

## Regla crítica: 100% de endpoints y TODOS los archivos
- **Todos los endpoints** descubiertos en el alcance deben estar documentados; **cero omisiones**. El documento debe incluir el **100%** de los endpoints.
- **Todos los archivos segmentados**: Debe existir **un archivo** `RAG_ENDPOINTS_<segmento>.md` por cada segmento que aparezca en el índice. No se puede dar por cerrada la generación si falta algún archivo de segmento.
- **Por cada endpoint**: realizar un **rastreo de la ejecución** desde el punto de entrada, pasando por **middlewares, controladores y servicios**. Usar **Read** (o view_file) para **leer estrictamente el código**. No asumir ni inventar flujos lógicos o rutas.
- **Extraer e indicar**: método HTTP y ruta completa; descripción concisa; **Decision Tree** (árbol de decisiones, condiciones en cascada, validaciones, manejo de errores); **listar todo llamado a métodos internos** involucrado en el flujo.
- Objetivo: que el RAG pueda responder "¿Qué hace POST /api/users?", "¿Qué validaciones tiene GET /api/orders/:id?", "¿Qué métodos llama el endpoint X?" con información **completa y fiel al código**.

## Rastreo por endpoint (obligatorio para cada uno)
Por cada endpoint descubierto se debe realizar un **rastreo de la ejecución** desde el punto de entrada, pasando por middlewares, controladores y servicios. Usar **Read** (o view_file) para leer **estrictamente** el código. **No asumir ni inventar** flujos lógicos o rutas.

1. **Punto de entrada**: Identificar cómo se monta la ruta (app.ts o index de routers) y la ruta completa (prefijo + path del router).
2. **Middlewares**: Ubicar y leer las capas que se ejecutan antes del handler (globales y por ruta): auth, validación de body/query, logging, etc.
3. **Controlador/Handler**: Leer el código del manejador; trazar la lógica paso a paso.
4. **Servicios**: Si el controlador invoca servicios o repositorios, leer esos archivos y listar todos los métodos llamados (solo nombres); no limitarse a llamadas triviales como `console.log`.
5. **Decision tree**: Representar en lista (viñetas) cada condición y rama tal como está en el código: validaciones que fallan → código de respuesta; ramas de éxito; try/catch y next(err). Incluir **todas** las ramas relevantes (no resumir de forma vaga).
6. **Salida por endpoint**: Incluir método HTTP, ruta completa, descripción, archivo, middlewares, decision tree y métodos internos llamados. Ver [resources/RAG_ENDPOINTS_TEMPLATE.md](resources/RAG_ENDPOINTS_TEMPLATE.md) y el ejemplo de referencia más abajo.

## Formato de salida: Markdown (no JSONL)
- La salida es **solo Markdown** (documentos `RAG_ENDPOINTS*.md`), no `ENDPOINTS.jsonl`.
- Cada endpoint se documenta con: encabezado `## METHOD path`, **Descripción**, **Archivo**, **Middlewares**, **Decision tree** (lista de condiciones y ramas) y **Métodos internos llamados**.
- Ver [resources/RAG_ENDPOINTS_TEMPLATE.md](resources/RAG_ENDPOINTS_TEMPLATE.md) para la estructura exacta y el ejemplo de referencia.

### Ejemplo de referencia (formato por endpoint)

```markdown
## POST /auth/signin

**Descripción:** Login de administrador (system user). Autentica con email y password vía SystemUsersService (Cognito); puede devolver challenge MFA o tokens.

**Archivo:** `packages/admin/routes/auth.ts`

**Middlewares:** ParamsValidatorMiddleware (body: email, password existen).

**Decision tree:**
- Si validación de body falla → 400.
- Si SystemUsersService.authenticateUser devuelve challenge → 200 con success, challenge, session y opcionalmente secretCode, qrUrl.
- Si no hay challenge y hay user en BD → actualiza lastSignin del SystemUser; si hay authenticationResult → 200 con accessToken, refreshToken, role.
- Si no hay challenge y no hay user → 200 con session.
- Si user no encontrado en BD → 404 con error "User not found".
- Cualquier excepción → errorHandler (next(err)).

**Métodos internos llamados:**
- `SystemUsersService.authenticateUser`
- `prisma.systemUser.findUnique`
- `prisma.systemUser.update`
```

## Descubrimiento total (sin omisiones)
1. Encontrar el punto de entrada (app.js, main.py, routes.ts, app/api/, pages/api/, etc.).
2. Seguir importaciones, manejadores y routers.
3. Ejecutar búsquedas por declaraciones de ruta del framework usado (grep, ripgrep, etc.).
4. **Scripts de detección**: Si hace falta, **crear scripts** (Node, Bash, Python u otro) que recorran el árbol de rutas o busquen patrones para listar todos los endpoints; **ejecutarlos** y usar su salida para la lista definitiva; **eliminar los scripts** al terminar (no commitear scripts temporales).
5. Cruzar y asegurar que toda ruta descubierta esté listada y documentada.

## Obligación: generar TODOS los archivos segmentados
- **Regla**: La salida de la skill debe incluir **todos** los archivos necesarios para que el 100% de los endpoints tenga detalle. Eso implica:
  1. **Un único índice**: `RAG_ENDPOINTS_INDEX.md` con una fila por cada endpoint (método, ruta, descripción breve, documento donde se detalla).
  2. **Un archivo de segmento por cada segmento**: Por cada valor distinto de segmento que aparezca en el índice (ej. `users`, `transactions`, `audit-logs`), debe existir el archivo `RAG_ENDPOINTS_<segmento>.md` en la carpeta destino. **No está permitido** dejar segmentos sin archivo; si el índice referencia `RAG_ENDPOINTS_users.md`, ese archivo **debe** existir y contener el bloque detallado de todos los endpoints de ese segmento.
- **Consecuencia**: Al finalizar, en `.cursor/personal/RAG_<NOMBRE_PROYECTO>/` debe haber: el índice + tantos archivos `RAG_ENDPOINTS_<segmento>.md` como segmentos distintos haya (uno por prefijo o grupo de rutas). Cero omisiones de archivos.
- **Cuando hay muchos endpoints/segmentos**: Si el número de segmentos o de endpoints hace inviable documentar uno a uno de forma manual, **se debe crear un script** (Node, Bash, Python u otro) que: (1) lea la lista completa de endpoints (o el índice generado), (2) agrupe por segmento, (3) genere cada archivo `RAG_ENDPOINTS_<segmento>.md` con la estructura completa por endpoint (descripción, archivo, middlewares, decision tree, métodos llamados). Ejecutar el script y **eliminarlo** después. Así se garantiza que **todos** los archivos segmentados se generan en una sola ejecución.

## One vs multiple documents (obligatorio: múltiples)
- **Índice**: `RAG_ENDPOINTS_INDEX.md` con lista de todos los endpoints (método, ruta, descripción breve, documento/segmento donde se detalla).
- **Segmentos**: **Un** `RAG_ENDPOINTS_<segmento>.md` **por cada** segmento (prefijo o grupo de rutas). Cada segmento incluye solo los endpoints de ese grupo, con la misma estructura por endpoint (método, ruta, descripción, archivo, middlewares, decision tree, method calls). **Todos** los segmentos referenciados en el índice deben tener su archivo generado.
- Frontmatter en cada documento con `segment` cuando corresponda.

## Metadatos (frontmatter)
Todos los documentos deben comenzar con YAML frontmatter. Ver [resources/RAG_FRONTMATTER_ENDPOINTS.md](resources/RAG_FRONTMATTER_ENDPOINTS.md). Campos mínimos: `rag_document_type`, `project_name`, `scope`, `title`. Opcionales: `generated_at`, `segment`.

## Output location
- **Carpeta**: `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`
- **Nombres**: `RAG_ENDPOINTS_INDEX.md`, `RAG_ENDPOINTS_<segmento>.md` (varios según segmentación).
- **Formato**: Markdown únicamente.

## Resources
- [resources/RAG_ENDPOINTS_TEMPLATE.md](resources/RAG_ENDPOINTS_TEMPLATE.md) – Estructura del índice y de cada endpoint en Markdown.
- [resources/RAG_FRONTMATTER_ENDPOINTS.md](resources/RAG_FRONTMATTER_ENDPOINTS.md) – Esquema de metadatos para documentos de tipo endpoints.
- Lógica de origen: [generating-endpoints-analysis](../generating-endpoints-analysis/SKILL.md) (mismo descubrimiento y rastreo; salida en Markdown para RAG en lugar de JSONL).
