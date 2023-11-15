const Sequelize = require('sequelize');
const findState = require('../utils/find_state');
const { findCategory } = require('../utils/find_product');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');

/**
 * Función para registrar una nueva categoría
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Categoría (category.js), 
 *              Función para buscar estado (find_state.js)
 */

const addCategory = async (req, res) => {
    try {
        const { Nombre_Categoria, Descripcion_Categoria } = req.body;

        const stateCategory = await findState('Activo');

        const newCategory = await CategoryModel.create({ 
            Nombre_Categoria, 
            Descripcion_Categoria,
            ID_Estado_FK: stateCategory.id
        });

        res.status(201).send({ msg: "Se ha registrado una nueva categoría.", newCategory })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La categoría ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todas las categorías
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js) 
 */

const readCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll({
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }]
        });

        if (categories.length === 0) {
            return res.status(404).send({ error: "No hay categorías registradas." });
        }

        res.status(200).send({ categories });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver categorías por paginación
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js) 
 */

const categoryPagination = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 6;

        const where = {
            [Sequelize.Op.or]: [
                {
                    Nombre_Categoria: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                }
            ]
        };

        if (!nombre) {
            delete where[Sequelize.Op.or];
        }

        const count = await CategoryModel.count({
            where: nombre ? where : {}
        });

        const categories = await CategoryModel.findAll({
            where: nombre ? where : {},
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }],
            order: [['Nombre_Categoria', 'ASC']],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (categories.length === 0) {
            return res.status(404).send({ error: "No hay categorías registradas." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);

        res.status(200).send({ categories, currentPage: pageValue, totalPages });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver la categoría por id
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js)
 */

const readCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByPk(id, {
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }]
        });

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        res.status(200).send({ category });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos de la categoría por id
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar categoría (find_product.js)
 */

const updateCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Nombre_Categoria', 'Descripcion_Categoria'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        
        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const category = await findCategory(id);
        updates.forEach((update) => category[update] = req.body[update]);
        
        await category.save();
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
 * Función para eliminar de forma lógica una categoría por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar categoría (find_product.js)
 *              Función para buscar estado (find_state.js)
 */

const deleteCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await findCategory(id);
        const stateCategory = await findState('Inactivo');

        category.ID_Estado_FK = stateCategory.id;
        await category.save();
        res.status(200).send({ msg: "Categoría eliminada con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para activar una categoría por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar categoría (find_product.js)
 *              Función para buscar estado (find_state.js)
 */

const activateCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await findCategory(id);
        const stateCategory = await findState('Activo');

        category.ID_Estado_FK = stateCategory.id;
        await category.save();
        res.status(200).send({ msg: "Categoría activada con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addCategory,
    readCategories,
    categoryPagination,
    readCategoryId,
    updateCategoryId,
    deleteCategoryId,
    activateCategoryId
};