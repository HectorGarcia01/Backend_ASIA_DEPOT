const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Estado = require('../models/state');

/**
 * Creación del modelo Marca del Producto
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 */

const Marca_Producto = db.define(`${NAME_PREFIX}_Marca_Producto`, {
    Nombre_Marca: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Estados`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Marca_Producto (brand_product.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Marca_Producto, {
    foreignKey: 'ID_Estado_FK'
});

Marca_Producto.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 */

Marca_Producto.prototype.toJSON = function () {
    const productBrand = { ...this.get() };

    delete productBrand.ID_Estado_FK;
    delete productBrand.createdAt;
    delete productBrand.updatedAt;

    return productBrand;
};

//Exportación del modelo Marca_Producto
module.exports = Marca_Producto;