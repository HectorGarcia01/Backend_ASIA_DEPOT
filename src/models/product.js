const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Producto
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js),
 *              Modelo Categoria (category.js)
 */

const Producto = db.define('Producto', {
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
    Imagen_Producto: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estados',
            key: 'id'
        }
    },
    ID_Categoria_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categoria',
            key: 'id'
        }
    },
    ID_Marca_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Marca_Productos',
            key: 'id'
        }
    }
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