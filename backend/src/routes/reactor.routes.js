import { Router } from "express";
import { ajustar, reiniciar } from "../services/reactor.service.js";

const router = Router();

// POST /adjust  { temperatura: number }
router.post("/adjust", (req, res) => {
  const temperatura = Number(req.body?.temperatura);

  if (!Number.isInteger(temperatura) || temperatura < 1 || temperatura > 100) {
    return res
      .status(400)
      .json({ mensaje: "La temperatura debe ser un número entero entre 1 y 100" });
  }

  const { resultado, estabilizado } = ajustar(temperatura);
  const mensajes = {
    "más alta": "Temperatura insuficiente: la temperatura ideal es más alta",
    "más baja": "Temperatura excesiva: la temperatura ideal es más baja",
    estabilizado: "¡Reactor estabilizado!",
  };

  res.json({ resultado, estabilizado, mensaje: mensajes[resultado] });
});

// POST /reboot  -> genera una nueva temperatura de estabilización
router.post("/reboot", (_req, res) => {
  reiniciar();
  res.json({ mensaje: "Sistema reiniciado. Nueva temperatura de estabilización generada." });
});

export default router;
