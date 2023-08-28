const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de valoración de producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productReviewValidateSchema = Joi.object({
    Comentario_Producto: Joi.string()
        .trim(),
    Puntuacion_Producto: Joi.number()
        .integer()
        .error((error) => {
            return customError("La puntuación es obligatoria y numérica.", error);
        }),
    ID_Producto_FK: Joi.number()
        .integer()
        .required()
        .error((error) => {
            return customError("El ID del producto es obligatorio y numérico.", error);
        }),
});

//Exportación del esquema de validación para la valoración de producto
module.exports = productReviewValidateSchema;