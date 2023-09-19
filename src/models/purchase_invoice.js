const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Factura_Compra
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Proveedor (supplier.js)
 */

const Factura_Compra = db.define('PRGADH_Factura_Compra', {
    Total_Factura: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Empleados',
            key: 'id'
        }
    },
    ID_Proveedor_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Proveedors',
            key: 'id'
        }
    }
});

//Exportación del modelo Factura_Compra
module.exports = Factura_Compra;