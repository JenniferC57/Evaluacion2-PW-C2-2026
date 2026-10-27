const generarTemperatura = () => Math.floor(Math.random() * 100) + 1; 

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

export const _verObjetivo = () => temperaturaEstabilizacion;
