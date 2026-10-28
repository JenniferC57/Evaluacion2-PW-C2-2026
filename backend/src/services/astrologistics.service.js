
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
