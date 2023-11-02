const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Cliente = require('../models/customer');
const Producto = require('../models/product');

/**
 * Creación del modelo Producto_Favorito
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js),
 *              Modelo Producto (product.js)
 */

const Producto_Favorito = db.define(`${NAME_PREFIX}_Producto_Favorito`, {
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Clientes`,
            key: 'id'
        }
    },
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: `${NAME_PREFIX}_Productos`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Cliente (customer.js) -> uno
 *              Modelo Producto_Favorito (favorite_product.js)  -> muchos
 */

Cliente.hasMany(Producto_Favorito, {
    foreignKey: 'ID_Cliente_FK',
    as: 'productos_favorito'
});

Producto_Favorito.belongsTo(Empleado, {
    foreignKey: 'ID_Cliente_FK',
    as: 'cliente'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (product.js) -> uno
 *              Modelo Producto_Favorito (favorite_product.js)  -> muchos
 */

Producto.hasMany(Producto_Favorito, {
    foreignKey: 'ID_Producto_FK',
    as: 'productos_favorito'
});

Producto_Favorito.belongsTo(Producto, {
    foreignKey: 'ID_Producto_FK',
    as: 'producto'
});

//Exportación del modelo Producto_Favorito
module.exports = Producto_Favorito;