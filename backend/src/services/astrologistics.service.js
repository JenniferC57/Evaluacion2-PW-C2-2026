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

export function obtenerInventario() {
  return inventario;
}

const presupuestoInicial = 500;

const itemsCargados = [];

let cargaConfirmada = false;

export function obtenerCarga() {
  const total = itemsCargados.reduce((suma, item) => {
    const producto = inventario.find(p => p.id === item.id);
    return suma + (producto ? producto.precio * item.cantidad : 0);
  }, 0);

  return {
    creditos: presupuestoInicial - total,
    itemsCargados: itemsCargados,
    total: total,
    confirmada: cargaConfirmada
  };
}

export function agregarSuministro(equipoId, cantidad) {

  const id = Number(equipoId);
  const unidades = Number(cantidad);

  if (!Number.isInteger(id) || !Number.isInteger(unidades) || unidades <= 0) {
    return { error: "Datos inválidos", status: 400 };
  }

  const producto = inventario.find(p => p.id === id);

  if (!producto) {
    return { error: "Producto no encontrado", status: 404 };
  }

  if (producto.stock < unidades) {
    return { error: "Stock en base insuficiente", status: 400 };
  }

  const costo = producto.precio * unidades;
  const cargaActual = obtenerCarga();

  if (cargaActual.creditos < costo) {
    return { error: "Créditos insuficientes", status: 400 };
  }

  const item = itemsCargados.find(p => p.id === id);

  if (item) {
    item.cantidad += unidades;
  } else {
    itemsCargados.push({ id: id, cantidad: unidades });
  }

  producto.stock -= unidades;

  return { carga: obtenerCarga() };
}

export function actualizarUnidades(id, cantidad) {
  const equipoId = Number(id);
  const nuevaCantidad = Number(cantidad);

  if (!Number.isInteger(equipoId) || !Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
    return { error: "Cantidad o ID inválido", status: 400 };
  }

  const item = itemsCargados.find(p => p.id === equipoId);

  if (!item) {
    return { error: "Suministro no encontrado en la nave", status: 404 };
  }

  const producto = inventario.find(p => p.id === equipoId);

  const diferencia = nuevaCantidad - item.cantidad;

  if (diferencia > 0 && producto.stock < diferencia) {
    return { error: "Stock en base insuficiente", status: 400 };
  }

  if (diferencia > 0 && diferencia * producto.precio > obtenerCarga().creditos) {
    return { error: "Créditos insuficientes para esta cantidad", status: 400 };
  }

  item.cantidad = nuevaCantidad;
  producto.stock -= diferencia;

  return { carga: obtenerCarga() };
}

export function eliminarSuministro(id) {
  const equipoId = Number(id);

  if (!Number.isInteger(equipoId) || equipoId <= 0) {
    return { error: "ID inválido", status: 400 };
  }

  const posicion = itemsCargados.findIndex(p => p.id === equipoId);

  if (posicion === -1) {
    return { error: "Suministro no encontrado en la nave", status: 404 };
  }

  const item = itemsCargados[posicion];

  const producto = inventario.find(p => p.id === equipoId);

  producto.stock += item.cantidad;

  itemsCargados.splice(posicion, 1);

  return { carga: obtenerCarga() };
}

const DURACION_MISION = 5 * 60 * 1000;

let inicioMision = Date.now();

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

export function reiniciarMision() {
  itemsCargados.forEach(item => {
    const producto = inventario.find(p => p.id === item.id);

    if (producto) {
      producto.stock += item.cantidad;
    }
  });

  itemsCargados.length = 0;

  cargaConfirmada = false;

  inicioMision = Date.now();

  return {
    mensaje: "Nueva misión iniciada",
    ...obtenerEstadoMision(),
    ...obtenerCarga()
  };
}

export function confirmarCarga() {
  if (itemsCargados.length === 0) {
    return { error: "La nave no tiene suministros", status: 400 };
  }

  if (cargaConfirmada) {
    return { error: "La carga ya fue confirmada", status: 400 };
  }

  cargaConfirmada = true;

  return {
    mensaje: "Equipamiento confirmado correctamente",
    carga: obtenerCarga()
  };
}