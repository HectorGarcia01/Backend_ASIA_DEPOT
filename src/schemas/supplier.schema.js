const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Cliente
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const supplierValidateSchema = Joi.object({
    Nombre_Proveedor: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre es obligatorio.", error);
        }),
    Apellido_Proveedor: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El apellido es obligatorio.", error);
        }),
    Telefono_Proveedor: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}'))
        .required()
        .trim()
        .error((error) => {
            return customError("El teléfono es obligatorio y debe de ser válido.", error);
        }),
    Correo_Proveedor: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("El correo electrónico es obligatorio, debe de tener la extensión 'com' y debe ser válido.", error);
        })
});

//Exportación del esquema de validación para proveedor
module.exports = supplierValidateSchema;