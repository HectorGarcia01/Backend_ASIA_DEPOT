const Sequelize = require('sequelize');
const FavoriteProductModel = require('../models/favorite_product');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const { findProduct } = require('../utils/find_product');
const findState = require('../utils/find_state');

/**
 * Función para agregar un producto a favoritos
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Producto_Favorito (favorite_product.js),
 *              Función para buscar producto (find_product.js)
 */

const addFavoriteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        
        await findProduct(id);
        await FavoriteProductModel.create({
            ID_Cliente_FK: user.id,
            ID_Producto_FK: id
        });

        res.status(201).send({ msg: "Se ha agregado el producto a favoritos." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El producto ya existe en favoritos!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver los productos favoritos del cliente
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto_Favorito (favorite_product.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const readFavoriteProduct = async (req, res) => {
    try {
        const { user } = req;
        const { page, pageSize, name } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 6;
        const where = {};

        if (name) {
            where.Nombre_Producto = name;
        }

        where.ID_Cliente_FK = user.id;

        const count = await FavoriteProductModel.count({ where });
        const favoriteProduct = await FavoriteProductModel.findAll({
            where,
            attributes: ['id'],
            include: [{
                model: ProductModel,
                as: 'producto',
                attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto', 'Cantidad_Stock', 'Precio_Venta'],
                include: [{
                    model: StateModel,
                    as: 'estado',
                    attributes: ['id', 'Tipo_Estado']
                }]
            }],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (favoriteProduct.length === 0) {
            return res.status(404).send({ error: "No tienes ningún productos en favoritos." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);

        res.status(200).send({ favoriteProduct, currentPage: pageValue, totalPages });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar un producto de favoritos
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto_Favorito (favorite_product.js)
 */

const deleteFavoriteProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const removedFavoriteProduct = await FavoriteProductModel.destroy({
            where: {
                id,
                ID_Cliente_FK: user.id
            }
        });

        if (removedFavoriteProduct === 0) {
            return res.status(404).send({ error: "Error al eliminar el producto de favoritos." });
        }

        res.status(200).send({ msg: "Producto eliminado de favoritos." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    addFavoriteProduct,
    readFavoriteProduct,
    deleteFavoriteProductId
};