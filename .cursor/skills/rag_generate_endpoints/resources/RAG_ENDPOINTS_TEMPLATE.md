# Plantilla para documentos RAG de Endpoints

Usar esta estructura al generar la documentación de endpoints para RAG. Incluir siempre el frontmatter según RAG_FRONTMATTER_ENDPOINTS.md. **Es obligatorio documentar el 100% de los endpoints**; usar múltiples documentos (índice + segmentos) según convenga.

---

## A. Documento índice (RAG_ENDPOINTS_INDEX.md)

Lista de **todos** los endpoints del proyecto para que el RAG pueda localizar rápidamente método, ruta y dónde está el detalle.

```yaml
---
rag_document_type: endpoints
project_name: "<NOMBRE_PROYECTO>"
scope: "<ruta analizada>"
title: "Índice de endpoints API – <Nombre proyecto>"
segment: index
generated_at: "<ISO8601 opcional>"
---
```

# Índice de Endpoints – [Nombre del proyecto]

> Lista completa de endpoints. El detalle de cada uno está en los documentos segmentados indicados en la columna "Documento".

| Método | Ruta | Descripción breve | Documento |
|--------|------|-------------------|------------|
| GET | /api/v1/users | Lista usuarios | RAG_ENDPOINTS_users.md |
| POST | /api/v1/users | Crea usuario | RAG_ENDPOINTS_users.md |
| … | … | … | … |

*(Una fila por cada endpoint; sin omitir ninguno.)*

---

## B. Documentos segmentados (RAG_ENDPOINTS_<segmento>.md)

Cada segmento agrupa un subconjunto de endpoints (por prefijo de ruta, módulo o archivo). **Cada endpoint** se documenta con la estructura siguiente.

### Frontmatter del segmento

```yaml
---
rag_document_type: endpoints
project_name: "<NOMBRE_PROYECTO>"
scope: "<ruta analizada>"
title: "Endpoints API – <Segmento>"
segment: "<segmento>"
generated_at: "<ISO8601 opcional>"
---
```

### Estructura por endpoint (repetir por cada uno; obligatorio 100%)

Para **cada** endpoint se debe haber realizado un **rastreo de la ejecución** desde el punto de entrada (app/router), pasando por **middlewares → controladores → servicios**, leyendo el código con Read/view_file. No asumir ni inventar flujos.

Usar encabezado de nivel 2 con **METHOD** y **ruta completa** (ej. `POST /auth/signin`).

```markdown
## METHOD /ruta/completa
**Descripción:** [Una o dos frases sobre qué hace el endpoint.]
**Archivo:** [Ruta al archivo donde está definida la ruta.]
**Middlewares:** [Lista de middlewares que se ejecutan antes del handler (auth, validación body/query, etc.).]
**Decision tree:**
- [Condición 1]: [Resultado – ej. "Si validación de body falla → 400."]
- [Condición 2]: [Rama – ej. "Si servicio devuelve X → 200 con Y."]
- [Condición 3]: [Rama – incluir todas las ramas: éxito, errores, try/catch, next(err).]
- (Reflejar if/else, try/catch, validaciones y manejo de errores tal como aparecen en el código.)

**Métodos internos llamados:**
- `nombreMetodo1`
- `nombreMetodo2`
```

### Ejemplo de referencia (formato canónico)

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

---

## C. Reglas al rellenar

1. **100% de endpoints**: Toda ruta descubierta debe aparecer en el índice y tener su bloque detallado en algún segmento. Cero omisiones.
2. **Rastreo de ejecución**: Por cada endpoint, realizar un rastreo desde el punto de entrada, pasando por middlewares, controladores y servicios. Leer el código con Read/view_file; no asumir ni inventar flujos lógicos o rutas.
3. **Por endpoint extraer**: método HTTP y ruta completa; descripción concisa; Decision tree (condiciones en cascada, validaciones, manejo de errores); lista de todos los métodos internos llamados.
4. **Decision tree**: Reflejar condiciones reales del código (if/else, try/catch, validaciones); lista con viñetas; incluir todas las ramas relevantes.
5. **Métodos internos**: Listar todo llamado a métodos involucrado en el flujo (solo nombres, sin parámetros).
6. **Nombres de documentos**: `RAG_ENDPOINTS_INDEX.md`, `RAG_ENDPOINTS_<segmento>.md` (ej. `auth`, `users`, `orders`).

*Fin de la plantilla.*
