const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos del carrito de compras de usuario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const shoppingSchema = Joi.object({
    Cantidad_Producto: Joi.number()
        .integer()
        .required()
        .min(1)
        .error((error) => {
            return customError("La cantidad de producto es obligatoria, debe de ser númerico y no debe de ser negativo.");
        }),
    ID_Producto_FK: Joi.number()
        .integer()
        .required()
        .min(1)
        .error((error) => {
            return customError("El ID de producto es obligatorio, debe de ser numérico y no debe de ser negativo.");
        })
});

//Exportación del esquema de validación
module.exports = {
    shoppingSchema
};