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

const Inventario = db.define('Inventario', {
    Cantidad_Stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Empleados',
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

//Exportación del modelo Inventario
module.exports = Inventario;