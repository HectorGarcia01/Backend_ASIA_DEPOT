const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Departamento = require('../models/department');

/**
 * Creación del modelo Municipio
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Departamento (department.js)
 */

const Municipio = db.define(`${NAME_PREFIX}_Municipio`, {
    Nombre_Municipio: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    ID_Departamento_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Departamentos`,
            key: 'id'
        }
    },
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Departamento (department.js) -> uno
 *              Modelo Municipio (municipality.js)  -> muchos
 */

Departamento.hasMany(Municipio, {
    foreignKey: 'ID_Departamento_FK',
    as: 'municipios'
});

Municipio.belongsTo(Departamento, {
    foreignKey: 'ID_Departamento_FK',
    as: 'departamento'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Departamento (department.js)
 */

Municipio.prototype.toJSON = function () {
    const municipality = { ...this.get() };

    delete municipality.ID_Departamento_FK;
    delete municipality.createdAt;
    delete municipality.updatedAt;

    return municipality;
};

//Exportación del modelo Municipio
module.exports = Municipio;