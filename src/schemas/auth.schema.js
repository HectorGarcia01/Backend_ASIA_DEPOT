const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const loginValidateScheme = Joi.object({
    correo: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("El correo es obligatorio y debe de ser válido.", error);
        }),
    password: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("La contraseña es obligatoria.", error);
        }),
});

//Exportación del esquema de validación para el correo del login
module.exports = loginValidateScheme;