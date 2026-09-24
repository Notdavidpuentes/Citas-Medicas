//Se importa la libreria express
const express = require("express");

//Se importa la conexion a la DB
const conexion = require("../config/db");

// se accede a la info de models
const citas = require("../models/cita");

const router = express.Router();

// METODO GET EN LA DB
router.get("/", (req, res) => {

    conexion.query("SELECT * FROM cita", (error, resultados) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al obtener las citas",
                error: error.message
            });
        }

        res.json(resultados);

    });

});

//Metodo POST
router.post("/", (req, res) => {

    const {
        fecha,
        hora,
        especialidad,
        nombre_paciente
    } = req.body;

    const nombre_medico = "Dr. García";
    const numero_consultorio = 101;
    const estado_cita = 0; // Pendiente

    // Validar que no exista ya una cita con la misma fecha, hora y medico
    const sqlValidar = `
        SELECT * FROM cita
        WHERE fecha = ? AND hora = ? AND nombre_medico = ?
    `;

    conexion.query(sqlValidar, [fecha, hora, nombre_medico], (errorValidar, citasExistentes) => {

        if (errorValidar) {
            return res.status(500).json({
                mensaje: "Error al validar disponibilidad",
                error: errorValidar.message
            });
        }

        if (citasExistentes.length > 0) {
            return res.status(409).json({
                mensaje: "Ya existe una cita registrada en ese horario con este médico"
            });
        }

    // Si no hay conflicto, se procede a insertar
    const sql = `
        INSERT INTO cita
        (fecha,hora,nombre_medico,especialidad,numero_consultorio,estado_cita,nombre_paciente)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [
            fecha,
            hora,
            nombre_medico,
            especialidad,
            numero_consultorio,
            estado_cita,
            nombre_paciente
        ],
        (error, resultado) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al crear la cita",
                    error: error.message
                });
            }

            res.status(201).json({
                mensaje: "Cita creada correctamente",
                id: resultado.insertId
            });

        }
    );

});

//Metodo PUT
router.put("/:id", (req, res) => {

    const { id } = req.params;

    const {
        fecha,
        hora,
        nombre_medico,
        especialidad,
        numero_consultorio,
        estado_cita,
        nombre_paciente
    } = req.body;

    const sql = `
        UPDATE cita
        SET
            fecha = ?,
            hora = ?,
            nombre_medico = ?,
            especialidad = ?,
            numero_consultorio = ?,
            estado_cita = ?,
            nombre_paciente = ?
        WHERE id = ?
    `;

    conexion.query(
        sql,
        [
            fecha,
            hora,
            nombre_medico,
            especialidad,
            numero_consultorio,
            estado_cita,
            nombre_paciente,
            id
        ],
        (error, resultado) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al actualizar la cita",
                    error: error.message
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se encontró la cita"
                });
            }

            res.json({
                mensaje: "Cita actualizada correctamente"
            });

        }
    );

});

//Metodo DELETE
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM cita WHERE id = ?";

    conexion.query(sql, [id], (error, resultado) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al eliminar la cita",
                error: error.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "La cita no existe"
            });
        }

        res.json({
            mensaje: "Cita eliminada correctamente"
        });

    });

});


module.exports = router;