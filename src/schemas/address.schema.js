const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Departamento
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const departmentSchema = Joi.object({
    Nombre_Departamento: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El nombre de departamento es obligatorio.",
                Minimo: "El nombre de departamento debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre de departamento debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre de departamento no debe de contener carácteres especiales."
            });
        })
});

/**
 * Esquema de validación de datos de Municipio
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const municipalitySchema = Joi.object({
    Nombre_Municipio: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El nombre de municipio es obligatorio.",
                Minimo: "El nombre de municipio debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre de municipio debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre de municipio no debe de contener carácteres especiales."
            });
        }),
    ID_Departamento_FK: Joi.number()
        .integer()
        .min(1)
        .required()
        .error((error) => {
            return customError("El ID de departamento es obligatorio y no debe de ser negativo.");
        })
});

/**
 * Esquema de validación de datos de actualización de Departamento
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateDepartmentSchema = Joi.object({
    Nombre_Departamento: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre de departamento debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre de departamento debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre de departamento no debe de contener carácteres especiales."
            });
        })
});

/**
 * Esquema de validación de datos de actualización de Municipio
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateMunicipalitySchema = Joi.object({
    Nombre_Municipio: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre de municipio debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre de municipio debe de tener un máximo de 30 carácteres.",
                Valido: "El nombre de municipio no debe de contener carácteres especiales."
            });
        }),
    ID_Departamento_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de departamento no debe de ser negativo.");
        })
});

//Exportación del esquema de validación
module.exports = {
    departmentSchema,
    municipalitySchema,
    updateDepartmentSchema,
    updateMunicipalitySchema
};