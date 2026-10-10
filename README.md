# Currency Explorer

## Integrantes
- Estudiante A: Benjamin (@Br-Benja)
- Estudiante B: Leonardo (@22031485-byte)

## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---|---|---|---|
| 00 | Benjamin | Leonardo | Starter Project inicial |
| 01–03 | Leonardo | Benjamin | Flujo guiado EUR/USD verificado · evidencias/console-eur-usd.png |
| 04 | Benjamin | Leonardo | Origen y destino desde los `<select>` · `evidencias/app-eur-jpy.png`, `network-headers-eur-jpy.png`, `network-response-eur-jpy.png` |
| 05 | Leonardo | Benjamin | `mostrarResultado()` y `formatearNumero()` · resultado con separador de miles |
| 06 | | | |
| 07 | | | |
| 08 | | | |
| 09 | | | |
| 10 | | | |
| 11 | | | |

## Objetivo
Completar una aplicación frontend que consuma Frankfurter API para convertir divisas y demostrar comprensión de eventos, DOM, `fetch()`, JSON, asincronía, validación y manejo de errores.

## Ejecución
1. Descomprime el proyecto.
2. Abre la carpeta en VS Code.
3. Ejecuta `index.html` con Live Server o un servidor local equivalente.
4. Abre DevTools → Console y Network para observar el comportamiento.

## API
Endpoint de referencia:
`https://api.frankfurter.dev/v2/rate/{origen}/{destino}`

## Decisiones técnicas
Registra aquí al menos dos decisiones tomadas por la pareja y explica por qué.

1. Leemos `origen.value` y `destino.value` dentro de `convertirMoneda()` y no al cargar la página, para usar siempre la moneda seleccionada en el momento del clic.
2. Separamos `mostrarResultado()` y `formatearNumero()` de `convertirMoneda()`: así cada función tiene una sola responsabilidad, y con `toLocaleString("es-MX")` los montos grandes se leen con separador de miles (17,747.00 en lugar de 17747.00).

## Revisión cruzada
- Aspecto bien resuelto:
- Error o comportamiento mejorable:
- Propuesta de mejora:
- Cambio incorporado después de la revisión:

## Reflexión final (150–200 palabras)
Explica el principal aprendizaje técnico, una dificultad relevante y una decisión que haya surgido del trabajo Driver/Navigator.
