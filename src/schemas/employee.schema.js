const Joi = require('joi');
const errorPersonalizado = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Empleado
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const esquemaValidacionEmpleado = Joi.object({
    Nombre_Empleado: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El nombre es obligatorio.", error)
        }),
    Apellido_Empleado: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El apellido es obligatorio.", error)
        }),
    Telefono_Empleado: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}'))
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El teléfono es obligatorio y debe de ser válido.", error)
        }),
    NIT_Empleado: Joi.number()
        .integer()
        .error((error) => {
            return errorPersonalizado("El NIT es obligatorio y debe ser numérico.", error)
        }),
    Correo_Empleado: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("El correo electrónico es obligatorio, debe de tener la extensión 'com' y debe ser válido.", error)
        }),
    Password_Empleado: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\\s).*$'))
        .min(8)
        .max(25)
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("La contraseña es obligatoria y debe tener al menos 8 carácteres, al menos una letra mayúscula, una letra minúscula, un número y no puede contener espacios.", error)
        }),
    Repetir_Password_Empleado: Joi.string()
        .valid(Joi.ref('Password_Empleado'))
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

//Exportación del esquema de validación para empleado
module.exports = esquemaValidacionEmpleado;