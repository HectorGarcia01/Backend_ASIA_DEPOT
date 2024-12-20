const jwt = require('jsonwebtoken');
const { KEY_TOKEN } = require('../config/config');
const findState = require('../utils/find_state');
const findRole = require('../utils/find_role');
const CustomerModel = require('../models/customer');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');
const EmployeeModel = require('../models/employee');
const TokenModel = require('../models/token');
const StateModel = require('../models/state');

/**
 * Middleware de autenticación
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar estado (find_state.js),
 *              Modelo Token (token.js),
 *              Función para buscar rol (find_role.js),
 *              Modelo Cliente (customer.js),
 *              Modelo Departamento (department.js),
 *              Modelo Municipio (municipality.js),
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js)
 */

const authentication = async (req, res, next) => {
    try {
        if (!req.header('Authorization')) {
            throw new Error("Por favor autenticarse.");
        }

        const userToken = req.header('Authorization').replace('Bearer ', '');

        const decodedToken = jwt.verify(userToken, KEY_TOKEN);

        const activeState = await findState('Activo');
        const validateToken = await TokenModel.findOne({
            where: {
                Token_Usuario: userToken,
                ID_Estado_FK: activeState.id
            }
        });

        if (!validateToken) {
            throw new Error("Error de autenticación.");
        }

        const roleUser = await findRole(decodedToken.rol);
        const whereCondition = {
            id: decodedToken.id,
            ID_Rol_FK: roleUser.id,
            ID_Estado_FK: activeState.id
        };

        const customer = await CustomerModel.findOne({
            where: whereCondition,
            include: [{
                model: MunicipalityModel,
                as: 'municipio',
                include: [{
                    model: DepartmentModel,
                    as: 'departamento'
                }]
            }, {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }]
        });

        const user = customer || await EmployeeModel.findOne({
            where: whereCondition
        });

        if (!user) {
            throw new Error("Error de autenticación.");
        }

        req.user = user;
        req.role = decodedToken.rol;
        req.token = userToken;

        next();
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

module.exports = authentication;