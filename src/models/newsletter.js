const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Cliente = require('../models/customer');

/**
 * Creación del modelo Newsletter
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js),
 *              Modelo Producto (product.js)
 */

const Newsletter = db.define(`${NAME_PREFIX}_Newsletter`, {
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: `${NAME_PREFIX}_Clientes`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Newsletter (state.js)  -> uno
 *              Modelo Cliente (customer.js) -> uno
 */

Cliente.hasOne(Newsletter, {
    foreignKey: 'ID_Cliente_FK'
});

Newsletter.belongsTo(Cliente, {
    foreignKey: 'ID_Cliente_FK',
    as: 'cliente'
});

//Exportación del modelo Newsletter
module.exports = Newsletter;