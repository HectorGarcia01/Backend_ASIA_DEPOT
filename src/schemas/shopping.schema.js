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

/**
 * Esquema de validación de datos para procesar compra
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const processSaleSchema = Joi.object({
    ID_Metodo_Pago_FK: Joi.number()
        .integer()
        .required()
        .min(1)
        .error((error) => {
            return customError("El ID del método de pago es obligatorio, debe de ser numérico y no debe de ser negativo.");
        }),
    ID_Tipo_Envio_FK: Joi.number()
        .integer()
        .required()
        .min(1)
        .error((error) => {
            return customError("El ID del tipo de envío es obligatorio, debe de ser numérico y no debe de ser negativo.");
        })
});

//Exportación del esquema de validación
module.exports = {
    shoppingSchema,
    processSaleSchema
};