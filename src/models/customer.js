const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');

/**
 * Creación del modelo Cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Estado (state.js)
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
        type: DataTypes.STRING,
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
    }
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del cliente actual
 */

Cliente.beforeCreate(async (cliente) => {
    try {
        cliente.Password_Cliente = await bcrypt.hash(cliente.Password_Cliente, 8);
    } catch (error) {
        throw new Error({ mensajeError: "Error al cifrar la contraseña.", error });
    }
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Cliente.prototype.generarToken = async function () {
    try {
        const cliente = this;
        const token = jwt.sign({ id: cliente.id.toString() }, KEY_TOKEN);
        return token;
    } catch (error) {
        throw new Error({ mensajeError: "Error al generar token.", error });
    }
}

//Exportación del modelo Cliente
module.exports = Cliente;