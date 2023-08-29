const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { keep } = require('../schemas/product_review.schema');

/**
 * Creación del modelo Categoria
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 */

const Categoria = db.define('Categoria', {
    Nombre_Categoria: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    Descripcion_Categoria: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estados',
            key: 'id'
        }
    }
});

//Exportación del modelo Categoria
module.exports = Categoria;