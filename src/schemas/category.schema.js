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
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))        
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "El nombre de categoría es obligatorio.",
                Minimo: "El nombre de categoría debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre de categoría debe de tener un máximo de 50 carácteres.",
                Valido: "El nombre de categoría no debe de contener carácteres especiales."
            });
        }),
    Descripcion_Categoria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))        
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La descripción de categoría debe de tener un mínimo de 10 carácteres.",
                Maximo: "La descripción de categoría debe de tener un máximo de 200 carácteres.",
                Valido: "La descripción de categoría no debe de contener carácteres especiales."
            });
        })
});

/**
 * Esquema de validación de datos de actualización de Categoría
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateCategorySchema = Joi.object({
    Nombre_Categoria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))        
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El nombre de categoría debe de tener un mínimo de 3 carácteres.",
                Maximo: "El nombre de categoría debe de tener un máximo de 50 carácteres.",
                Valido: "El nombre de categoría no debe de contener carácteres especiales."
            });
        }),
    Descripcion_Categoria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))        
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La descripción de categoría debe de tener un mínimo de 10 carácteres.",
                Maximo: "La descripción de categoría debe de tener un máximo de 200 carácteres.",
                Valido: "La descripción de categoría no debe de contener carácteres especiales."
            });
        })
});

//Exportación del esquema de validación
module.exports = {
    categorySchema,
    updateCategorySchema
};