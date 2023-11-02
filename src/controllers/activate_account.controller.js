const jwt = require('jsonwebtoken');
const { KEY_TOKEN } = require('../config/config');
const CustomerModel = require('../models/customer');
const EmployeeModel = require('../models/employee');
const StateModel = require('../models/state');
const findState = require('../utils/find_state');
const findRole = require('../utils/find_role');
const TokenModel = require('../models/token');
const RoleModel = require('../models/role');
const welcomeEmail = require('../email/welcome_email');

/**
 * Función para activar una cuenta de usuario (cliente/empleado)
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Empleado (employee.js),
 *              Función para buscar estado (find_state.js),
 *              Función para buscar rol (find_role.js),
 *              Modelo Token (token.js),
 *              Función para enviar un correo de bienvenida (welcome_email.js)
 */

const activateUserAccount = async (req, res) => {
    try {
        if (!req.header('Authorization')) {
            return res.status(400).send({ error: "Por favor envía un token." })
        }

        const userToken = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(userToken, KEY_TOKEN);

        const validateToken = await TokenModel.findOne({
            where: {
                token_usuario: userToken
            }
        });

        if (!validateToken) {
            return res.status(404).send({ error: "Token inválido." })
        }

        const stateUser = await findState('Pendiente');
        const userRole = await findRole(decodedToken.role);

        const customer = await CustomerModel.findOne({
            where: {
                id: decodedToken.id,
                ID_Rol_FK: userRole.id,
                ID_Estado_FK: stateUser.id
            }
        });

        const user = customer || await EmployeeModel.findOne({
            where: {
                id: decodedToken.id,
                ID_Rol_FK: userRole.id,
                ID_Estado_FK: stateUser.id
            }
        });

        if (!user) {
            return res.status(404).send({ error: "Token inválido." })
        }

        const newStateUser = await findState('Activo');
        user.ID_Estado_FK = newStateUser.id;

        await user.save();

        if (user.Correo_Cliente) {
            await welcomeEmail(user.Correo_Cliente);
        } else if (user.Correo_Empleado) {
            await welcomeEmail(user.Correo_Empleado);
        }

        res.status(200).send({ msg: "Tu cuenta ha sido activada, ya puedes iniciar sesión." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para generar un nuevo token de activación (cliente/empleado)
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Empleado (employee.js),
 *              Función para buscar estado (find_state.js),
 *              Función para buscar rol (find_role.js),
 *              Modelo Token (token.js),
 *              Función para enviar un correo de bienvenida (welcome_email.js)
 */

const sendNewToken = async (req, res) => {
    try {
        const { correo } = req.body;

        const stateUser = await findState('Pendiente');
        const customer = await CustomerModel.findOne({
            where: {
                Correo_Cliente: correo,
                ID_Estado_FK: stateUser.id
            }
        });

        const user = customer || await EmployeeModel.findOne({
            where: {
                Correo_Empleado: correo,
                ID_Estado_FK: stateUser.id
            }
        });

        if (!user) {
            return res.status(404).send({ error: "Ha ocurrido un error al buscar tu correo." })
        }

        const { Nombre_Rol } = await findRole(user.ID_Rol_FK);
        const activeState = await findState('Activo');
        const userToken = await user.generateAuthToken(user.id, Nombre_Rol);
        createToken(Nombre_Rol, userToken, activeState.id, user.id);

        if (user.Correo_Cliente) {
            await welcomeEmail(user.Correo_Cliente);
        } else if (user.Correo_Empleado) {
            await welcomeEmail(user.Correo_Empleado);
        }

        res.status(200).send({ msg: "Se ha enviado un nuevo token a tu correo electrónico." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }    
    }
};
module.exports = {
    activateUserAccount,
    sendNewToken
};