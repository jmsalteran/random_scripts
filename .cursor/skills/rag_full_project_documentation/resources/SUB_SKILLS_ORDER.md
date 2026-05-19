# Orden de sub-habilidades – RAG Full Project Documentation

La skill `rag_full_project_documentation` dispara en secuencia las siguientes sub-habilidades. El orden está pensado para que los documentos que pueden ser usados como entrada por otras skills (database, endpoints) existan antes de ejecutar `rag_generate_architecture`.

| Orden | Sub-habilidad | Propósito |
|-------|----------------|-----------|
| 1 | **rag_generate_overview** | Contexto estratégico: propósito, objetivos, alcance, KPIs, stakeholders, dependencias, riesgos. Salida: `RAG_OVERVIEW.md` (y opcionalmente segmentos). |
| 2 | **rag_generate_database** | Modelo de datos completo: todas las tablas y columnas, conceptos de dominio, topología, esquema. Salida: `RAG_DATABASE.md` (y opcionalmente segmentos/índice). |
| 3 | **rag_generate_endpoints** | 100% de endpoints: método, ruta, descripción, decision tree, method calls. Salida: `RAG_ENDPOINTS_INDEX.md` y `RAG_ENDPOINTS_<segmento>.md`. |
| 4 | **rag_generate_domain_rules** | Reglas de negocio: reglas núcleo, prioridad, casos borde, excepciones, ejemplos, matriz de estados, validaciones, impacto regulatorio. Salida: `RAG_DOMAIN_RULES.md` (y opcionalmente segmentos). |
| 5 | **rag_generate_architecture** | Arquitectura técnica: patrón, diagrama, flujos, modelo de datos de alto nivel, decisiones, límites, riesgos, observabilidad, seguridad. Puede leer `RAG_DATABASE.md` y `RAG_ENDPOINTS_*.md` ya generados. Salida: `RAG_ARCHITECTURE.md` (y opcionalmente segmentos). |

Todas escriben en la misma carpeta: `.cursor/personal/RAG_<NOMBRE_PROYECTO>/`, con path de análisis acordado con el usuario (y preguntando la carpeta si no la indica).
