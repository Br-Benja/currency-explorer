// ============================================================
// CURRENCY EXPLORER · STARTER PROJECT
// Archivo principal de trabajo para las misiones de JavaScript
// ============================================================

// 1. REFERENCIAS AL DOM
const cantidad = document.querySelector("#cantidad");
const origen = document.querySelector("#origen");
const destino = document.querySelector("#destino");
const btnConvertir = document.querySelector("#convertir");
const btnIntercambiar = document.querySelector("#intercambiar");
const resultado = document.querySelector("#resultado");
const resultadoTexto = document.querySelector("#resultadoTexto");
const detalleTasa = document.querySelector("#detalleTasa");

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);

// 3. FUNCIÓN PRINCIPAL
async function convertirMoneda() {
  // Misiones guiadas 1-3: ya existe un flujo mínimo funcional EUR -> USD.
  // A partir de la Misión 4 debes convertirlo en una solución dinámica.

    // MISIÓN 04: las monedas salen de los <select> elegidos por el usuario.
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  // MISIÓN 07: validar los datos antes de consultar la API.
  const mensajeError = validarDatos(monedaOrigen, monedaDestino);
  if (mensajeError !== "") {
    mostrarError(mensajeError);
    return;
  }

  const valor = Number(cantidad.value);

  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // TODO · MISIÓN 08: activar un estado visual de carga antes de consultar.
    const respuesta = await fetch(url);

    // TODO · MISIÓN 09: comprobar response.ok y lanzar un error si corresponde.
    const datos = await respuesta.json();
    console.log("Respuesta de la API:", datos);

    const conversion = valor * datos.rate;
    mostrarResultado(valor, conversion, datos);

  } catch (error) {
    // TODO · MISIÓN 09: mejora el mensaje y analiza qué errores pueden llegar aquí.
    mostrarError("No fue posible completar la consulta.");
    console.error(error);
  }
}

function intercambiarMonedas() {
  // MISIÓN 06: intercambia origen y destino y vuelve a calcular.
  const temporal = origen.value;
  origen.value = destino.value;
  destino.value = temporal;

  convertirMoneda();
}

function validarDatos(monedaOrigen, monedaDestino) {
  // MISIÓN 07: devuelve un mensaje de error, o "" si todo está bien.
  if (cantidad.validity.badInput) {
    return "La cantidad no es un número válido.";
  }

  if (cantidad.value.trim() === "") {
    return "Escribe una cantidad para convertir.";
  }

  const valor = Number(cantidad.value);

  if (!Number.isFinite(valor)) {
    return "La cantidad no es un número válido.";
  }

  if (valor <= 0) {
    return "La cantidad debe ser mayor que cero.";
  }

  if (monedaOrigen === monedaDestino) {
    return "Elige dos monedas distintas para convertir.";
  }

  return "";
}

// 4. UTILIDADES DE INTERFAZ
function mostrarError(mensaje) {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = "Revisa los datos e inténtalo nuevamente.";
}

function mostrarResultado(valor, conversion, datos) {
  resultado.classList.remove("error");
  resultadoTexto.textContent = `${formatearNumero(valor)} ${datos.base} = ${formatearNumero(conversion)} ${datos.quote}`;
  detalleTasa.textContent = `1 ${datos.base} = ${datos.rate} ${datos.quote} · Fecha: ${datos.date}`;
}

function formatearNumero(numero) {
  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// PISTA PARA EL RETO:
// origen.value        -> moneda seleccionada como origen
// destino.value       -> moneda seleccionada como destino
// cantidad.value      -> texto escrito en el input
// Number(...)         -> convierte texto a número
// response.ok         -> indica si la respuesta HTTP fue satisfactoria
// resultado.textContent -> permite modificar texto del DOM
