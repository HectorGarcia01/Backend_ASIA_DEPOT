const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Rol
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 */

const Rol = db.define('PRGADH_Rol', {
    Nombre_Rol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        values: ['User', 'Admin', 'SuperAdmin'],
        unique: true
    }
});

//Exportación del modelo Rol
module.exports = Rol;