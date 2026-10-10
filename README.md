# Currency Explorer

Conversor de divisas que consulta tipos de cambio reales en la API pública Frankfurter. Proyecto en parejas con Pair Programming.

## Integrantes
- Estudiante A: Benjamin (@Br-Benja)
- Estudiante B: Leonardo (@22031485-byte)

## Objetivo
Construir una aplicación web en HTML, CSS y JavaScript Vanilla que convierta importes entre divisas con información real, y comprender el recorrido completo de los datos:

**clic del usuario → evento → `fetch()` → API → respuesta JSON → objeto JavaScript → cálculo → actualización del DOM**

## Funcionalidades
- Conversión entre EUR, USD, MXN, GBP y JPY con el tipo de cambio del día.
- Resultado con separador de miles y dos decimales (`1,000,000.00 EUR = …`), más la tasa y su fecha.
- Botón **⇄** que intercambia las monedas y vuelve a calcular.
- Validación antes de llamar a la API: cantidad vacía, no numérica, cero o negativa, mayor a mil millones y misma moneda en origen y destino.
- Estado de carga: el botón dice "Consultando..." y los botones se deshabilitan mientras llega la respuesta.
- Manejo de errores con mensajes claros: sin conexión, respuesta HTTP con error (`response.ok`) y respuesta que no es JSON.
- Diseño responsive: en pantallas de 680px o menos los selectores se apilan y ⇄ gira a ⇅. Foco visible con el teclado.
- Histórico mensual 2026 del par elegido, con gráfica de línea (extensión, Misión 11).

## Ejecución
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Br-Benja/currency-explorer.git
   ```
2. Abrir la carpeta `currency-explorer` en VS Code.
3. Abrir `index.html` con **Live Server** (clic derecho → *Open with Live Server*).
4. Se necesita conexión a internet: la app consulta la API y carga Chart.js desde un CDN.
5. Para ver las peticiones: DevTools (F12) → **Network** → filtro **Fetch/XHR**.

## API utilizada
[Frankfurter](https://frankfurter.dev): API pública por HTTPS, sin registro ni API key. Responde en JSON.

| Uso | Endpoint |
|---|---|
| Conversión | `GET https://api.frankfurter.dev/v2/rate/{origen}/{destino}` |
| Histórico (Misión 11) | `GET https://api.frankfurter.dev/v2/rates?base={origen}&quotes={destino}&from=2026-01-01&group=month` |

Respuesta de `/v2/rate/EUR/JPY`:
```json
{ "date": "2026-10-08", "base": "EUR", "quote": "JPY", "rate": 177.47 }
```
Con una moneda inválida, la API responde **422** con `{ "status": 422, "message": "invalid currency: XXX" }`.

## Estructura del código (`js/code.js`)
| Zona | Función | Responsabilidad |
|---|---|---|
| 1. Referencias | — | Localiza los elementos del DOM con `querySelector()` |
| 2. Eventos | — | Conecta los botones con `addEventListener()` |
| 3. Aplicación | `convertirMoneda()` | Coordina el flujo: lee, valida, consulta, calcula y muestra |
| | `intercambiarMonedas()` | Intercambia origen y destino con una variable temporal y recalcula |
| | `validarDatos()` | Devuelve un mensaje de error, o `""` si los datos son válidos |
| | `obtenerTasa()` | Única función que habla con la API de conversión; revisa `response.ok` |
| | `mostrarHistorico()` / `obtenerHistorico()` | Pide la serie temporal y la convierte en dos arreglos con `map()` |
| 4. Interfaz | `mostrarError()`, `mostrarResultado()`, `mostrarCargando()` | Actualizan el DOM con `textContent` y clases |
| | `formatearNumero()` | Formato `es-MX` con separador de miles |
| | `dibujarGrafica()` | Dibuja la línea del histórico con Chart.js |

## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---|---|---|---|
| 00 | Benjamin | Leonardo | Starter Project inicial |
| 01–03 | Leonardo | Benjamin | Flujo guiado EUR/USD verificado · `evidencias/console-eur-usd.png` |
| 04 | Benjamin | Leonardo | Origen y destino desde los `<select>` · `evidencias/app-eur-jpy.png`, `network-headers-eur-jpy.png`, `network-response-eur-jpy.png` |
| 05 | Leonardo | Benjamin | `mostrarResultado()` y `formatearNumero()` · resultado con separador de miles · `evidencias/m05-formato-miles.jpeg` |
| 06 | Benjamin | Leonardo | `intercambiarMonedas()` con variable temporal · recalcula al intercambiar · `evidencias/m06-intercambio.jpeg` |
| 07 | Leonardo | Benjamin | `validarDatos()`: vacío, no numérico, cero/negativo y misma moneda · `evidencias/m07-cantidad-invalida.png`, `m07-misma-moneda.png` |
| 08 | Benjamin | Leonardo | `mostrarCargando()` + `finally` · botones deshabilitados mientras carga · `evidencias/m08-cargando.jpeg` |
| 09 | Leonardo | Benjamin | `obtenerTasa()` con `response.ok` + `catch` por tipo de error · `evidencias/m09-sin-conexion.png`, `m09-moneda-invalida.png`, `m09-antes-sin-response-ok.jpeg` |
| 10 | Benjamin | Leonardo | Selectores apilados en ≤680px, ⇄ girado, `overflow-wrap` y foco visible · `evidencias/m10-movil.png`, `m10-escritorio.jpeg` |
| RC | Leonardo | Benjamin | Revisión cruzada: límite máximo, breakpoint 680px y capturas corregidas · `evidencias/rc-limite-maximo.png` |
| 11 | Benjamin | Leonardo | Histórico mensual con `/v2/rates`, `map()` a dos arreglos y gráfica con Chart.js · `evidencias/m11-historico.jpeg` |
<<<<<<< HEAD
| Final | Leonardo | Benjamin | README final, reflexión y captura del historial · `evidencias/git-historial.png` |
=======
>>>>>>> f858e571247f889aded6b831451556e0b946c463

