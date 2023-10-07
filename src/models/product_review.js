const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Cliente = require('../models/customer');
const Producto = require('../models/product');

/**
 * Creación del modelo Valoracion_Producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Cliente (customer.js),
 *              Modelo Producto (product.js)
 */

const Valoracion_Producto = db.define('PRGADH_Valoracion_Producto', {
    Comentario_Producto: {
        type: DataTypes.STRING(200),
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
            model: 'PRGADH_Clientes',
            key: 'id'
        }
    },
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Productos',
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
 *              Modelo Inventario (inventory.js)  -> muchos
 */

Cliente.hasMany(Valoracion_Producto, {
    foreignKey: 'ID_Cliente_FK',
    as: 'valoraciones_producto'
});

Valoracion_Producto.belongsTo(Cliente, {
    foreignKey: 'ID_Cliente_FK',
    as: 'cliente'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (product.js) -> uno
 *              Modelo Inventario (inventory.js)  -> muchos
 */

Producto.hasMany(Valoracion_Producto, {
    foreignKey: 'ID_Producto_FK',
    as: 'valoraciones_producto'
});

Valoracion_Producto.belongsTo(Producto, {
    foreignKey: 'ID_Producto_FK',
    as: 'producto'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 */

Valoracion_Producto.prototype.toJSON = function () {
    const productReview = { ...this.get() };

    delete productReview.createdAt;
    delete productReview.updatedAt;

    return productReview;
};

//Exportación del modelo Valoracion_Producto
module.exports = Valoracion_Producto;