const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN, NAME_PREFIX } = require('../config/config');
const Municipio = require('../models/municipality');
const Departamento = require('../models/department');
const Estado = require('../models/state');

/**
 * Creación del modelo Cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Municipio (municipality.js).
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Cliente = db.define(`${NAME_PREFIX}_Cliente`, {
    Nombre_Cliente: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Apellido_Cliente: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Telefono_Cliente: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    NIT_Cliente: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Direccion_General: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Correo_Cliente: {
        type: DataTypes.STRING(40),
        allowNull: false,
        low: true,
        unique: true
    },
    Password_Cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Avatar_Cliente: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    ID_Municipio_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: `${NAME_PREFIX}_Municipios`,
            key: 'id'
        }
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Estados`,
            key: 'id'
        }
    },
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Rols`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Cliente (customer.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Cliente, {
    foreignKey: 'ID_Estado_FK'
});

Cliente.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Municipio (municipality.js)  -> uno
 *              Modelo Cliente (customer.js) -> muchos
 */

Municipio.hasMany(Cliente, {
    foreignKey: 'ID_Municipio_FK',
    as: 'clientes'
});

Cliente.belongsTo(Municipio, {
    foreignKey: 'ID_Municipio_FK',
    as: 'municipio'
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
    const expiresIn = '1d';
    const token = jwt.sign({ id: id.toString(), rol }, KEY_TOKEN, { expiresIn });
    return token;
};

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Municipio (municipality.js),
 *              Modelo Departamento (department.js),
 *              Modelo Estado (state.js)
 */

Cliente.prototype.findByCredentials = async (Correo_Cliente, Password_Cliente, ID_Estado_FK) => {
    const customer = await Cliente.findOne({
        where: {
            Correo_Cliente,
            ID_Estado_FK
        },
        include: [{
            model: Municipio,
            as: 'municipio',
            include: [{
                model: Departamento,
                as: 'departamento'
            }]
        }, {
            model: Estado,
            as: 'estado',
            attributes: ['Tipo_Estado']
        }]
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
    delete customer.ID_Estado_FK;
    delete customer.ID_Rol_FK;
    delete customer.ID_Municipio_FK;
    delete customer.updatedAt;

    return customer;
};

//Exportación del modelo Cliente
module.exports = Cliente;