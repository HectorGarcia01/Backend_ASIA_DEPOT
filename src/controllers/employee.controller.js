const Sequelize = require('sequelize');
const findState = require('../utils/find_state');
const findRole = require('../utils/find_role');
const createToken = require('../utils/create_token');
const EmployeeModel = require('../models/employee');
const CustomerModel = require('../models/customer');
const StateModel = require('../models/state');
const { accountActivationEmail } = require('../email/controllers/activate_account');

/**
 * Función para crear un nuevo empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Empleado (employee.js), 
 *              Modelo Cliente (customer.js),
 *              Función para buscar estado (find_state.js),
 *              Función para buscar rol (find_role.js),
 *              Función para crear un token (create_token.js),
 *              Función para enviar correo de activación de cuenta (activate_account.js)
 */

const addEmployee = async (req, res) => {
    try {
        const {
            Nombre_Empleado,
            Apellido_Empleado,
            Telefono_Empleado,
            NIT_Empleado,
            Correo_Empleado,
            Password_Empleado
        } = req.body;

        const customer = await CustomerModel.findOne({ where: { Correo_Cliente: Correo_Empleado } });

        if (customer) {
            return res.status(400).send({ error: "¡El usuario ya existe!" });
        }

        const stateEmployee = await findState('Pendiente');
        const roleEmployee = await findRole('Admin');
        
        const newEmployee = await EmployeeModel.create({
            Nombre_Empleado,
            Apellido_Empleado,
            Telefono_Empleado,
            NIT_Empleado,
            Correo_Empleado,
            Password_Empleado,
            ID_Estado_FK: stateEmployee.id,
            ID_Rol_FK: roleEmployee.id
        });

        const stateToken = await findState('Activo');
        const token = await newEmployee.generateAuthToken(newEmployee.id, roleEmployee.Nombre_Rol);
        await createToken(roleEmployee.Nombre_Rol, token, stateToken.id, newEmployee.id);
        await accountActivationEmail(newEmployee.Correo_Empleado, token);
        
        res.status(201).send({ msg: "Empleado creado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El empleado ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
};

/**
 * Función para ver el perfil del empleado
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 */

const employeeProfile = async (req, res) => {
    try {
        res.status(200).send({ employee: req.user });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js)
 */

const updateEmployee = async (req, res) => {
    try {
        const { user } = req;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Nombre_Empleado', 'Apellido_Empleado', 'Telefono_Empleado', 'NIT_Empleado'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver todos los empleados
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Función para buscar estado (find_state.js)
 */

const readEmployees = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 5;
        const roleEmployee = await findRole('Admin');
        const where = {
            ID_Rol_FK: roleEmployee.id
        };

        if (nombre) {
            where[Sequelize.Op.or] = [
                {
                    Nombre_Empleado: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                },
                {
                    Correo_Empleado: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                },
                {
                    Telefono_Empleado: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                }
            ];
        }

        const count = await EmployeeModel.count({ where });
        const employees = await EmployeeModel.findAll({
            where,
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['Tipo_Estado']
            }],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (employees.length === 0) {
            return res.status(404).send({ error: "No existe ningún empleado registrado." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);
        res.status(200).send({ employees, currentPage: pageValue, totalPages });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un empleado por ID
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 */

const readEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModel.findByPk(id, {
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['Tipo_Estado']
            }]
        });

        if (!employee) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        res.status(200).send({ employee });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar de forma lógica un empleado por id
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModel.findByPk(id);

        if (!employee) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        const stateEmployee = await findState('Inactivo');

        employee.ID_Estado_FK = stateEmployee.id;
        await employee.save();
        res.status(200).send({ msg: "Empleado eliminado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para activar un empleado por id
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Función para buscar estado (find_state.js)
 */

const activateEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModel.findByPk(id);

        if (!employee) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        const stateEmployee = await findState('Activo');

        employee.ID_Estado_FK = stateEmployee.id;
        await employee.save();
        res.status(200).send({ msg: "Empleado activado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

//Exportación de controladores para el empleado
module.exports = {
    addEmployee,
    employeeProfile,
    updateEmployee,
    readEmployees,
    readEmployeeId,
    deleteEmployeeId,
    activateEmployeeId
};