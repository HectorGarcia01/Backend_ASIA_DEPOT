const Sequelize = require('sequelize') ;
const Cliente = require('../models/customer');
const Direccion = require('../models/address');
const Rol = require('../models/role');
const Estado = require('../models/state');
const Token = require('../models/token');

/**
 * Crear un nuevo cliente
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Direccion (address.js), 
 *              Modelo Rol (role.js), 
 *              Modelo Estado (state.js)
 *              Modelo Token (token.js)
 */

const crearCliente = async (req, res) => {
    try {
        const {
            Nombre_Cliente,
            Apellido_Cliente,
            Telefono_Cliente,
            NIT_Cliente,
            Correo_Cliente,
            Password_Cliente,
            Departamento,
            Municipio,
            Calle,
            Direccion_Referencia
        } = req.body;

        const estadoCliente = await Estado.findOne({
            where: {
                Tipo_Estado: 'Pendiente'
            }
        });

        if (!estadoCliente) {
            return res.status(404).send({ msg: "Estado no encontrado" });
        }

        const nuevoCliente = await Cliente.create({
            Nombre_Cliente,
            Apellido_Cliente,
            Telefono_Cliente,
            NIT_Cliente,
            Correo_Cliente,
            Password_Cliente,
            ID_Estado_FK: estadoCliente.id
        });

        if (Departamento || Municipio || Calle || Direccion_Referencia) {
            const direccionCliente = await Direccion.create({
                Departamento,
                Municipio,
                Calle,
                Direccion_Referencia,
                ID_Cliente_FK: nuevoCliente.id
            });
        }

        const rolCliente = await Rol.create({ ID_Cliente_FK: nuevoCliente.id });
        
        const generarToken = await nuevoCliente.generarToken();
        const tokenCliente = await Token.create({ 
            Token_Usuario: generarToken, 
            ID_Cliente_FK: nuevoCliente.id 
        });

        res.status(201).send({ nuevoCliente });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ msg: '¡El cliente ya existe!' });
        } else {
            res.status(500).send({ error: 'Error interno del servidor.' });
        }
    }
};

module.exports = {
    crearCliente
};