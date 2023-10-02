const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Empleado
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const employeeValidateSchema = Joi.object({
    Nombre_Empleado: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
        .min(3)
        .max(30)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El nombre es obligatorio.",
                Minimo: "El nombre debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre no debe de contener carácteres especiales."
            });
        }),
    Apellido_Empleado: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
        .min(3)
        .max(30)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El apellido es obligatorio.",
                Minimo: "El apellido debe de tener un mínimo de 3 carácteres.",
                Maximo: "El apellido debe de tener un máximo de 30 carácteres.",
                Valido: "El apellido no debe de contener carácteres especiales."
            });
        }),
    Telefono_Empleado: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}$'))
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El teléfono es obligatorio.",
                Longitud: "El teléfono debe de poseer 8 dígitos."
            });
        }),
    NIT_Empleado: Joi.number()
        .integer()
        .error((error) => {
            return customError("El NIT debe ser numérico.");
        }),
    Correo_Empleado: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .max(30)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El correo es obligatorio.",
                Maximo: "La correo debe de tener un máximo de 30 carácteres.",
                Valido: "El correo debe de tener la extensión .com"
            });
        }),
    Password_Empleado: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\\s).*$'))
        .min(8)
        .max(25)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "La contraseña es obligatoria.",
                Minimo: "La contraseña debe de tener un mínimo de 8 carácteres.",
                Valido: "La contraseña debe de contener al menos una letra mayúscula, una letra minúscula, un número y no puede contener espacios."
            });
        }),
    Repetir_Password_Empleado: Joi.string()
        .valid(Joi.ref('Password_Empleado'))
        .required()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "Es obligatorio que repita la contraseña.",
                Valido: "Las contraseñas deben de coincidir."
            });
        })
});

/**
 * Esquema de validación de datos de actualización de Empleado
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateEmployeeValidateSchema = Joi.object({
    Nombre_Empleado: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
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
    Apellido_Empleado: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
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
    Telefono_Empleado: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}$'))
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Longitud: "El teléfono debe de poseer 8 dígitos."
            });
        }),
    NIT_Empleado: Joi.number()
        .integer()
        .error((error) => {
            return customError("El NIT debe ser numérico.");
        })
});

//Exportación del esquema de validación para empleado
module.exports = {
    employeeValidateSchema,
    updateEmployeeValidateSchema
};