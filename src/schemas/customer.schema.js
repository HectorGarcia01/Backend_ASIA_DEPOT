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
    Apellido_Cliente: Joi.string()
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
    Telefono_Cliente: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}$'))
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El teléfono es obligatorio.",
                Longitud: "El teléfono debe de poseer 8 dígitos."
            });
        }),
    NIT_Cliente: Joi.number()
        .integer()
        .error((error) => {
            return customError("El NIT debe ser numérico.");
        }),
    Direccion_General: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.\\-]+$'))
        .min(10)
        .max(100)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La dirección general debe de tener un mínimo de 10 carácteres.",
                Maximo: "La dirección general debe de tener un máximo de 100 carácteres.",
                Valido: "La dirección general no debe de contener carácteres especiales."
            });
        }),
    Correo_Cliente: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .max(100)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El correo es obligatorio.",
                Maximo: "La correo debe de tener un máximo de 30 carácteres.",
                Valido: "El correo debe de tener la extensión .com"
            });
        }),
    Password_Cliente: Joi.string()
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
    Repetir_Password_Cliente: Joi.string()
        .valid(Joi.ref('Password_Cliente'))
        .required()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "Es obligatorio que repita la contraseña.",
                Valido: "Las contraseñas deben de coincidir."
            });
        }),
    ID_Departamento_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de departamento es numérico y no debe de ser negativo.");
        }),
    ID_Municipio_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de municipio es numérico y no debe de ser negativo.");
        })
});

/**
 * Esquema de validación de datos de actualización de Cliente
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateCustomerValidateSchema = Joi.object({
    Nombre_Cliente: Joi.string()
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
    Apellido_Cliente: Joi.string()
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
    Telefono_Cliente: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}$'))
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Longitud: "El teléfono debe de poseer 8 dígitos."
            });
        }),
    NIT_Cliente: Joi.number()
        .integer()
        .error((error) => {
            return customError("El NIT debe ser numérico.");
        }),
    Direccion_General: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9\\s.\\-]+$'))
        .min(10)
        .max(100)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La dirección general debe de tener un mínimo de 10 carácteres.",
                Maximo: "La dirección general debe de tener un máximo de 100 carácteres.",
                Valido: "La dirección general no debe de contener carácteres especiales."
            });
        }),
    ID_Departamento_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de departamento es numérico y no debe de ser negativo.");
        }),
    ID_Municipio_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de municipio es numérico y no debe de ser negativo.");
        })
});

//Exportación del esquema de validación para cliente
module.exports = {
    customerValidateSchema,
    updateCustomerValidateSchema
};