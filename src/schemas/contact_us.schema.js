const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación del formulario de contáctanos
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const contactUsScheme = Joi.object({
    Nombre: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El nombre es obligatorio.",
                Minimo: "El nombre debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre debe de tener un máximo de 50 carácteres.",
                Valido: "El nombre no debe de contener carácteres especiales."
            });
        }),
    Correo: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El correo es obligatorio.",
                Valido: "El correo debe de tener la extensión .com"
            });
        }),
    Asunto: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El asunto es obligatorio.",
                Minimo: "El asunto debe de tener un mínimo de 3 carácteres.",
                Maximo: "El asunto debe de tener un máximo de 50 carácteres.",
                Valido: "El asunto no debe de contener carácteres especiales."
            });
        }),
    Mensaje: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(200)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El mensaje es obligatorio.",
                Minimo: "El mensaje debe de tener un mínimo de 10 carácteres.",
                Maximo: "El mensaje debe de tener un máximo de 200 carácteres.",
                Valido: "El mensaje no debe de contener carácteres especiales."
            });
        }),
});

//Exportación del esquema de validación para el formulario de contáctanos
module.exports = contactUsScheme;