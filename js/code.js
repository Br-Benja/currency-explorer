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
const btnHistorico = document.querySelector("#verHistorico");
const historialEstado = document.querySelector("#historialEstado");
const lienzoGrafica = document.querySelector("#grafica");
let grafica = null; // MISIÓN 11: guardamos la gráfica para poder reemplazarla

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);
btnHistorico.addEventListener("click", mostrarHistorico);

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

  try {
    // MISIÓN 08: estado de carga mientras esperamos a la API.
    mostrarCargando(true);

    // MISIÓN 09: obtenerTasa() lanza un error si algo sale mal.
    const datos = await obtenerTasa(monedaOrigen, monedaDestino);
    console.log("Respuesta de la API:", datos);

    const conversion = valor * datos.rate;
    mostrarResultado(valor, conversion, datos);

  } catch (error) {
    // MISIÓN 09: identificar qué tipo de error llegó para mostrar un mensaje claro.
    if (error instanceof TypeError) {
      mostrarError("Sin conexión: no se pudo contactar al servicio de tipos de cambio.");
    } else if (error instanceof SyntaxError) {
      mostrarError("La respuesta del servicio no tiene un formato válido.");
    } else {
      mostrarError(error.message);
    }
    console.error(error);
  } finally {
    mostrarCargando(false);
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
  
  // REVISIÓN CRUZADA: con números enormes JavaScript pierde precisión.
  if (valor > 1000000000) {
    return "La cantidad máxima es 1,000,000,000 (mil millones).";
  }

  if (monedaOrigen === monedaDestino) {
    return "Elige dos monedas distintas para convertir.";
  }

  return "";
}

async function obtenerTasa(monedaOrigen, monedaDestino) {
  // MISIÓN 09: única función que habla con la API.
  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`El servicio respondió con un error (código ${respuesta.status}).`);
  }

  const datos = await respuesta.json();

  if (typeof datos.rate !== "number") {
    throw new Error("La respuesta del servicio no trae un tipo de cambio válido.");
  }

  return datos;
}

async function mostrarHistorico() {
  // MISIÓN 11: serie temporal mensual del par elegido.
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  if (monedaOrigen === monedaDestino) {
    historialEstado.textContent = "Elige dos monedas distintas para ver el histórico.";
    return;
  }

  btnHistorico.disabled = true;
  historialEstado.textContent = "Consultando histórico...";

  try {
    const serie = await obtenerHistorico(monedaOrigen, monedaDestino);

    // Dos arreglos: uno para el eje X (meses) y otro para el eje Y (tasas).
    const meses = serie.map(registro => registro.date.slice(0, 7));
    const tasas = serie.map(registro => registro.rate);

    dibujarGrafica(meses, tasas, monedaOrigen, monedaDestino);
    historialEstado.textContent = `${serie.length} meses · 1 ${monedaOrigen} pasó de ${tasas[0]} a ${tasas[tasas.length - 1]} ${monedaDestino}.`;
  } catch (error) {
    historialEstado.textContent = "No fue posible obtener el histórico.";
    console.error(error);
  } finally {
    btnHistorico.disabled = false;
  }
}

async function obtenerHistorico(monedaOrigen, monedaDestino) {
  // MISIÓN 11: la API devuelve un arreglo con un registro por mes.
  const url = `https://api.frankfurter.dev/v2/rates?base=${monedaOrigen}&quotes=${monedaDestino}&from=2026-01-01&group=month`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`El servicio respondió con un error (código ${respuesta.status}).`);
  }

  const serie = await respuesta.json();
  console.log("Histórico de la API:", serie);

  if (!Array.isArray(serie) || serie.length === 0) {
    throw new Error("La API no devolvió una serie de datos.");
  }

  return serie;
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

function mostrarCargando(cargando) {
  // MISIÓN 08: bloquea los botones mientras esperamos la respuesta.
  btnConvertir.disabled = cargando;
  btnIntercambiar.disabled = cargando;

  if (cargando) {
    btnConvertir.textContent = "Consultando...";
    resultado.classList.remove("error");
    resultadoTexto.textContent = "Consultando...";
    detalleTasa.textContent = "Esperando la respuesta de la API.";
  } else {
    btnConvertir.textContent = "Convertir";
  }
}

function formatearNumero(numero) {
  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function dibujarGrafica(meses, tasas, monedaOrigen, monedaDestino) {
  // MISIÓN 11: Chart.js recibe dos arreglos: etiquetas (meses) y valores (tasas).
  if (grafica !== null) {
    grafica.destroy();
  }

  grafica = new Chart(lienzoGrafica, {
    type: "line",
    data: {
      labels: meses,
      datasets: [{
        label: `1 ${monedaOrigen} en ${monedaDestino}`,
        data: tasas,
        borderColor: "#16758b",
        backgroundColor: "#16758b",
        borderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        title: { display: true, text: `1 ${monedaOrigen} en ${monedaDestino} por mes` }
      }
    }
  });
}

// PISTA PARA EL RETO:
// origen.value        -> moneda seleccionada como origen
// destino.value       -> moneda seleccionada como destino
// cantidad.value      -> texto escrito en el input
// Number(...)         -> convierte texto a número
// response.ok         -> indica si la respuesta HTTP fue satisfactoria
// resultado.textContent -> permite modificar texto del DOM
