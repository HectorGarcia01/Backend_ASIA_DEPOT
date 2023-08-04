const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Direccion
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 */

const Direccion = db.define('Direccion', {
    Departamento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Municipio: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
});

//Exportación del modelo Direccion
module.exports = Direccion;