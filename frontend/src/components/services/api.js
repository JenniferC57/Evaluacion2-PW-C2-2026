// Dirección base del backend (Express corre en el puerto 3000).
const API_URL = "http://localhost:3000/api";

// Función auxiliar que usan todas las peticiones.
// Hace el fetch, convierte la respuesta a JSON y revisa si hubo error.
async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(API_URL + ruta, opciones);
  const datos = await respuesta.json();

  // fetch NO lanza error cuando el servidor responde 400 o 403,
  // por eso revisamos "ok" y lanzamos el error nosotros con el mensaje del backend.
  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrió un error en el servidor");
  }

  return datos;
}

// Endpoint 1: GET /api/inventario
// Devuelve la lista de suministros con precio y stock.
export function obtenerInventario() {
  return pedir("/inventario");
}

// Endpoint 2: GET /api/carga
// Devuelve los créditos, los items cargados y el total.
export function obtenerCarga() {
  return pedir("/carga");
}

// Endpoint 3: POST /api/carga/agregar
// Envía { equipoId, cantidad } en el cuerpo de la petición.
export function agregarSuministro(equipoId, cantidad) {
  return pedir("/carga/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equipoId: equipoId, cantidad: cantidad }),
  });
}

// Endpoint 4: PUT /api/carga/actualizar-unidades/:id
// El id va en la URL y la nueva cantidad en el cuerpo.
export function actualizarUnidades(id, cantidad) {
  return pedir(`/carga/actualizar-unidades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantidad: cantidad }),
  });
}

// Endpoint 5: DELETE /api/carga/eliminar/:id
// Quita el suministro de la nave y el backend devuelve las unidades al stock.
export function eliminarSuministro(id) {
  return pedir(`/carga/eliminar/${id}`, {
    method: "DELETE",
  });
}

// Rutas extra del backend para el tiempo de la misión y la confirmación.

// GET /api/mision -> { activa, segundosRestantes }
export function obtenerMision() {
  return pedir("/mision");
}

// POST /api/mision/reiniciar -> vacía la nave y reinicia el tiempo
export function reiniciarMision() {
  return pedir("/mision/reiniciar", {
    method: "POST",
  });
}

// POST /api/carga/confirmar -> bloquea la carga
export function confirmarCarga() {
  return pedir("/carga/confirmar", {
    method: "POST",
  });
}
