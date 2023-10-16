const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Permiso
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 */

const Permiso = db.define('PRGADH_Permiso', {
    Nombre_Permiso: {
        type: DataTypes.STRING(10),
        allowNull: false,
        values: ['Crear', 'Ver', 'Modificar', 'Eliminar'],
        unique: true
    },
    Descripcion_Permiso: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
});

//Exportación del modelo Permiso
module.exports = Permiso;