Cada commit indica el Driver y el Navigator en el mensaje e incluye al Navigator como coautor (`Co-authored-by`).

## Evidencia de red (Entregable 04)
- `evidencias/network-headers-eur-jpy.png`: petición `GET /v2/rate/EUR/JPY` con **status 200 OK**.
- `evidencias/network-response-eur-jpy.png`: respuesta JSON con `date`, `base`, `quote` y `rate`.

## Decisiones técnicas
1. Leemos `origen.value` y `destino.value` dentro de `convertirMoneda()` y no al cargar la página, para usar siempre la moneda seleccionada en el momento del clic.
2. Separamos `mostrarResultado()` y `formatearNumero()` de `convertirMoneda()`: así cada función tiene una sola responsabilidad, y con `toLocaleString("es-MX")` los montos grandes se leen con separador de miles (17,747.00 en lugar de 17747.00).
3. Validamos con `validarDatos()` antes del `fetch` para no hacer peticiones con datos incorrectos. Usamos `cantidad.validity.badInput` porque un `<input type="number">` entrega `""` cuando el texto no es un número.
4. Toda la comunicación con la API vive en `obtenerTasa()`, que revisa `response.ok` y lanza un `Error` con un mensaje claro. Así, si cambiáramos de API, solo habría que modificar esa función.
5. En pantallas de 680px o menos apilamos los selectores y giramos ⇄ a ⇅, porque en pantallas angostas los nombres de las monedas se cortaban. Con `overflow-wrap:anywhere` los montos largos ya no se salen de la tarjeta.
6. Para el histórico usamos `map()` para convertir la serie de la API en dos arreglos (meses y tasas), que es lo que necesita Chart.js. La librería solo dibuja; la consulta, la validación y la transformación de datos son JavaScript nuestro.
<<<<<<< HEAD
=======

>>>>>>> f858e571247f889aded6b831451556e0b946c463

## Revisión cruzada
- **Aspecto bien resuelto:** cada función tiene una sola responsabilidad (`validarDatos()`, `obtenerTasa()`, `mostrarResultado()`, `mostrarCargando()`) y el `finally` garantiza que los botones se reactiven aunque falle la red.
- **Error o comportamiento mejorable:** (1) con cantidades enormes el resultado perdía precisión (`1,121,699,999,999,999,800…`); (2) entre 421px y 680px de ancho los nombres de las monedas seguían cortados; (3) antes de la Misión 09, una moneda inválida mostraba `100.00 undefined = NaN undefined`, porque la API responde 422 y no revisábamos `response.ok` (`evidencias/m09-antes-sin-response-ok.jpeg`).
- **Propuesta de mejora:** limitar la cantidad máxima, ampliar el breakpoint del diseño móvil y revisar siempre `response.ok`.
- **Cambio incorporado después de la revisión:** `validarDatos()` rechaza cantidades mayores a 1,000,000,000; el breakpoint pasó de 420px a 680px; y con `obtenerTasa()` una moneda inválida ahora muestra "código 422" (`evidencias/m09-moneda-invalida.png`).

## Reflexión final
El principal aprendizaje técnico fue entender el recorrido completo de los datos: un clic dispara un evento, `fetch()` hace la petición por la red, `response.json()` convierte la respuesta en un objeto y solo entonces calculamos y actualizamos el DOM. También aprendimos que `fetch()` no falla con un 404 o un 422: con una moneda inválida la app mostraba «NaN undefined» hasta que revisamos `response.ok` y lanzamos nuestros propios errores.

La dificultad más relevante no fue JavaScript, sino Git. Trabajamos en una carpeta que no era el repositorio, editamos archivos antes de hacer `git pull` y tomamos capturas con código viejo que el navegador tenía en caché. Por eso adoptamos una rutina: empezar cada sesión con `git pull` y recargar con Ctrl + Shift + R antes de probar.

La decisión más importante del trabajo Driver/Navigator fue que el Navigator revisara `git status` y abriera las capturas antes de cada commit, porque varias veces subimos archivos incompletos o evidencias que no mostraban el cambio. Alternar roles en cada misión nos obligó a explicar el código antes de subirlo, y así los dos podemos defender cualquier parte.
