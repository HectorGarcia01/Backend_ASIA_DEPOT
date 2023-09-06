const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Direccion
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js)
 *              Modelo Empleado (employee.js)
 */

const Direccion = db.define('Direccion', {
    Departamento: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Municipio: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Direccion.prototype.toJSON = function () {
    const address = { ...this.get() };

    delete address.createdAt;
    delete address.updatedAt;

    return address;
};

//Exportación del modelo Direccion
module.exports = Direccion;