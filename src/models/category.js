const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Estado = require('../models/state');

/**
 * Creación del modelo Categoria
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 */

const Categoria = db.define(`${NAME_PREFIX}_Categoria`, {
    Nombre_Categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    Descripcion_Categoria: {
        type: DataTypes.STRING(200),
        allowNull: true
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
 *              Modelo Categoría (category.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Categoria, { 
    foreignKey: 'ID_Estado_FK' 
});

Categoria.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 */

Categoria.prototype.toJSON = function () {
    const category = { ...this.get() };

    delete category.ID_Estado_FK;
    delete category.updatedAt;

    return category;
};

//Exportación del modelo Categoria
module.exports = Categoria;