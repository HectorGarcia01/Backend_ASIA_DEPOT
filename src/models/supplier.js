const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Estado = require('../models/state');

/**
 * Creación del modelo Proveedor
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const Proveedor = db.define(`${NAME_PREFIX}_Proveedor`, {
    Nombre_Proveedor: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true
    },
    Apellido_Proveedor: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Nombre_Empresa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    Telefono_Proveedor: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    Correo_Proveedor: {
        type: DataTypes.STRING(40),
        allowNull: false,
        low: true,
        unique: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Estados`,
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

/**
 * Método personalizado para filtrar información
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

Proveedor.prototype.toJSON = function () {
    const supplier = { ...this.get() };

    delete supplier.ID_Estado_FK;
    delete supplier.createdAt;
    delete supplier.updatedAt;

    return supplier;
};

//Exportación del modelo Proveedor
module.exports = Proveedor;