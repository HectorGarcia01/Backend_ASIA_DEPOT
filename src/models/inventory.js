const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Inventario
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Producto (product.js)
 */

const Inventario = db.define('PRGADH_Inventario', {
    Tipo_Movimiento: {
        type: DataTypes.STRING(6),
        allowNull: false,
        values: ['Compra', 'Venta', 'Ajuste']
    },
    Cantidad_Movimiento: {
        type: DataTypes.INTEGER,
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
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Productos',
            key: 'id'
        }
    }
});

//Exportación del modelo Inventario
module.exports = Inventario;