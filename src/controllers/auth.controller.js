const findState = require('../utils/find_state');
const createToken = require('../utils/create_token');
const CustomerModel = require('../models/customer');
const EmployeeModel = require('../models/employee');
const RoleModel = require('../models/role');
const TokenModel = require('../models/token');

/**
 * Función para iniciar sesión
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar estado (find_state.js),
 *              Función para crear un token (create_token.js),
 *              Modelo Cliente (customer.js), 
 *              Modelo Empleado (employee.js), 
 *              Modelo Rol (role.js),
 */

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const activeState = await findState('Activo');
        
        const customerBuild = CustomerModel.build();
        const employeeBuild = EmployeeModel.build();

        const customer = await customerBuild.findByCredentials(correo, password, activeState.id);
        const user = customer || await employeeBuild.findByCredentials(correo, password, activeState.id);

        if (!user) {
            return res.status(401).send({ error: "Credenciales inválidas." });
        }

        const { Nombre_Rol } = await RoleModel.findOne({
            where: {
                id: user.ID_Rol_FK
            }
        });

        const userToken = await user.generateAuthToken(user.id, Nombre_Rol);
        createToken(Nombre_Rol, userToken, activeState.id, user.id);

        res.status(200).send({ user, userRole: Nombre_Rol, userToken });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(401).send({ error: error.message });
        }
    }
};

/**
 * Función para cerrar sesión
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Token (token.js)
 */

const logout = async (req, res) => {
    try {
        const { user, role, token } = req;
        const whereCondition = {
            Token_Usuario: token
        };

        if (role === 'User') {
            whereCondition.ID_Cliente_FK = user.id;
        } else {
            whereCondition.ID_Empleado_FK = user.id;
        }

        const userToken = await TokenModel.findOne({
            where: whereCondition
        });

        if (!userToken) {
            return res.status(404).send({ error: "Error al cerrar sesión." });
        }

        const inactiveState = await findState('Inactivo');
        userToken.ID_Estado_FK = inactiveState.id;

        await userToken.save();
        res.status(200).send({ msg: "Sesión cerrada correctamente." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para cerrar todas las sesiones
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Token (token.js)
 */

const logoutAll = async (req, res) => {
    try {
        const { user, role } = req;
        let removedToken;

        if (role === 'User') {
            removedToken = await TokenModel.destroy({
                where: {
                    ID_Cliente_FK: user.id
                }
            });
        } else {
            removedToken = await TokenModel.destroy({
                where: {
                    ID_Empleado_FK: user.id
                }
            });
        }

        if (removedToken === 0) {
            return res.status(404).send({ error: "Error al cerrar todas las sesiones." });
        }

        res.status(200).send({ msg: "Sesiones cerradas correctamente." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación del controlador de autenticación
module.exports = {
    login,
    logout,
    logoutAll
};