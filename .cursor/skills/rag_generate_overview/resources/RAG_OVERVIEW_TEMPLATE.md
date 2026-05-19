# Plantilla para RAG_OVERVIEW

Usar este esquema al generar el contenido del overview. Sustituir los placeholders por el contenido inferido del análisis. Incluir siempre el frontmatter según RAG_FRONTMATTER_OVERVIEW.md.

---

```yaml
---
rag_document_type: overview
project_name: "<NOMBRE_PROYECTO>"
scope: "<ruta analizada, ej. packages/admin>"
title: "<título legible, ej. Overview del proyecto Admin>"
generated_at: "<ISO8601 opcional>"
# segment: "<opcional si es segmento>"
---
```

# Overview – [Nombre del proyecto]

> Documento generado para RAG a partir del análisis de `scope`. Secciones marcadas con **[validar]** requieren confirmación con negocio/producto.

---

## 1. Propósito del proyecto

**Problema que resuelve:**

[Descripción del propósito; usar description de package.json/README e inferencias del código.]

**Para quién:**

- [Audiencia 1]
- [Audiencia 2]
- [Inferir desde API, roles, docs]

---

## 2. Objetivos medibles

[3–5 metas concretas y verificables; derivar de features, performance, SLAs. Marcar "[validar]" si inferido.]

1. **[Objetivo 1]**
2. **[Objetivo 2]**
3. **[Objetivo 3]**
…

---

## 3. Alcance in/out

### In scope ✓

- [Módulo/feature 1]
- [Módulo/feature 2]
- [Listar lo que está dentro del path analizado]

### Out of scope ✗

- [Sistemas/paquetes no incluidos en el path]
- [Temas externos no referenciados en el código]

---

## 4. KPIs y SLOs

[Baseline, meta y frecuencia si hay métricas/monitoring en el código; si se infiere, marcar claramente.]

| KPI/SLO | Baseline | Meta | Frecuencia |
|---------|----------|------|-------------|
| [Ej. latencia p95] | … | … | … |

---

## 5. Stakeholders

[Tabla placeholder; no derivable del código. El usuario debe completar.]

| Rol | Responsabilidad | Contacto |
|-----|-----------------|----------|
| … | … | … |

---

## 6. Dependencias críticas

[Sistemas, vendors, equipos a partir de dependencies, clientes de API, variables de entorno.]

| Dependencia | Tipo | Uso / impacto |
|-------------|------|----------------|
| … | … | … |

---

## 7. Riesgos top

[Puntos únicos de fallo, vendor lock-in, zonas de complejidad, áreas sensibles de seguridad.]

| Riesgo | Mitigación / nota |
|--------|-------------------|
| … | … |

---

*Fin del overview. Para documentos segmentados (ej. RAG_OVERVIEW_DEPENDENCIES.md), usar el mismo frontmatter con `segment` y solo las secciones correspondientes.*
