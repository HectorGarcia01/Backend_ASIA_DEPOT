const jwt = require('jsonwebtoken');
const { KEY_TOKEN } = require('../config/config');
const Cliente = require('../models/customer');
const Empleado = require('../models/employee');
const Token = require('../models/token');

/**
 * Middleware de autenticación
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js),
 *              Modelo Empleado (employee.js),
 *              Modelo Token (token.js)
 */

const autenticación = async (req, res, next) => {
    try {
        if (!req.header('Authorization')) {
            throw new Error("Por favor autenticarse.");
        }

        const Token_Usuario = req.header('Authorization').replace('Bearer ', '');
        const decodificarToken = jwt.verify(Token_Usuario, KEY_TOKEN);
        const { id } = Token.findOne({
            where: {
                Token_Usuario
            }
        });

        const cliente = await Cliente.findOne({
            where: {
                id: decodificarToken.id,
                ID_Rol_FK: id
            }
        });

        const usuario = cliente || await Empleado.findOne({
            where: {
                id: decodificarToken.id,
                ID_Rol_FK: id
            }
        });

        if (!usuario) {
            throw new Error("El token es inválido.");
        }

        req.usuario = usuario;
        req.token = Token_Usuario;

        next();
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

module.exports = autenticación;