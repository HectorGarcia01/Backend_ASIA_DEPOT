const jwt = require('jsonwebtoken');
const { KEY_TOKEN } = require('../config/config');
const CustomerModel = require('../models/customer');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');
const EmployeeModel = require('../models/employee');
const TokenModel = require('../models/token');
const RoleModel = require('../models/role');
const StateModel = require('../models/state');

/**
 * Middleware de autenticación
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js),
 *              Modelo Departamento (department.js),
 *              Modelo Municipio (municipality.js),
 *              Modelo Empleado (employee.js),
 *              Modelo Token (token.js),
 *              Modelo Rol (role.js)
 */

const authentication = async (req, res, next) => {
    try {
        if (!req.header('Authorization')) {
            throw new Error("Por favor autenticarse.");
        }

        const userToken = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(userToken, KEY_TOKEN);

        const { id } = await RoleModel.findOne({
            where: {
                Nombre_Rol: decodedToken.rol
            }
        });

        const customer = await CustomerModel.findOne({
            where: {
                id: decodedToken.id,
                ID_Rol_FK: id
            },
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
                attributes: ['Tipo_Estado']
            }]
        });

        const user = customer || await EmployeeModel.findOne({
            where: {
                id: decodedToken.id,
                ID_Rol_FK: id
            },
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['Tipo_Estado']
            }]
        });

        const validateToken = await TokenModel.findOne({
            where: {
                Token_Usuario: userToken
            }
        });

        if (!user || !validateToken) {
            throw new Error("El token es inválido.");
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