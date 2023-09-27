const Sequelize = require('sequelize');
const { validateDepartment, validateMunicipality } = require('../utils/customer/validate_address');
const findState = require('../utils/find_state');
const findRole = require('../utils/find_role');
const CustomerModel = require('../models/customer');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');

/**
 * Función para crear un nuevo cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js),
 *              Modelo Token (token.js),
 *              Función para validar existencia de municipio (validate_municipality.js),
 *              Función para buscar estado (find_state.js),
 *              Función para buscar rol (find_role.js)
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
            ID_Departamento_FK,
            ID_Municipio_FK
        } = req.body;

        if (ID_Municipio_FK) {
            await validateMunicipality(ID_Municipio_FK, ID_Departamento_FK);
        }

        const stateCustomer = await findState('Pendiente');
        const roleCustomer = await findRole('User');

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

        const stateToken = await findState('Activo');
        const token = await newCustomer.generateAuthToken(newCustomer.id, roleCustomer.Nombre_Rol);
        
        await TokenModel.create({ 
            Token_Usuario: token, 
            ID_Estado_FK: stateToken.id,
            ID_Cliente_FK: newCustomer.id 
        });

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El usuario ya existe!"  });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el perfil del cliente
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 */

const customerProfile = async (req, res) => {
    try {
        res.status(200).send({ customer: req.user });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor. " });
    }
};

/**
 * Función para actualizar datos del cliente
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para validar existencia de departamento (validate_municipality.js),
 *              Función para validar existencia de municipio (validate_municipality.js)
 */

const updateCustomer = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Departamento_FK, ID_Municipio_FK } = req.body;
        const updates = Object.keys(req.body);

        const allowedUpdates = [
            'Nombre_Cliente', 
            'Apellido_Cliente', 
            'Telefono_Cliente', 
            'NIT_Cliente', 
            'Direccion_General', 
            'ID_Departamento_FK', 
            'ID_Municipio_FK'
        ];
        
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        if (ID_Departamento_FK) {
            await validateDepartment(ID_Departamento_FK);
        }

        if (ID_Municipio_FK) {
            await validateMunicipality(ID_Municipio_FK, ID_Departamento_FK);
        }

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

//Exportación de controladores para el cliente
module.exports = {
    addCustomer,
    customerProfile,
    updateCustomer
};