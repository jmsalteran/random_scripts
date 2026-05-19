# Architecture Document

> Documento generado a partir del análisis del repositorio/carpeta indicada. Secciones basadas en evidencia del código y configuración.

---

## 1. Contexto técnico

**Patrón arquitectónico:**
[Identificar: MVC, Clean Architecture, Hexagonal, Serverless, Monolito modular, etc.]

**Por qué:**
[Justificación: modularidad, testabilidad, boundaries de equipo, escalabilidad, etc.]

---

## 2. Diagrama lógico

Componentes principales del sistema:

```
[Servicios / APIs] ←→ [Bases de datos]
        ↕
[Colas / Eventos] ←→ [Terceros / Integraciones]
```

### Servicios
- [Servicio 1 – descripción breve]
- [Servicio 2]

### Bases de datos
- [DB 1 – tipo y propósito]
- [DB 2]

### Colas y eventos
- [Sistema de mensajería – RabbitMQ, Redis, etc., si aplica]

### Terceros
- [Integración 1 – API externa, vendor]
- [Integración 2]

---

## 3. Flujos clave

### Request lifecycle
[Describir el flujo típico: entrada → middleware → controller → service → persistencia → respuesta]

### Eventos
[Flujos asíncronos: publicación, suscripción, handlers]

### Reconciliaciones
[Jobs programados, sincronización batch, procesos de recuperación]

---

## 4. Modelo de datos de alto nivel

### Entidades principales
- **[Entidad 1]**: [Descripción y relaciones]
- **[Entidad 2]**: [Descripción y relaciones]
- **[Entidad 3]**: [Descripción y relaciones]

### Relaciones
[Diagrama o lista de relaciones clave: 1:N, N:M, etc.]

---

## 5. Decisiones técnicas vigentes

| ADR | Título | Estado | Link |
|-----|--------|--------|------|
| [ADR-001] | [Título] | Aceptado | [docs/adr/001-titulo.md](docs/adr/001-titulo.md) |
| [ADR-002] | [Título] | Aceptado | [docs/adr/002-titulo.md](docs/adr/002-titulo.md) |

---

## 6. Límites y constraints

| Dimensión | Constraint | Notas |
|-----------|------------|-------|
| Latencia | [p.ej. < 200ms P95] | |
| Costo | [presupuesto, límites de API externa] | |
| Compliance | [GDPR, auditoría, retención] | |
| Throughput | [req/s, workers, rate limits] | |

---

## 7. Riesgos técnicos

| Riesgo | Tipo | Mitigación |
|--------|------|------------|
| [Riesgo 1] | SPOF / Deuda / Escalado | [Acción] |
| [Riesgo 2] | | |
| [Riesgo 3] | | |
| [Riesgo 4] | | |
| [Riesgo 5] | | |

---

## 8. Observabilidad

### Logs
- [Biblioteca/canal: Pino, Winston, CloudWatch]
- [Niveles y retención]

### Métricas
- [Sistema: Prometheus, Datadog, custom]
- [Métricas clave]

### Trazas
- [OpenTelemetry, Jaeger, etc.]
- [Propagación entre servicios]

### Alertas clave
- [Alerta 1 – condición y criticidad]
- [Alerta 2]

---

## 9. Seguridad

### Autenticación (authN)
[Estrategia: JWT, OAuth, API keys, sesiones]

### Autorización (authZ)
[Modelo: RBAC, ABAC, permisos por recurso]

### Cifrado
- **En tránsito**: [TLS, mTLS]
- **En reposo**: [Si aplica]

### Secretos
[Gestión: env, vault, rotación]

### Auditoría
[Logs de auditoría, trazabilidad de acciones]
