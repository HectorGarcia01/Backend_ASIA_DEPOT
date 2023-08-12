const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Categoria
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const Categoria = db.define('Categoria', {
    Nombre_Categoria: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Exportación del modelo Categoria
module.exports = Categoria;