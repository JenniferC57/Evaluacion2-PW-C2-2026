const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

// funcion
async function enviar(ruta, cuerpo) {
  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error("No se pudo conectar con el reactor. Verifica que el backend esté encendido.");
  }
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "No se pudo completar la operación.");
  }
  return datos;
}

export function ajustarTemperatura(temperatura) {
  return enviar("/adjust", { temperatura });
}

export function reiniciarReactor() {
  return enviar("/reboot", {});
}