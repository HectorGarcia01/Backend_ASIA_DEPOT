const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Proveedor
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 */

const Proveedor = db.define('Proveedor', {
    Nombre_Proveedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido_Proveedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono_Proveedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Correo_Proveedor: {
        type: DataTypes.STRING,
        allowNull: false,
        low: true,
        unique: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estados',
            key: 'id'
        }
    }
});

//Exportación del modelo Proveedor
module.exports = Proveedor;