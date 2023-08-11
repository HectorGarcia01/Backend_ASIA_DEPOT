const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');

/**
 * Creación del modelo Empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Empleado = db.define('Empleado', {
    Nombre_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NIT_Empleado: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Correo_Empleado: {
        type: DataTypes.STRING,
        allowNull: false,
        low: true,
        unique: true
    },
    Password_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Avatar_Empleado: {
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
 * Referencias: Datos del empleado actual
 */

Empleado.beforeCreate(async (empleado) => {
    try {
        empleado.Password_Empleado = await bcrypt.hash(empleado.Password_Empleado, 8);
    } catch (error) {
        throw new Error({ mensajeError: "Error al cifrar la contraseña.", error });
    }
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Empleado.prototype.generarToken = async function () {
    try {
        const empleado = this;
        const token = jwt.sign({ id: empleado.id.toString() }, KEY_TOKEN);
        return token;
    } catch (error) {
        throw new Error({ mensajeError: "Error al generar token.", error });
    }
}

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.validarCredenciales = async (Correo_Empleado, Password_Empleado) => {
    try {
        const empleado = await Empleado.findOne({
            where: {
                Correo_Empleado
            }
        });

        if (!empleado) {
            return false;
        }

        const passwordValida = await bcrypt.compare(Password_Empleado, empleado.Password_Empleado);

        if (!passwordValida) {
            throw new Error("Credenciales inválidas.");
        }

        return empleado;
    } catch (error) {
        throw new Error("Error al iniciar sesión.", error);
    }
};

//Exportación del modelo Empleado
module.exports = Empleado;