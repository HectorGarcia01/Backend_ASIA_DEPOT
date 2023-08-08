const Joi = require('joi');
const errorPersonalizado = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Cliente
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const esquemaValidacionCliente = Joi.object({
    Nombre_Cliente: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El nombre es obligatorio.", error)
        }),
    Apellido_Cliente: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El apellido es obligatorio.", error)
        }),
    Telefono_Cliente: Joi.string()
        .pattern(new RegExp('^[3|4|5]{8}'))
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El teléfono es obligatorio y debe de ser válido.", error)
        }),
    NIT_Cliente: Joi.number()
        .integer()
        .error((error) => {
            return errorPersonalizado("El NIT es obligatorio y debe ser numérico.", error)
        }),
    Correo_Cliente: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El correo electrónico es obligatorio, debe de tener la extensión 'com' y debe ser válido.", error)
        }),
    Password_Cliente: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\\s).*$'))
        .min(8)
        .max(25)
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("La contraseña debe tener al menos 8 carácteres, al menos una letra mayúscula, una letra minúscula, un número y no puede contener espacios.", error)
        }),
    Repetir_Password_Cliente: Joi.string()
        .valid(Joi.ref('Password_Cliente'))
        .required()
        .error((error) => {
            return errorPersonalizado("Las contraseñas no coinciden.", error)
        }),
    Departamento: Joi.string()
        .trim(),
    Municipio: Joi.string()
        .trim(),
    Calle: Joi.string()
        .trim(),
    Direccion_Referencia: Joi.string()
        .trim()
});

//Exportación del esquema de validación para cliente
module.exports = esquemaValidacionCliente;