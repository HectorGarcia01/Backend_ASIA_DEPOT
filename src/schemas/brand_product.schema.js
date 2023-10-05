const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de marca de producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productBrandSchema = Joi.object({
    Nombre_Marca: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))        
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Obligatorio: "La marca del producto es obligatoria.",
                Minimo: "La marca del producto debe de tener un mínimo de 3 carácteres.",
                Maximo: "La marca del producto debe de tener un máximo de 50 carácteres.",
                Valido: "La marca del producto no debe de contener carácteres especiales."
            });
        })
});

/**
 * Esquema de validación de actualización de datos de marca de producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateProductBrandSchema = Joi.object({
    Nombre_Marca: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La marca del producto debe de tener un mínimo de 3 carácteres.",
                Maximo: "La marca del producto debe de tener un máximo de 50 carácteres.",
                Valido: "La marca del producto no debe de contener carácteres especiales."
            });
        })
});

//Exportación del esquema de validación
module.exports = {
    productBrandSchema,
    updateProductBrandSchema
};