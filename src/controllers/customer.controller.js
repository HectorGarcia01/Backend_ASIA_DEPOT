const Sequelize = require('sequelize');
const { 
    findDepartment, 
    findMunicipality
} = require('../utils/find_address');
const findState = require('../utils/find_state');
const findRole = require('../utils/find_role');
const createToken = require('../utils/create_token');
const CustomerModel = require('../models/customer');
const EmployeeModel = require('../models/employee');
const StateModel = require('../models/state');
const { accountActivationEmail } = require('../email/controllers/activate_account');

/**
 * Función para crear un nuevo cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js),
 *              Modelo Empleado (employee.js),
 *              Función para validar existencia de municipio (find_address.js),
 *              Función para buscar estado (find_state.js),
 *              Función para buscar rol (find_role.js),
 *              Función para crear un token (create_token.js),
 *              Función para enviar correo de activación de cuenta (activate_account.js)
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

        const employee = await EmployeeModel.findOne({ where: { Correo_Empleado: Correo_Cliente } });

        if (employee) {
            return res.status(400).send({ error: "¡El usuario ya existe!" });
        }

        if (ID_Municipio_FK) {
            await findMunicipality(ID_Municipio_FK, ID_Departamento_FK);
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
        await createToken(roleCustomer.Nombre_Rol, token, stateToken.id, newCustomer.id);
        await accountActivationEmail(newCustomer.Correo_Cliente, token);

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El usuario ya existe!"  });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
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
 *              Función para validar existencia de departamento (find_address.js),
 *              Función para validar existencia de municipio (find_address.js)
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
            await findDepartment(ID_Departamento_FK);
        }

        if (ID_Municipio_FK) {
            await findMunicipality(ID_Municipio_FK, ID_Departamento_FK);
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

/**
 * Función para ver todos los clientes
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js),
 *              Función para buscar estado (find_state.js)
 */

const readCustomers = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 5;
        const where = {
            [Sequelize.Op.or]: [
                {
                    Nombre_Cliente: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                },
                {
                    Correo_Cliente: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                },
                {
                    Telefono_Cliente: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                }
            ]
        };

        if (!nombre) {
            delete where[Sequelize.Op.or];
        }

        const count = await CustomerModel.count({
            where: nombre ? where : {}
        });

        const customers = await CustomerModel.findAll({
            where: nombre ? where : {},
            include: [
                {
                    model: StateModel,
                    as: 'estado',
                    attributes: ['Tipo_Estado']
                }
            ],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        const totalPages = Math.ceil(count / pageSizeValue);
        res.status(200).send({ customers, currentPage: pageValue, totalPages });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


/**
 * Función para ver un cliente por ID
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js),
 */

const readCustomerId = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await CustomerModel.findByPk(id, {
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['Tipo_Estado']
            }]
        });

        if (!customer) {
            return res.status(404).send({ error: "Cliente no encontrado." });
        }

        res.status(200).send({ customer });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar de forma lógica un cliente por id
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteCustomerId = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await CustomerModel.findByPk(id);

        if (!customer) {
            return res.status(404).send({ error: "Cliente no encontrado." });
        }

        const stateCustomer = await findState('Inactivo');

        customer.ID_Estado_FK = stateCustomer.id;
        await customer.save();
        res.status(200).send({ msg: "Cliente eliminado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para activar un cliente por id
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Función para buscar estado (find_state.js)
 */

const activateCustomerId = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await CustomerModel.findByPk(id);

        if (!customer) {
            return res.status(404).send({ error: "Cliente no encontrado." });
        }

        const stateCustomer = await findState('Activo');

        customer.ID_Estado_FK = stateCustomer.id;
        await customer.save();
        res.status(200).send({ msg: "Cliente activado con éxito." });
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
    updateCustomer,
    readCustomers,
    readCustomerId,
    deleteCustomerId,
    activateCustomerId
};