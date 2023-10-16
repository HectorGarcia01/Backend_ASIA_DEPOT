const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');

/**
 * Creación del modelo Rol
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 */

const Rol = db.define(`${NAME_PREFIX}_Rol`, {
    Nombre_Rol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        values: ['User', 'Admin', 'SuperAdmin'],
        unique: true
    }
});

//Exportación del modelo Rol
module.exports = Rol;