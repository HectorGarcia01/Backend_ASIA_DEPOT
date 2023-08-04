const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Token
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Cliente (customer.js) y Modelo Empleado (employee.js)
 */

const Token = db.define('Token', {
    Token_Usuario: {
        type: DataTypes.STRING,
        allowNull: false
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

//Exportación del modelo Token
module.exports = Token;