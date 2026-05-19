---
name: generating-endpoints-analysis
description: Performs a deep static analysis of a defined codebase or specific folder to extract ALL API endpoints, documenting their purpose and logical execution trees in a strict JSONL format. Use when the user needs a comprehensive, machine-readable map of endpoint logic.
---

# Generador de Análisis de Endpoints

## When to use this skill
- Cuando el usuario solicita generar un análisis de "todos los endpoints" de un repositorio o de una carpeta de código específica.
- Cuando se requiere entender el árbol de decisiones o condiciones lógicas de las rutas (API routes).
- Cuando el usuario explícitamente pide exportar el comportamiento de las APIs a un formato `ENDPOINTS.jsonl`.

## Workflow
- [ ] **Alcance**: Identificar la ruta (repositorio completo o carpeta específica) indicada por el usuario para llevar a cabo el análisis.
- [ ] **Descubrimiento Exhaustivo**: Encontrar el framework web (Express, FastAPI, Django, Next.js, etc.) y localizar todos los archivos de rutas dentro del alcance. **Debes confirmar y garantizar que absolutamente TODOS los endpoints son revisados, documentados e incluidos sin omisiones**.
- [ ] **Análisis y Recorrido**: Por cada endpoint encontrado, realizar un rastreo de la ejecución desde el punto de entrada, pasando por middlewares, controladores y servicios. Usar `view_file` para leer estrictamente el código. No asumas ni inventes flujos lógicos o rutas.
    - Extraer e indicar método HTTP y ruta completa.
    - Generar una descripción concisa.
    - Mapear el "Decision Tree" (árbol de decisiones, condiciones en cascada, validaciones, manejo de errores).
    - Listar todo llamado a métodos internos involucrado en el flujo.
- [ ] **Construcción (JSONL)**: Construir un objeto JSON válido y aislado por cada ruta siguiendo estrictamente la estructura de la línea documentada en `resources/ENDPOINT_SCHEMA.json`.
- [ ] **Verificación**: Asegurarse de que no faltó ningún endpoint evaluando y rastreando patrones con expresiones regulares usando grep_search a nivel de rutas, frameworks expuestos, decoradores, etc.
- [ ] **Salida**: Generar y guardar el análisis definitivo bajo un archivo llamado `ENDPOINTS.jsonl`, con formato JSON Lines.

## Instructions

### 1. Estrategia de Descubrimiento Total y Garantizado
Para que no haya ninguna omisión de endpoints, debes combinar trazabilidad estructural y búsquedas directas:
1. Primero, encuentra el punto de entrada (e.g., `app.js`, `main.py`, `routes.ts`, o las convenciones como `app/api/` o `pages/api/`).
2. Sigue las importaciones, manejadores y los routers.
3. Ejecuta búsquedas para asegurar que no se haya escapado nada, filtrando por declaraciones de ruta de tu framework (e.g., `app.get(`, `@app.route(`, `@Get(`, `router.post(`, `export async function GET(`).
4. Asegúrate que todas las rutas descubiertas estén listadas.

### 2. Rastreo Lógico Profundo en el Análisis de Funciones
Para *cada* endpoint localizado, explora el contenido para recrear el flujo:
- **Middleware**: Ubica cualquier capa global o dependiente a nivel de la ruta.
- **Handler**: Traza y analiza la lógica principal.
- **Service Calls**: Si el endpoint invoca a clases o métodos de reglas de negocio, revísalos y resume su flujo en ese árbol de ejecución, sin salirte del objetivo inicial. No te quedes en llamadas de nivel global como `console.log`.

### 3. Construyendo el Árbol de Decisiones (Decision Tree)
La propiedad `decision_tree` en el modelo sirve para simular la representación del flujo lógico.
- Muestra el flujo de control fundamental (bloques de if/else, try/catch, switch cases).
- **Nodes**: Nodos que describen de forma concisa la condición. Por ejemplo, "si hay problema validando el token".
- **Branches**: Los resultados directos de la condición mostrada por el nodo.
- **method_calls**: Lista en array con apenas los nombres de métodos internos invocados por cada rama particular (`db.find`, `validateSchema`). **Sin sus parámetros**, solo la invocación bruta.

### 4. Formato de Salida Obligatorio: JSONL
El resultado final **DEBE** y tiene que exportarse como el archivo `ENDPOINTS.jsonl`. 
- JSONL corresponde a **JSON Lines** y esto significa que todo el documento debe estar estructurado por renglones, donde cada salto de línea es el JSON de un único endpoint totalmente completo.
- Cada objeto debe ser válido, ocupando exactamente y rígidamente 1 sola línea, sin usar tabulaciones internas ni saltos de línea para facilitar formato (prohibido `\n` literal para pretty print dentro del objeto).
- Referencia el archivo `resources/ENDPOINT_SCHEMA.json` para basarte al construir el JSON de la línea respectiva. Omitir el uso de envoltura decorativa Markdown en el archivo final.

## Resources
- [resources/ENDPOINT_SCHEMA.json](resources/ENDPOINT_SCHEMA.json) - Contiene el esquema que representará un JSON individual asignado a una línea del JSONL para documentar el respectivo endpoint.
