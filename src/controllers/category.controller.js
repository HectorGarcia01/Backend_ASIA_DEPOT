const Sequelize = require('sequelize');
const CategoryModel = require('../models/category');
const StateModel = require('../models/state');
const { keys } = require('../schemas/product_review.schema');
const { object } = require('joi');

/**
 * Función para registrar una nueva categoría
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Categoría (category.js), 
 *              Modelo Estado (state.js)
 */

const addCategory = async (req, res) => {
    try {
        const { Nombre_Categoria, Descripcion_Categoria } = req.body;

        const stateCategory = await StateModel.findOne({
            where: {
                Tipo_Estado: 'Activo'
            }
        });

        if (!stateCategory) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const newCategory = await CategoryModel.create({ 
            Nombre_Categoria, 
            Descripcion_Categoria,
            ID_Estado_FK: stateCategory.id
        });

        res.status(201).send({ msg: "Se ha registrado una nueva categoría.", newCategory })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La categoría ya existe!" });
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
        const categories = await CategoryModel.findAll({});

        if (categories.length === 0) {
            return res.status(404).send({ error: "No hay categorías registradas." });
        }

        res.status(200).send({ categories });
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
        const category = await CategoryModel.findByPk(id);

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
 *              Modelo Categoría (category.js)
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

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        updates.forEach((update) => category[update] = req.body[update]);
        
        await category.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar de forma lógica una categoría por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js),
 *              Modelo Estado (state.js)
 */

const deleteCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        const stateCategory = await StateModel.findOne({
            where: {
                Tipo_Estado: "Inactivo"
            }
        });

        category.ID_Estado_FK = stateCategory.id;
        await category.save();
        res.status(200).send({ msg: "Categoría eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    addCategory,
    readCategories,
    readCategoryId,
    updateCategoryId,
    deleteCategoryId
};