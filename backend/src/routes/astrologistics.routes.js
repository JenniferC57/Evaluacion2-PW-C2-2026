
import { Router } from "express";
import { obtenerInventario , obtenerCarga } from "../services/astrologistics.service.js";

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

export default router;
