const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Marca del Producto
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 */

const Marca_Producto = db.define('PRGADH_Marca_Producto', {
    Nombre_Marca: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
});

//Exportación del modelo Marca_Producto
module.exports = Marca_Producto;