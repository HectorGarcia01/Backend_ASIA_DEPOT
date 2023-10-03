const CategoryModel = require('../models/category');
const BrandProductModel = require('../models/brand_product');
const ProductModel = require('../models/product');

/**
 * Función para buscar una categoría por su id
 * Fecha creación: 02/10/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js)
 */

const findCategory = async (id) => {
    const category = await CategoryModel.findByPk(id);

    if (!category) {
        const error = new Error("Categoría no encontrada.");
        error.status = 404;
        throw error;
    }

    return category;
};

/**
 * Función para buscar una marca de producto por su id
 * Fecha creación: 02/10/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Marca_Producto (brand_product.js)
 */

const findProductBrand = async (id) => {
    const productBrand = await BrandProductModel.findByPk(id);

    if (!productBrand) {
        const error = new Error("Marca del producto no encontrada.");
        error.status = 404;
        throw error;
    }

    return productBrand;
};

/**
 * Función para buscar un producto por su id
 * Fecha creación: 02/10/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js)
 */

const findProduct = async (id) => {
    const product = await ProductModel.findByPk(id);

    if (!product) {
        const error = new Error("Producto no encontrado.");
        error.status = 404;
        throw error;
    }

    return product;
};

//Exportación de la función para buscar una categoría, marca y producto
module.exports = {
    findCategory,
    findProductBrand,
    findProduct
};
