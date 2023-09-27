const StateModel = require('../models/state');

/**
 * Función para para buscar el tipo de estado
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const findState = async (Tipo_Estado) => {
    const state = await StateModel.findOne({
        where: {
            Tipo_Estado
        }
    });

    if (!state) {
        const error = new Error("Estado no encontrado.");
        error.status = 404;
        throw error;
    }

    return state;
};

//Exportación de la función para buscar el tipo de estado
module.exports = findState;