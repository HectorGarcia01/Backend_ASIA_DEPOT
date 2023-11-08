const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');

/**
 * Creación del modelo Estado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 */

const Estado = db.define(`${NAME_PREFIX}_Estado`, {
    Tipo_Estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        values: [
            'Pendiente',    //Para cliente, empleado y factura de ventas
            'Activo',       //Para cliente, empleado, productos y tokens
            'Inactivo',     //Para cliente, empleado y productos y tokens
            'Carrito',      //Para cuando el cliente aún no procese la compra
            'En proceso',   //Para la factura de ventas
            'Completado'    //Para la factura de ventas
        ]
    }
});

//Exportación del modelo Estado
module.exports = Estado;