
const inventario = [
  {
    id: 201,
    nombre: "Tanque de Oxígeno XL",
    precio: 50,
    stock: 5,
    categoria: "Soporte Vital"
  },
  {
    id: 202,
    nombre: "Traje Espacial",
    precio: 150,
    stock: 3,
    categoria: "Equipamiento"
  },
  {
    id: 203,
    nombre: "Kit de Alimentos",
    precio: 25,
    stock: 10,
    categoria: "Alimentación"
  },
  {
    id: 204,
    nombre: "Botiquín Médico",
    precio: 40,
    stock: 4,
    categoria: "Salud"
  },
  {
    id: 205,
    nombre: "Batería de Energía",
    precio: 80,
    stock: 6,
    categoria: "Tecnología"
  }
];

// Devuelve los productos disponibles en la base.
export function obtenerInventario() {
  return inventario;
}

// Presupuesto inicial que tiene el capitán.
const presupuestoInicial = 500;

// Aquí guardaremos los productos agregados a la nave.
const itemsCargados = [];

// Función para consultar la carga de la nave.
export function obtenerCarga() {

  // Calculamos el costo de los productos cargados.
  const total = itemsCargados.reduce((suma, item) => {
    const producto = inventario.find(p => p.id === item.id);
    return suma + (producto ? producto.precio * item.cantidad : 0);
  }, 0);

  // Devolvemos los créditos restantes y la carga actual.
  return {
    creditos: presupuestoInicial - total,
    itemsCargados: itemsCargados,
    total: total
  };
}


// Función para agregar suministros a la nave.
export function agregarSuministro(equipoId, cantidad) {

  // Convertimos los datos recibidos a números.
  const id = Number(equipoId);
  const unidades = Number(cantidad);

  // Comprobamos que los datos sean válidos.
  if (!Number.isInteger(id) || !Number.isInteger(unidades) || unidades <= 0) {
    return { error: "Datos inválidos", status: 400 };
  }

  // Buscamos el producto en el inventario.
  const producto = inventario.find(p => p.id === id);

  if (!producto) {
    return { error: "Producto no encontrado", status: 404 };
  }

  // Verificamos que haya suficientes unidades.
  if (producto.stock < unidades) {
    return { error: "Stock en base insuficiente", status: 400 };
  }

  // Calculamos cuánto costarán las nuevas unidades.
  const costo = producto.precio * unidades;
  const cargaActual = obtenerCarga();

  // Verificamos que el presupuesto alcance.
  if (cargaActual.creditos < costo) {
    return { error: "Créditos insuficientes", status: 400 };
  }

  // Comprobamos si el producto ya está en la nave.
  const item = itemsCargados.find(p => p.id === id);

  if (item) {
    item.cantidad += unidades;
  } else {
    itemsCargados.push({ id: id, cantidad: unidades });
  }

  // Descontamos las unidades del inventario disponible.
  producto.stock -= unidades;

  // Devolvemos la carga actualizada.
  return { carga: obtenerCarga() };
}


// Función para actualizar la cantidad de un suministro en la nave.
export function actualizarUnidades(id, cantidad) {

  // Convertimos los datos recibidos a números.
  const equipoId = Number(id);
  const nuevaCantidad = Number(cantidad);

  // Verificamos que los valores sean correctos.
  if (!Number.isInteger(equipoId) || !Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
    return { error: "Cantidad o ID inválido", status: 400 };
  }

  // Buscamos el suministro que ya está cargado.
  const item = itemsCargados.find(p => p.id === equipoId);

  if (!item) {
    return { error: "Suministro no encontrado en la nave", status: 404 };
  }

  // Buscamos el producto en el inventario.
  const producto = inventario.find(p => p.id === equipoId);

  // Calculamos cuántas unidades aumentan o disminuyen.
  const diferencia = nuevaCantidad - item.cantidad;

  // Si aumentamos unidades, verificamos el stock disponible.
  if (diferencia > 0 && producto.stock < diferencia) {
    return { error: "Stock en base insuficiente", status: 400 };
  }

  // Comprobamos si alcanzan los créditos para aumentar.
  if (diferencia > 0 && diferencia * producto.precio > obtenerCarga().creditos) {
    return { error: "Créditos insuficientes para esta cantidad", status: 400 };
  }

  // Actualizamos las unidades de la nave y del inventario.
  item.cantidad = nuevaCantidad;
  producto.stock -= diferencia;

  // Devolvemos la carga actualizada.
  return { carga: obtenerCarga() };
}

// Función para eliminar un suministro de la nave.
export function eliminarSuministro(id) {

  // Convertimos el ID recibido a número.
  const equipoId = Number(id);

  // Verificamos que el ID sea válido.
  if (!Number.isInteger(equipoId) || equipoId <= 0) {
    return { error: "ID inválido", status: 400 };
  }

  // Buscamos la posición del producto en la carga.
  const posicion = itemsCargados.findIndex(p => p.id === equipoId);

  // Si no está en la nave, devolvemos un error.
  if (posicion === -1) {
    return { error: "Suministro no encontrado en la nave", status: 404 };
  }

  // Obtenemos el producto cargado.
  const item = itemsCargados[posicion];

  // Buscamos el producto en el inventario.
  const producto = inventario.find(p => p.id === equipoId);

  // Devolvemos las unidades al inventario general.
  producto.stock += item.cantidad;

  // Eliminamos el producto de la carga.
  itemsCargados.splice(posicion, 1);

  // Devolvemos la carga actualizada.
  return { carga: obtenerCarga() };
}

// Tiempo máximo de la misión: 5 minutos.
const DURACION_MISION = 5 * 60 * 1000;

// Guardamos el momento en que inicia la misión.
let inicioMision = Date.now();

// Función para consultar el tiempo disponible.
export function obtenerEstadoMision() {
  const tiempoTranscurrido = Date.now() - inicioMision;

  const segundosRestantes = Math.max(
    0,
    Math.ceil((DURACION_MISION - tiempoTranscurrido) / 1000)
  );

  return {
    activa: segundosRestantes > 0,
    segundosRestantes: segundosRestantes
  };
}

// Función para iniciar una nueva misión.
export function reiniciarMision() {

  // Devolvemos los suministros cargados al inventario.
  itemsCargados.forEach(item => {
    const producto = inventario.find(p => p.id === item.id);

    if (producto) {
      producto.stock += item.cantidad;
    }
  });

  // Vaciamos la nave.
  itemsCargados.length = 0;

  // Reiniciamos el tiempo de la misión.
  inicioMision = Date.now();

  return {
    mensaje: "Nueva misión iniciada",
    ...obtenerEstadoMision(),
    ...obtenerCarga()
  };
}