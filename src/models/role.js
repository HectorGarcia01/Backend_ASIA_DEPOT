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
        values: ['User', 'Admin', 'SuperAdmin']
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Cliente',
            key: 'id'
        }
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Empleado',
            key: 'id'
        }
    }
});

//Exportación del modelo Rol
module.exports = Rol;