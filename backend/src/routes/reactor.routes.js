import { Router } from "express";
import { ajustar, reiniciar } from "../services/reactor.service.js";

const router = Router();

router.post("/adjust", (req, res) => {
  const temperatura = Number(req.body?.temperatura);

  if (!Number.isInteger(temperatura) || temperatura < 1 || temperatura > 100) {
    return res
      .status(400)
      .json({ mensaje: "La temperatura debe ser un numero entero entre 1 y 100" });
  }

  const { resultado, estabilizado } = ajustar(temperatura);
  const mensajes = {
    "mas alta": "Temperatura insuficiente: la temperatura ideal es mas alta",
    "mas baja": "Temperatura excesiva: la temperatura ideal es mas baja",
    estabilizado: "Reactor estabilizado",
  };

  res.json({ resultado, estabilizado, mensaje: mensajes[resultado] });
});

router.post("/reboot", (_req, res) => {
  reiniciar();
  res.json({ mensaje: "Sistema reiniciado. Nueva temperatura de estabilizacion generada." });
});

export default router;
