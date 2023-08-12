const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Detalle_Compra
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              
 */

const Detalle_Compra = db.define('Detalle_Compra', {
    Cantidad_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Precio_Unitario: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Subtotal_Compra: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Factura_Compra_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Factura_Compras',
            key: 'id'
        }
    },
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Productos',
            key: 'id'
        }
    }
});

//Exportación del modelo Detalle_Compra
module.exports = Detalle_Compra;