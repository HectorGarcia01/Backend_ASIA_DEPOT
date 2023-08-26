const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productSchema = Joi.object({
    //Para el modelo Producto
    Nombre_Producto: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre del producto es obligatorio.", error);
        }),
    Marca_Producto: Joi.string()
        .trim(),
    Precio_Promedio: Joi.number()
        .required()
        .error((error) => {
            return customError("El precio del producto es obligatorio y numérico.", error);
        }),
    Descripcion_Producto: Joi.string()
        .trim(),
    //Para el modelo Inventario
    Cantidad_Stock: Joi.number()
        .integer()
        .required()
        .error((error) => {
            return customError("La cantidad del producto es obligatoria.", error);
        })
});

//Exportación del esquema de validación
module.exports = {
    productSchema
};