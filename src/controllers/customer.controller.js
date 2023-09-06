const Sequelize = require('sequelize');
const CustomerModel = require('../models/customer');
const AddressModel = require('../models/municipality');
const RoleModel = require('../models/role');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');

/**
 * Función para crear un nuevo cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Direccion (address.js), 
 *              Modelo Rol (role.js), 
 *              Modelo Estado (state.js)
 *              Modelo Token (token.js)
 */

const addCustomer = async (req, res) => {
    try {
        const {
            Nombre_Cliente,
            Apellido_Cliente,
            Telefono_Cliente,
            NIT_Cliente,
            Direccion_General,
            Correo_Cliente,
            Password_Cliente,
            ID_Municipio_FK
        } = req.body;

        if (ID_Municipio_FK) {
            const addressCustomer = await AddressModel.findOne({
                where: {
                    id: ID_Municipio_FK
                }
            });

            if (!addressCustomer) {
                return res.status(404).send({ error: "Dirección no encontrada." });
            }
        }

        const stateCustomer = await StateModel.findOne({
            where: {
                Tipo_Estado: 'Pendiente'
            }
        });

        if (!stateCustomer) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const roleCustomer = await RoleModel.findOne({
            where: {
                Nombre_Rol: 'User'
            }
        });

        if (!roleCustomer) {
            return res.status(404).send({ error: "Rol no encontrado." });
        }

        const newCustomer = await CustomerModel.create({
            Nombre_Cliente,
            Apellido_Cliente,
            Telefono_Cliente,
            NIT_Cliente,
            Direccion_General,
            Correo_Cliente,
            Password_Cliente,
            ID_Municipio_FK,
            ID_Estado_FK: stateCustomer.id,
            ID_Rol_FK: roleCustomer.id
        });

        const token = await newCustomer.generateAuthToken(newCustomer.id, roleCustomer.Nombre_Rol);
        await TokenModel.create({ 
            Token_Usuario: token, 
            ID_Cliente_FK: newCustomer.id 
        });

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El usuario ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el perfil del cliente
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Direccion (address.js)
 */

const customerProfile = async (req, res) => {
    try {
        const { user } = req;

        const addressCustomer = await AddressModel.findOne({
            where: {
                id: user.ID_Municipio_FK
            }
        });

        res.status(200).send({ customer: user, addressCustomer });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del cliente
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Direccion (address.js)
 */

const updateCustomer = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Municipio_FK } = req.body;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Nombre_Cliente', 'Apellido_Cliente', 'Telefono_Cliente', 'NIT_Cliente', 'ID_Municipio_FK'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        if (ID_Municipio_FK) {
            const addressCustomer = await AddressModel.findOne({
                where: {
                    id: ID_Municipio_FK
                }
            });

            if (!addressCustomer) {
                return res.status(404).send({ error: "Dirección no encontrada." });
            }
        }

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación de controladores para el cliente
module.exports = {
    addCustomer,
    customerProfile,
    updateCustomer
};