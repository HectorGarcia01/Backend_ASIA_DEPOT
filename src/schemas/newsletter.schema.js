const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación del newsletter
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const newsletterScheme = Joi.object({
    Correo_Cliente: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El correo es obligatorio.",
                Valido: "El correo debe de tener la extensión .com"
            });
        })
});

//Exportación del esquema de validación para el newsletter
module.exports = newsletterScheme;