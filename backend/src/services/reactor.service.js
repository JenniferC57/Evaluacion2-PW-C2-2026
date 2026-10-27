// Ejercicio 1: "Estabiliza el Reactor"
// Estado en memoria: la temperatura objetivo vive solo en el servidor.
const generarTemperatura = () => Math.floor(Math.random() * 100) + 1; // 1..100

let temperaturaEstabilizacion = generarTemperatura();

export const ajustar = (temperatura) => {
  if (temperatura < temperaturaEstabilizacion) {
    return { resultado: "más alta", estabilizado: false };
  }
  if (temperatura > temperaturaEstabilizacion) {
    return { resultado: "más baja", estabilizado: false };
  }
  return { resultado: "estabilizado", estabilizado: true };
};

export const reiniciar = () => {
  temperaturaEstabilizacion = generarTemperatura();
};

// Solo para pruebas/depuración en consola del servidor.
export const _verObjetivo = () => temperaturaEstabilizacion;
