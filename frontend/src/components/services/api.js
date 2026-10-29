const API_URL = "http://localhost:3000/api";

async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(API_URL + ruta, opciones);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrió un error en el servidor");
  }

  return datos;
}

export function obtenerInventario() {
  return pedir("/inventario");
}

export function obtenerCarga() {
  return pedir("/carga");
}

export function agregarSuministro(equipoId, cantidad) {
  return pedir("/carga/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equipoId: equipoId, cantidad: cantidad }),
  });
}

export function actualizarUnidades(id, cantidad) {
  return pedir(`/carga/actualizar-unidades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantidad: cantidad }),
  });
}

export function eliminarSuministro(id) {
  return pedir(`/carga/eliminar/${id}`, {
    method: "DELETE",
  });
}

export function obtenerMision() {
  return pedir("/mision");
}

export function reiniciarMision() {
  return pedir("/mision/reiniciar", {
    method: "POST",
  });
}

export function confirmarCarga() {
  return pedir("/carga/confirmar", {
    method: "POST",
  });
}