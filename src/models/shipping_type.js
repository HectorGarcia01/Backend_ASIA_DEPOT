const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');


/**
 * Creación del modelo Metodo_Pago
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 */

const Metodo_Pago = db.define(`${NAME_PREFIX}_Metodo_Pago`, {
    Tipo_Pago: {
        type: DataTypes.STRING(40),
        allowNull: false
    }
});

//Exportación del modelo Metodo_Pago
module.exports = Metodo_Pago;