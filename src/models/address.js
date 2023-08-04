const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Direccion
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js)
 *              Modelo Empleado (employee.js)
 */

const Direccion = db.define('Direccion', {
    Departamento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Municipio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Calle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Direccion_Referencia: {
        type: DataTypes.STRING,
        allowNull: true
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

//Exportación del modelo Direccion
module.exports = Direccion;