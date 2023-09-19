const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Tipo_Envio
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 */

const Tipo_Envio = db.define('PRGADH_Tipo_Envio', {
    Nombre_Envio: {
        type: DataTypes.STRING(40),
        allowNull: false
    }
});

//Exportación del modelo Tipo_Envio
module.exports = Tipo_Envio;