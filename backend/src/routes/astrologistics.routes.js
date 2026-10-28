
import { Router } from "express";
import {
    obtenerInventario, obtenerCarga, agregarSuministro,
    actualizarUnidades, eliminarSuministro, obtenerEstadoMision, reiniciarMision
} from "../services/astrologistics.service.js";

const router = Router();


// Verificamos que todavía quede tiempo en la misión.
function verificarTiempoMision(req, res, next) {
    const estado = obtenerEstadoMision();

    // Si terminó el tiempo, no permitimos continuar.
    if (!estado.activa) {
        return res.status(403).json({
            mensaje: "Tiempo agotado. Debes iniciar una nueva misión."
        });
    }

    // Si todavía hay tiempo, continuamos con la petición.
    next();
}


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
router.post("/carga/agregar", verificarTiempoMision, (req, res) => {

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

router.put("/carga/actualizar-unidades/:id", verificarTiempoMision, (req, res) => {

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

// Ruta para eliminar un suministro de la nave.

router.delete("/carga/eliminar/:id", verificarTiempoMision, (req, res) => {

    // Obtenemos el ID del producto desde la URL.
    const { id } = req.params;

    // Llamamos al servicio para eliminar el suministro.
    const resultado = eliminarSuministro(id);

    // Si ocurre un error, devolvemos el mensaje.
    if (resultado.error) {
        return res.status(resultado.status).json({
            mensaje: resultado.error
        });
    }

    // Devolvemos la carga actualizada.
    res.status(200).json(resultado.carga);
});

// Ruta para consultar el tiempo restante de la misión.
router.get("/mision", (req, res) => {
    const estado = obtenerEstadoMision();
    res.json(estado);
});

// Ruta para iniciar una nueva misión.
router.post("/mision/reiniciar", (req, res) => {
    const resultado = reiniciarMision();
    res.json(resultado);
});

export default router;


