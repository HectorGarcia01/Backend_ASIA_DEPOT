const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Municipio
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Departamento (department.js)
 */

const Municipio = db.define('PRGADH_Municipio', {
    Nombre_Municipio: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    ID_Departamento_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Departamentos',
            key: 'id'
        }
    },
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

    delete municipality.createdAt;
    delete municipality.updatedAt;

    return municipality;
};

//Exportación del modelo Municipio
module.exports = Municipio;