const Sequelize = require('sequelize');
const CategoryModel = require('../models/category');

/**
 * Función para registrar una nueva categoría
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Categoría (category.js), 
 */

const addCategory = async (req, res) => {
    try {
        const { Nombre_Categoria } = req.body;

        const newCategory = await CategoryModel.create({ Nombre_Categoria });

        res.status(201).send({ msg: "Se ha registrado una nueva categoría.", newCategory })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La categoría ya existe!" });
        } else {
            res.status(500).send({ errors: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addCategory
};