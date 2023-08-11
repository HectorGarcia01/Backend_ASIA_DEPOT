const Joi = require('joi');
const errorPersonalizado = require('../utils/custom_error');

/**
 * Esquema de validación de credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const esquemaValidacionLogin = Joi.object({
    correo: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return errorPersonalizado("Correo inválido.", error);
        }),
    password: Joi.string()
        .required()
        .trim()
});

//Exportación del esquema de validación para el correo del login
module.exports = esquemaValidacionCorreo;