
import { Router } from "express";
import { obtenerInventario , obtenerCarga , agregarSuministro , actualizarUnidades} from "../services/astrologistics.service.js";

const router = Router();

// Ruta que devuelve todos los productos del inventario.
router.get("/inventario", (req, res) => {
  const inventario = obtenerInventario();
  res.json(inventario);
});

// Ruta para consultar la carga y los créditos disponibles.
router.get("/carga", (req, res) => {
  const carga = obtenerCarga();
  res.json(carga);
});

// Ruta para agregar suministros a la nave.
router.post("/carga/agregar", (req, res) => {

  // Recibimos el ID y la cantidad enviados por el cliente.
  const { equipoId, cantidad } = req.body;

  // Llamamos a la función que agrega el producto.
  const resultado = agregarSuministro(equipoId, cantidad);

  // Si ocurre un error, enviamos el mensaje correspondiente.
  if (resultado.error) {
    return res.status(resultado.status).json({
      mensaje: resultado.error
    });
  }

  // Si todo salió bien, devolvemos la carga actualizada.
  res.status(200).json(resultado.carga);
});

// Ruta para actualizar las unidades de un producto en la nave.
router.put("/carga/actualizar-unidades/:id", (req, res) => {

  // Obtenemos el ID de la URL y la cantidad enviada.
  const { id } = req.params;
  const { cantidad } = req.body;

  // Llamamos al servicio para actualizar la cantidad.
  const resultado = actualizarUnidades(id, cantidad);

  // Si ocurre un error, devolvemos su mensaje.
  if (resultado.error) {
    return res.status(resultado.status).json({
      mensaje: resultado.error
    });
  }

  // Si todo salió bien, devolvemos la carga actualizada.
  res.status(200).json(resultado.carga);
});

export default router;


