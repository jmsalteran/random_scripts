# Plantilla para RAG_ARCHITECTURE

Usar este esquema al generar la documentación de arquitectura. Sustituir los placeholders por el contenido inferido del análisis. Incluir siempre el frontmatter según RAG_FRONTMATTER_ARCHITECTURE.md.

---

```yaml
---
rag_document_type: architecture
project_name: "<NOMBRE_PROYECTO>"
scope: "<ruta analizada, ej. packages/admin>"
title: "<título legible, ej. Arquitectura técnica del proyecto Admin>"
generated_at: "<ISO8601 opcional>"
# segment: "<opcional si es segmento>"
---
```

# Arquitectura – [Nombre del proyecto]

> Documento generado para RAG a partir del análisis de `scope`. Incluye contexto técnico, diagrama, flujos, modelo de datos, decisiones, límites, riesgos, observabilidad y seguridad.

---

## 1. Contexto técnico

**Patrón arquitectónico:**

[Identificar patrón: MVC, Clean Architecture, Hexagonal, Serverless, etc. a partir de la estructura de carpetas y capas.]

**Justificación:**

- [Modularidad, testabilidad, límites por equipo, etc.]

---

## 2. Diagrama lógico

[Listar: servicios (apps, APIs), bases de datos, colas/eventos, integraciones con terceros. Incluir diagrama Mermaid o ASCII si es útil.]

```mermaid
// Opcional: diagrama de componentes/servicios
```

| Componente | Tipo | Descripción |
|------------|------|-------------|
| … | … | … |

---

## 3. Flujos clave

### 3.1 Request lifecycle

[Middleware → Controller → Service → Repository/DB. Describir orden y responsabilidades.]

- [Paso 1]
- [Paso 2]
- …

### 3.2 Eventos

[Pub/Sub, colas, webhooks: qué se publica, quién consume.]

### 3.3 Reconciliaciones y jobs

[Cron, batch sync, jobs programados.]

---

## 4. Modelo de datos de alto nivel

[Entidades clave y relaciones desde Prisma/ORM o database_analysis.json. Tabla o lista de entidades y relaciones.]

| Entidad | Relaciones principales | Uso |
|---------|------------------------|-----|
| … | … | … |

---

## 5. Decisiones técnicas vigentes

[Enlaces a ADRs en docs/adr, docs/decisions, .adr. Estado: accepted, superseded.]

| ADR / Decisión | Estado | Resumen |
|----------------|--------|---------|
| … | … | … |

---

## 6. Límites y constraints

| Área | Límite / constraint | Origen (config, código, contrato) |
|------|---------------------|-----------------------------------|
| Latencia | timeouts, SLA | … |
| Costo | rate limits, tiers APIs externas | … |
| Compliance | GDPR, auditoría, retención | … |
| Throughput | concurrencia, rate limiting | … |

---

## 7. Riesgos técnicos

| Riesgo | Tipo (SPOF / deuda / escalado) | Mitigación / nota |
|--------|--------------------------------|-------------------|
| … | … | … |

---

## 8. Observabilidad

| Aspecto | Herramienta / patrón | Uso |
|---------|------------------------|-----|
| Logs | Winston, Pino, console, … | … |
| Métricas | Prometheus, StatsD, custom | … |
| Trazas | OpenTelemetry, Jaeger, Datadog | … |
| Alertas | Sentry, PagerDuty, umbrales en config | … |

---

## 9. Seguridad

| Área | Implementación |
|------|-----------------|
| **AuthN** | JWT, OAuth, API keys, sessions, … |
| **AuthZ** | RBAC, middleware, permisos |
| **Cifrado** | TLS, at-rest, librerías |
| **Secretos** | env vars, vault, rotación |
| **Auditoría** | audit logs, who/what/when |

---

*Fin del documento de arquitectura. Para segmentos (ej. RAG_ARCHITECTURE_SECURITY.md), usar el mismo frontmatter con `segment` y solo las secciones correspondientes.*
