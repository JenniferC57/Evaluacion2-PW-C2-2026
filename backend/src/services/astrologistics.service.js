
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