const Sequelize = require('sequelize');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');
const BrandProductModel = require('../models/brand_product');

/**
 * Función para construir el objeto where de la consulta
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js), 
 *              Modelo Categoria (category.js),
 *              Modelo Marca_Producto (brand_product.js),
 */

const buildWhereClause = async (query) => {
    const where = {};

    if (query.nombre) {
        where[Sequelize.Op.or] = [
            {
                Nombre_Producto: {
                    [Sequelize.Op.like]: `%${query.nombre}%`
                }
            },
            {
                Precio_Compra: query.nombre
            },
            {
                Precio_Venta: query.nombre
            },
            {
                Descripcion_Producto: {
                    [Sequelize.Op.like]: `%${query.nombre}%`
                }
            },
            {
                Codigo_Barras: {
                    [Sequelize.Op.like]: `%${query.nombre}%`
                }
            }
        ];
    }

    if (!query.nombre) {
        delete where[Sequelize.Op.or];
    }

    return where;
}

module.exports = buildWhereClause;