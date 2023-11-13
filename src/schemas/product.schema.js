const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productSchema = Joi.object({
    Nombre_Producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))        
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("Algo salío mal...", {
                Obligatorio: "El nombre del producto es obligatorio.",
                Minimo: "El nombre del producto debe de tener un mínimo de 3 carácteres",
                Maximo: "El nombre del producto debe de tener un máximo de 50 carácteres",
                Valido: "El nombre del producto no debe de contener carácteres especiales"
            });
        }),
    Precio_Venta: Joi.number()
        .min(1)
        .required()
        .error((error) => {
            return customError("El precio de venta del producto es obligatorio y no debe de ser negativo.");
        }),
    Precio_Compra: Joi.number()
        .min(1)
        .error((error) => {
            return customError("El precio de compra del producto no debe de ser negativo.");
        }),
    Descripcion_Producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La descripción de producto debe de tener un mínimo de 10 carácteres.",
                Maximo: "La descripción de producto debe de tener un máximo de 200 carácteres.",
                Valido: "La descripción de producto no debe de contener carácteres especiales."
            });
        }),
    Cantidad_Stock: Joi.number()
        .integer()
        .min(1)
        .required()
        .error((error) => {
            return customError("La cantidad del producto es obligatoria y no debe de ser negativo.");
        }),
    Codigo_Barras: Joi.string()
        .min(5)
        .max(200)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El código de barras debe de tener un mínimo de 5 carácteres.",
                Maximo: "El código de barras debe de tener un máximo de 200 carácteres.",
                Valido: "El código de barras no debe de contener carácteres especiales."
            });
        }),
    Producto_Destacado: Joi.bool()
        .error((error) => {
            return customError("Algo salió mal...", {
                Valido: "Debe de ser un valor booleano."
            });
        }),
    ID_Categoria_FK: Joi.number()
        .integer()
        .min(1)
        .required()
        .error((error) => {
            return customError("El ID de categoría es obligatorio y no debe de ser negativo.");
        }),
    ID_Marca_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de marca de producto no debe de ser negativo.");
        })
});

/**
 * Esquema de validación de datos de Producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateProductSchema = Joi.object({
    Nombre_Producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("Algo salío mal...", {
                Minimo: "El nombre del producto debe de tener un mínimo de 3 carácteres",
                Maximo: "El nombre del producto debe de tener un máximo de 50 carácteres",
                Valido: "El nombre del producto no debe de contener carácteres especiales"
            });
        }),
    Precio_Venta: Joi.number()
        .min(1)
        .error((error) => {
            return customError("El precio de venta del producto no debe de ser negativo.");
        }),
    Precio_Compra: Joi.number()
        .min(1)
        .error((error) => {
            return customError("El precio de compra del producto no debe de ser negativo.");
        }),
    Descripcion_Producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "La descripción de producto debe de tener un mínimo de 10 carácteres.",
                Maximo: "La descripción de producto debe de tener un máximo de 200 carácteres.",
                Valido: "La descripción de producto no debe de contener carácteres especiales."
            });
        }),
    Cantidad_Stock: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("La cantidad del producto no debe de ser negativa.");
        }),
    Codigo_Barras: Joi.string()
        .min(5)
        .max(200)
        .trim()
        .error((error) => {
            return customError("Algo salió mal...", {
                Minimo: "El código de barras debe de tener un mínimo de 5 carácteres.",
                Maximo: "El código de barras debe de tener un máximo de 200 carácteres.",
                Valido: "El código de barras no debe de contener carácteres especiales."
            });
        }),
    Producto_Destacado: Joi.bool()
        .error((error) => {
            return customError("Algo salió mal...", {
                Valido: "Debe de ser un valor booleano."
            });
        }),
    ID_Categoria_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de categoría no debe de ser negativo.");
        }),
    ID_Marca_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de marca de producto no debe de ser negativo.");
        })
});

//Exportación del esquema de validación
module.exports = {
    productSchema,
    updateProductSchema
};