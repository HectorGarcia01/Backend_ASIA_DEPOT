const StateModel = require('../models/state');
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
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js),
 *              Modelo Categoría (category.js),
 *              Modelo Marca_Producto (brand_product.js)
 */

const findProduct = async (id) => {
    const product = await ProductModel.findByPk(id, {
        include: [{
            model: StateModel,
            as: 'estado',
            attributes: ['id', 'Tipo_Estado']
        }, {
            model: CategoryModel,
            as: 'categoria',
            attributes: ['id', 'Nombre_Categoria']
        }, {
            model: BrandProductModel,
            as: 'marca',
            attributes: ['id', 'Nombre_Marca']
        }]
    });

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
