import { Router } from "express";
import { ajustar, reiniciar } from "../services/reactor.service.js";

const router = Router();

router.post("/adjust", (req, res) => {
  const valor = req.body?.temperatura;

  if (typeof valor !== "number" || !Number.isInteger(valor) || valor < 1 || valor > 100) {
    return res.status(400).json({
      resultado: "temperatura invalida",
      estabilizado: false,
      mensaje: "La temperatura debe ser un numero entero entre 1 y 100"
    });
  }

  const { resultado, estabilizado } = ajustar(valor);
  const mensajes = {
    "mas alta": "Temperatura insuficiente: la temperatura ideal es mas alta",
    "mas baja": "Temperatura excesiva: la temperatura ideal es mas baja",
    "estabilizado": "Reactor estabilizado!"
  };

  return res.status(200).json({ resultado, estabilizado, mensaje: mensajes[resultado] });
});

router.post("/reboot", (_req, res) => {
  reiniciar();
  return res.json({ mensaje: "Sistema reiniciado. Nueva temperatura de estabilizacion generada." });
});

export default router;