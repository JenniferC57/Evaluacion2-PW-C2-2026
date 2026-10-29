import { Router } from "express";
import {
    obtenerInventario,
    obtenerCarga,
    agregarSuministro,
    actualizarUnidades,
    eliminarSuministro,
    obtenerEstadoMision,
    reiniciarMision,
    confirmarCarga
} from "../services/astrologistics.service.js";

const router = Router();

function verificarTiempoMision(req, res, next) {
    const estado = obtenerEstadoMision();

    if (!estado.activa) {
        return res.status(403).json({
            mensaje: "Tiempo agotado. Debes iniciar una nueva misión."
        });
    }

    next();
}

function verificarCargaNoConfirmada(req, res, next) {
    const carga = obtenerCarga();

    if (carga.confirmada) {
        return res.status(403).json({
            mensaje: "La carga ya fue confirmada. Inicia una nueva misión."
        });
    }

    next();
}


router.get("/inventario", (req, res) => {
    const inventario = obtenerInventario();
    res.json(inventario);
});

router.get("/carga", (req, res) => {
    const carga = obtenerCarga();
    res.json(carga);
});

router.post("/carga/agregar", verificarTiempoMision, verificarCargaNoConfirmada, (req, res) => {

    const { equipoId, cantidad } = req.body;
    const resultado = agregarSuministro(equipoId, cantidad);
    if (resultado.error) {
        return res.status(resultado.status).json({
            mensaje: resultado.error
        });
    }
    res.status(200).json(resultado.carga);
});

router.put("/carga/actualizar-unidades/:id", verificarTiempoMision, verificarCargaNoConfirmada, (req, res) => {

    const { id } = req.params;
    const { cantidad } = req.body;

    const resultado = actualizarUnidades(id, cantidad);

    if (resultado.error) {
        return res.status(resultado.status).json({
            mensaje: resultado.error
        });
    }

    res.status(200).json(resultado.carga);
});

router.delete("/carga/eliminar/:id", verificarTiempoMision, verificarCargaNoConfirmada, (req, res) => {

    const { id } = req.params;

    const resultado = eliminarSuministro(id);

    if (resultado.error) {
        return res.status(resultado.status).json({
            mensaje: resultado.error
        });
    }

    res.status(200).json(resultado.carga);
});

router.get("/mision", (req, res) => {
    const estado = obtenerEstadoMision();
    res.json(estado);
});

router.post("/mision/reiniciar", (req, res) => {
    const resultado = reiniciarMision();
    res.json(resultado);
});

router.post("/carga/confirmar", verificarTiempoMision, (req, res) => {

    const resultado = confirmarCarga();

    if (resultado.error) {
        return res.status(resultado.status).json({
            mensaje: resultado.error
        });
    }

    res.status(200).json(resultado);
});

export default router;
