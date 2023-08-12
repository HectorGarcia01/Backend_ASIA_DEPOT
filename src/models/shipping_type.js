const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Metodo_Pago
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 */

const Metodo_Pago = db.define('Metodo_Pago', {
    Tipo_Pago: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Exportación del modelo Metodo_Pago
module.exports = Metodo_Pago;