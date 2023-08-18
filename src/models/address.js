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
        type: DataTypes.STRING,
        allowNull: true
    },
    Municipio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Calle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Direccion_Referencia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clientes',
            key: 'id'
        }
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Empleados',
            key: 'id'
        }
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Direccion.prototype.toJSON = function () {
    const direccion = { ...this.get() };

    delete direccion.ID_Cliente_FK;
    delete direccion.ID_Empleado_FK;
    delete direccion.createdAt;
    delete direccion.updatedAt;

    return direccion;
};

//Exportación del modelo Direccion
module.exports = Direccion;