const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Proveedor
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const supplierValidateSchema = Joi.object({
    Nombre_Proveedor: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre no debe de contener carácteres especiales."
            });
        }),
    Apellido_Proveedor: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El apellido debe de tener un mínimo de 3 carácteres.",
                Maximo: "El apellido debe de tener un máximo de 30 carácteres.",
                Valido: "El apellido no debe de contener carácteres especiales."
            });
        }),
    Nombre_Empresa: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(5)
        .max(50)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre de la empresa debe de tener un mínimo de 5 carácteres.",
                Maximo: "El nombre de la empresa debe de tener un máximo de 50 carácteres.",
                Valido: "El nombre de la empresa no debe de contener carácteres especiales."
            });
        }),
    Telefono_Proveedor: Joi.string()
        .pattern(new RegExp('^[3457][0-9]{7}$'))
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El teléfono es obligatorio.",
                Longitud: "El teléfono debe de poseer 8 dígitos."
            });
        }),
    Correo_Proveedor: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .max(40)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El correo es obligatorio.",
                Maximo: "El correo debe de tener un máximo de 40 carácteres.",
                Valido: "El correo debe de tener la extensión .com"
            });
        })
});

/**
 * Esquema de validación de datos de actualización de Proveedor
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateSupplierValidateSchema = Joi.object({
    Nombre_Proveedor: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre no debe de contener carácteres especiales."
            });
        }),
    Apellido_Proveedor: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El apellido debe de tener un mínimo de 3 carácteres.",
                Maximo: "El apellido debe de tener un máximo de 30 carácteres.",
                Valido: "El apellido no debe de contener carácteres especiales."
            });
        }),
    Nombre_Empresa: Joi.string()
        .pattern(new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$'))
        .min(5)
        .max(50)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre de la empresa debe de tener un mínimo de 5 carácteres.",
                Maximo: "El nombre de la empresa debe de tener un máximo de 50 carácteres.",
                Valido: "El nombre de la empresa no debe de contener carácteres especiales."
            });
        }),
    Telefono_Proveedor: Joi.string()
        .pattern(new RegExp('^[3457][0-9]{7}$'))
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Longitud: "El teléfono debe de poseer 8 dígitos."
            });
        }),
    Correo_Proveedor: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .max(40)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Maximo: "El correo debe de tener un máximo de 40 carácteres.",
                Valido: "El correo debe de tener la extensión .com"
            });
        })
});

//Exportación del esquema de validación para proveedor
module.exports = {
    supplierValidateSchema,
    updateSupplierValidateSchema
};