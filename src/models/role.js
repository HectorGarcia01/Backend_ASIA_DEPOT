const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Rol
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Cliente (customer.js) y Modelo Empleado (employee.js)
 */

const Rol = db.define('Rol', {
    Nombre_Rol: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ['User', 'Admin', 'SuperAdmin'],
        defaultValue: 'User'
    }
});

//Exportación del modelo Rol
module.exports = Rol;