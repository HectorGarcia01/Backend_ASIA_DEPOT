const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de producto favorito
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const favoriteProductSchema = Joi.object({
    ID_Cliente_FK: Joi.number()
        .integer()
        .min(1)
        .required()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El ID del cliente es obligatorio.",
                Valido: "No debe de ser negativo."
            });
        }),
    ID_Producto_FK: Joi.number()
        .integer()
        .min(1)
        .required()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El ID del producto es obligatorio.",
                Valido: "No debe de ser negativo."
            });
        }),
});

//Exportación del esquema de validación
module.exports = {
    favoriteProductSchema,
};