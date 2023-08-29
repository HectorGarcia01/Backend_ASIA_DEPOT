const Sequelize = require('sequelize');
const CategoryModel = require('../models/category');
const StateModel = require('../models/state');

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
 *              Modelo Categoría (category.js), 
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
 *              Modelo Categoría (category.js), 
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

module.exports = {
    addCategory,
    readCategories,
    readCategoryId
};