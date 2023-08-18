/**
 * Middleware de validación de rol
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const validarRol = (rol) => (req, res, next) => {
    try {
        if (req.rol !== rol) {
            throw new Error("No tienes los permisos necesarios para realizar esta acción.");
        }

        next();
    } catch (error) {
        res.status(403).send({ error: error.message });
    }
};

module.exports = validarRol;