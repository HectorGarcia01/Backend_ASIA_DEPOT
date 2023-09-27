const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Estado = require('../models/state');
const Categoria = require('../models/category');
const Marca = require('../models/brand_product');

/**
 * Creación del modelo Producto
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js),
 *              Modelo Categoria (category.js)
 */

const Producto = db.define('PRGADH_Producto', {
    Nombre_Producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Precio_Promedio: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Descripcion_Producto: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    Cantidad_Stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Imagen_Producto: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    Codigo_Barras: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Estados',
            key: 'id'
        }
    },
    ID_Categoria_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Categoria',
            key: 'id'
        }
    },
    ID_Marca_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Marca_Productos',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (employee.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Producto, {
    foreignKey: 'ID_Estado_FK'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Categoría (category.js) -> uno
 *              Modelo Producto (product.js)  -> muchos
 */

Categoria.hasMany(Producto, {
    foreignKey: 'ID_Categoria_FK',
    as: 'productos'
});

Producto.belongsTo(Categoria, {
    foreignKey: 'ID_Categoria_FK',
    as: 'categoria'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Marca_Producto (brand_product.js) -> uno
 *              Modelo Producto (product.js)  -> muchos
 */

Marca.hasMany(Producto, {
    foreignKey: 'ID_Marca_FK',
    as: 'productos'
});

Producto.belongsTo(Marca, {
    foreignKey: 'ID_Marca_FK',
    as: 'marca'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 */

Producto.prototype.toJSON = function () {
    const product = { ...this.get() };

    delete product.createdAt;
    delete product.updatedAt;

    return product;
};

//Exportación del modelo Producto
module.exports = Producto;