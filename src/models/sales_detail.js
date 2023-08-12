const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Detalle_Venta
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Factura_Venta (sales_invoice.js),
 *              Modelo Producto (product.js) 
 */

const Detalle_Venta = db.define('Detalle_Venta', {
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
    ID_Factura_Venta_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Factura_Ventas',
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

//Exportación del modelo Detalle_Venta
module.exports = Detalle_Venta;