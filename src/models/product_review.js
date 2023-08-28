const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Valoracion_Producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Cliente (customer.js),
 *              Modelo Producto (product.js)
 */

const Valoracion_Producto = db.define('Valoracion_Producto', {
    Comentario_Producto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Puntuacion_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clientes',
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

//Exportación del modelo Valoracion_Producto
module.exports = Valoracion_Producto;