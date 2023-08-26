const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Categoría
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const categorySchema = Joi.object({
    Nombre_Categoria: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre de categoría es obligatorio.", error);
        })
});

//Exportación del esquema de validación
module.exports = {
    categorySchema
};