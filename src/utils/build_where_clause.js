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
        where.Nombre_Producto = {
            [Sequelize.Op.like]: `%${query.nombre}%`
        };
    }

    if (query.precio_compra) {
        where.Precio_Compra = query.precio_compra;
    }

    if (query.precio_venta) {
        where.Precio_Venta = query.precio_venta;
    }

    if (query.descripcion) {
        where.Descripcion_Producto = {
            [Sequelize.Op.like]: `%${query.descripcion}%`
        };
    }

    if (query.codigo_barras) {
        where.Codigo_Barras = {
            [Sequelize.Op.like]: `%${query.codigo_barras}%`
        };
    }

    if (query.estado) {
        const stateProduct = await StateModel.findOne({
            where: {
                Tipo_Estado: query.estado
            }
        });

        if (!stateProduct) {
            throw new Error("Estado no encontrado.");
        }

        where.ID_Estado_FK = stateProduct.id
    }

    if (query.categoria) {
        const category = await CategoryModel.findOne({
            where: {
                id: query.categoria
            }
        });

        if (!category) {
            throw new Error("Categoría no encontrada.");
        }

        where.ID_Categoria_FK = category.id;
    }

    if (query.marca) {
        const brandProduct = await BrandProductModel.findOne({
            where: {
                Nombre_Marca: query.marca
            }
        });

        if (!brandProduct) {
            throw new Error("Marca no encontrada.");
        }

        where.ID_Marca_FK = brandProduct.id;
    }

    return where;
}

module.exports = buildWhereClause;