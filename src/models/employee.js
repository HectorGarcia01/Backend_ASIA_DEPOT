const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Estado (state.js) y Modelo Direccion (address.js)
 */

const Empleado = db.define('Empleado', {
    Nombre_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NIT_Empleado: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Correo_Empleado: {
        type: DataTypes.STRING,
        allowNull: false,
        low: true,
        unique: true
    },
    Password_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Avatar_Empleado: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estado',
            key: 'id'
        }
    },
    ID_Direccion_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Direccion',
            key: 'id'
        }
    }
});

//Exportación del modelo Empleado
module.exports = Empleado;