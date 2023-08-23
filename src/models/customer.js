const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');

/**
 * Creación del modelo Cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Cliente = db.define('Cliente', {
    Nombre_Cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido_Cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono_Cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NIT_Cliente: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Correo_Cliente: {
        type: DataTypes.STRING,
        allowNull: false,
        low: true,
        unique: true
    },
    Password_Cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Avatar_Cliente: {
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
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rols',
            key: 'id'
        }
    }
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del cliente actual
 */

Cliente.beforeCreate(async (customer) => {
    customer.Password_Cliente = await bcrypt.hash(customer.Password_Cliente, 8);
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Cliente.prototype.generateAuthToken = (id, rol) => {
    const token = jwt.sign({ id: id.toString(), rol }, KEY_TOKEN);
    return token;
}

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Cliente.prototype.findByCredentials = async (Correo_Cliente, Password_Cliente) => {
    const customer = await Cliente.findOne({
        where: {
            Correo_Cliente
        }
    });

    if (!customer) {
        return false;
    }

    const isMatch = await bcrypt.compare(Password_Cliente, customer.Password_Cliente);

    if (!isMatch) {
        throw new Error("Credenciales inválidas.");
    }

    return customer;
};

/**
 * Método personalizado para filtrar información
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Cliente.prototype.toJSON = function () {
    const customer = { ...this.get() };

    delete customer.Avatar_Cliente;
    delete customer.Password_Cliente;
    delete customer.createdAt;
    delete customer.updatedAt;
    delete customer.ID_Rol_FK;

    return customer;
};

//Exportación del modelo Cliente
module.exports = Cliente;