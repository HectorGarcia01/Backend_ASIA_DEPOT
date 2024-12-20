const Sequelize = require('sequelize');
const findState = require('../utils/find_state');
const { findProductBrand } = require('../utils/find_product');
const ProductBrandModel = require('../models/brand_product');
const StateModel = require('../models/state');

/**
 * Función para registrar una nueva marca de producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar estado (find_state.js),
 *              Modelo Marca de Producto (brand_product.js)
 */

const addProductBrand = async (req, res) => {
    try {
        const { Nombre_Marca } = req.body;

        const stateProductBrand = await findState('Activo');

        const newProductBrand = await ProductBrandModel.create({
            Nombre_Marca,
            ID_Estado_FK: stateProductBrand.id
        });

        res.status(201).send({ msg: "Se ha registrado una nueva marca de producto.", newProductBrand })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La marca de producto ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todas las marcas de productos
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Marca de Producto (brand_product.js), 
 *              Modelo Estado (state.js)
 */

const readProductBrands = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 6;

        const where = {
            [Sequelize.Op.or]: [
                {
                    Nombre_Marca: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                }
            ]
        };

        if (!nombre) {
            delete where[Sequelize.Op.or];
        }

        const count = await ProductBrandModel.count({
            where: nombre ? where : {}
        });

        const productBrands = await ProductBrandModel.findAll({
            where: nombre ? where : {},
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }],
            order: [['Nombre_Marca', 'ASC']],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (productBrands.length === 0) {
            return res.status(404).send({ error: "No hay marcas de productos registradas." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);

        res.status(200).send({ productBrands, currentPage: pageValue, totalPages });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

/**
 * Función para ver la marca de producto por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar marca de producto (find_product.js)
 */

const readProductBrandId = async (req, res) => {
    try {
        const { id } = req.params;
        const productBrand = await findProductBrand(id);

        res.status(200).send({ productBrand });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para actualizar marca de producto por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar marca de producto (find_product.js)
 */

const updateProductBrandId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Nombre_Marca'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const productBrand = await findProductBrand(id);
        updates.forEach((update) => productBrand[update] = req.body[update]);

        await productBrand.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para eliminar lógicamente una marca de producto por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar marca de producto (find_product.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteProductBrandId = async (req, res) => {
    try {
        const { id } = req.params;

        const productBrand = await findProductBrand(id);
        const stateProductBrand = await findState('Inactivo');

        productBrand.ID_Estado_FK = stateProductBrand.id;
        await productBrand.save();
        res.status(200).send({ msg: "Marca de producto eliminada con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addProductBrand,
    readProductBrands,
    readProductBrandId,
    updateProductBrandId,
    deleteProductBrandId
};