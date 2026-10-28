
import { Router } from "express";
import { obtenerInventario } from "../services/astrologistics.service.js";

const router = Router();

// Ruta que devuelve todos los productos del inventario.
router.get("/inventario", (req, res) => {
  const inventario = obtenerInventario();
  res.json(inventario);
});

export default router;
