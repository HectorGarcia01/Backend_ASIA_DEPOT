const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Estado = require('../models/state');

/**
 * Creación del modelo Proveedor
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const Proveedor = db.define('PRGADH_Proveedor', {
    Nombre_Proveedor: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    Apellido_Proveedor: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Nombre_Empresa: {
        type: DataTypes.STRING(50),
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
            model: 'PRGADH_Estados',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Proveedor (supplier.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Proveedor, {
    foreignKey: 'ID_Estado_FK'
});

Proveedor.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

//Exportación del modelo Proveedor
module.exports = Proveedor;