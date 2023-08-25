const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Proveedor
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const Proveedor = db.define('Proveedor', {
    Nombre_Proveedor: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    Apellido_Proveedor: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    Telefono_Proveedor: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    Correo_Proveedor: {
        type: DataTypes.STRING(30),
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