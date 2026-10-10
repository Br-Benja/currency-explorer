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
| 05 | Leonardo | Benjamin | `mostrarResultado()` y `formatearNumero()` · resultado con separador de miles · `evidencias/m05-formato-miles.jpeg` |
| 06 | Benjamin | Leonardo | `intercambiarMonedas()` con variable temporal · recalcula al intercambiar · `evidencias/m06-intercambio.jpeg` |
| 07 | Leonardo | Benjamin | `validarDatos()`: vacío, no numérico, cero/negativo y misma moneda · `evidencias/m07-cantidad-invalida.png`, `m07-misma-moneda.png` |
| 08 | Benjamin | Leonardo | `mostrarCargando()` + `finally` · botones deshabilitados mientras carga · `evidencias/m08-cargando.jpeg` |
| 09 | Leonardo | Benjamin | `obtenerTasa()` con `response.ok` + `catch` por tipo de error · `evidencias/m09-sin-conexion.png`, `m09-moneda-invalida.png`, `m09-antes-sin-response-ok.jpeg` |
| 10 | Benjamin | Leonardo | Selectores apilados en ≤680px, ⇄ girado, `overflow-wrap` y foco visible · `evidencias/m10-movil.png`, `m10-escritorio.jpeg` |
| RC | Leonardo | Benjamin | Revisión cruzada: límite máximo, breakpoint 680px y capturas corregidas · `evidencias/rc-limite-maximo.png` |
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
3. Validamos con `validarDatos()` antes del `fetch` para no hacer peticiones con datos incorrectos. Usamos `cantidad.validity.badInput` porque un `<input type="number">` entrega `""` cuando el texto no es un número.
4. Toda la comunicación con la API vive en `obtenerTasa()`, que revisa `response.ok` y lanza un `Error` con un mensaje claro. Así, si cambiáramos de API, solo habría que modificar esa función.
5. En pantallas de 680px o menos apilamos los selectores y giramos ⇄ a ⇅, porque en pantallas angostas los nombres de las monedas se cortaban. Con `overflow-wrap:anywhere` los montos largos ya no se salen de la tarjeta.


## Revisión cruzada
- **Aspecto bien resuelto:** cada función tiene una sola responsabilidad (`validarDatos()`, `obtenerTasa()`, `mostrarResultado()`, `mostrarCargando()`) y el `finally` garantiza que los botones se reactiven aunque falle la red.
- **Error o comportamiento mejorable:** (1) con cantidades enormes el resultado perdía precisión (`1,121,699,999,999,999,800…`); (2) entre 421px y 680px de ancho los nombres de las monedas seguían cortados; (3) antes de la Misión 09, una moneda inválida mostraba `100.00 undefined = NaN undefined`, porque la API responde 422 y no revisábamos `response.ok` (`evidencias/m09-antes-sin-response-ok.jpeg`).
- **Propuesta de mejora:** limitar la cantidad máxima, ampliar el breakpoint del diseño móvil y revisar siempre `response.ok`.
- **Cambio incorporado después de la revisión:** `validarDatos()` rechaza cantidades mayores a 1,000,000,000; el breakpoint pasó de 420px a 680px; y con `obtenerTasa()` una moneda inválida ahora muestra "código 422" (`evidencias/m09-moneda-invalida.jpeg`).

## Reflexión final (150–200 palabras)
Explica el principal aprendizaje técnico, una dificultad relevante y una decisión que haya surgido del trabajo Driver/Navigator.
