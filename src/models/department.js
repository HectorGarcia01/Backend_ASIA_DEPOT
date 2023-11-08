const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');

/**
 * Creación del modelo Departamento
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 */

const Departamento = db.define(`${NAME_PREFIX}_Departamento`, {
    Nombre_Departamento: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 */

Departamento.prototype.toJSON = function () {
    const department = { ...this.get() };

    delete department.createdAt;
    delete department.updatedAt;

    return department;
};

//Exportación del modelo Departamento
module.exports = Departamento;