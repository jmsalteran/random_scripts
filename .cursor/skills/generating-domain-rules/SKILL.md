---
name: generating-domain-rules
description: Genera un documento DOMAIN_RULES.md basado en un repositorio de código o carpeta. Extrae reglas de negocio, validaciones, matrices de estado y excepciones. Use cuando el usuario pida extraer reglas de negocio, domain rules o crear un archivo DOMAIN_RULES.md.
---

# Generador de Reglas de Dominio (Domain Rules)

## When to use this skill
- Cuando el usuario solicite extraer o documentar las reglas de negocio de un código.
- Cuando el usuario pida crear un archivo `DOMAIN_RULES.md`.
- Cuando se necesite entender la matriz de estados, casos borde o prioridades de negocio de un proyecto o carpeta de código.

## Workflow
- [ ] Identificar la ruta (repositorio completo o carpeta específica) que el usuario desea analizar.
- [ ] Examinar exhaustivamente el código (modelos, controladores, servicios, validadores, constantes y tests) en busca de la lógica core del negocio.
- [ ] Recabar la información para completar cada uno de los requisitos estructurales solicitados.
- [ ] Generar el archivo `DOMAIN_RULES.md` siguiendo estrictamente la estructura estandarizada.
- [ ] Presentar el resultado al usuario y verificar si cumple sus expectativas.

## Instructions
El objetivo es sintetizar la lógica de negocio subyacente del código en un único documento de alto nivel llamado `DOMAIN_RULES.md`.

### Estructura obligatoria del documento

El documento generado debe incluir obligatoriamente las siguientes secciones:

#### Reglas núcleo
- Expresar la lógica principal del negocio en formato: **“Si [condición], entonces [acción/resultado]”**.

#### Prioridad de reglas
- Definir qué regla gana o prevalece en caso de conflictos lógicos (por ejemplo, ¿un descuento corporativo ignora un descuento por suscripción?).

#### Casos borde
- Describir cómo se manejan situaciones inusuales o fallos perdonables (valores nulos, registros duplicados, recepción de eventos *out-of-order*, expiraciones de *tokens* o sesiones, etc.).

#### Excepciones permitidas
- Detallar en qué situaciones está permitido romper una regla general del negocio.
- Especificar qué rol (ej: `super_admin`) o proceso interno autoriza esta excepción.

#### Ejemplos reales
- Proveer casos prácticos extraídos del código. Ejemplo en formato: `input → output esperado`.

#### Matriz de estados
- Documentar (texto o diagramas Mermaid/tablas) los ciclos de vida importantes (ej: estado de una orden).
- Hacer explícitas cuáles son las **transiciones válidas** e **inválidas**.

#### Validaciones obligatorias
- Enumerar las **pre-condiciones** (qué requisitos exactos deben cumplirse antes de procesar una entidad) y **post-condiciones** de las funciones principales.

#### Impacto regulatorio
- Identificar si el código hace distinciones basado en regulaciones, como reglas por país, canal comercial o segmento de clientes (ej: reglas GDPR, bloqueos regionales).

## Resources
- Te puedes ayudar indirectamente de otras habilidades analíticas si es necesario (ej: `analyzing-endpoints` o `analyzing-databases`), para obtener la lista de campos o rutas desde donde extraer la ejecución de las funciones, enfocándote siempre en el "comportamiento y decisión de negocio".
