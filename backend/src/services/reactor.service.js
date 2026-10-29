const generarTemperatura = () => Math.floor(Math.random() * 100) + 1;
let temperaturaEstabilizacion = generarTemperatura();

export const ajustar = (temperatura) => {
  if (temperatura < temperaturaEstabilizacion) {
    return { resultado: "mas alta", estabilizado: false };
  }
  if (temperatura > temperaturaEstabilizacion) {
    return { resultado: "mas baja", estabilizado: false };
  }
  return { resultado: "estabilizado", estabilizado: true };
};

export const reiniciar = () => {
  temperaturaEstabilizacion = generarTemperatura();
};

export const _verObjetivo = () => temperaturaEstabilizacion;
