const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Cliente
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const customerValidateSchema = Joi.object({
    Nombre_Cliente: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre es obligatorio.", error);
        }),
    Apellido_Cliente: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El apellido es obligatorio.", error);
        }),
    Telefono_Cliente: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}'))
        .required()
        .trim()
        .error((error) => {
            return customError("El teléfono es obligatorio y debe de ser válido.", error);
        }),
    NIT_Cliente: Joi.number()
        .integer()
        .error((error) => {
            return customError("El NIT debe ser numérico.", error);
        }),
    Direccion_General: Joi.string()
        .trim(),
    Correo_Cliente: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("El correo electrónico es obligatorio, debe de tener la extensión 'com' y debe ser válido.", error);
        }),
    Password_Cliente: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\\s).*$'))
        .min(8)
        .max(25)
        .required()
        .trim()
        .error((error) => {
            return customError("La contraseña es obligatoria y debe tener al menos 8 carácteres, al menos una letra mayúscula, una letra minúscula, un número y no puede contener espacios.", error);
        }),
    Repetir_Password_Cliente: Joi.string()
        .valid(Joi.ref('Password_Cliente'))
        .required()
        .error((error) => {
            return customError("Las contraseñas no coinciden.", error);
        }),
    ID_Municipio_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de dirección es numérico y no debe de ser negativo.", error);
        }),
});

//Exportación del esquema de validación para cliente
module.exports = customerValidateSchema;