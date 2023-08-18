const Sequelize = require('sequelize');
const Cliente = require('../models/customer');
const Direccion = require('../models/address');
const Rol = require('../models/role');
const Estado = require('../models/state');
const Token = require('../models/token');

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
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const rolCliente = await Rol.findOne({
            where: {
                Nombre_Rol: 'User'
            }
        });

        if (!rolCliente) {
            return res.status(404).send({ error: "Rol no encontrado." });
        }

        const nuevoCliente = await Cliente.create({
            Nombre_Cliente,
            Apellido_Cliente,
            Telefono_Cliente,
            NIT_Cliente,
            Correo_Cliente,
            Password_Cliente,
            ID_Estado_FK: estadoCliente.id,
            ID_Rol_FK: rolCliente.id
        });

        if (Departamento || Municipio || Calle || Direccion_Referencia) {
            await Direccion.create({
                Departamento,
                Municipio,
                Calle,
                Direccion_Referencia,
                ID_Cliente_FK: nuevoCliente.id
            });
        }
        
        const token = await nuevoCliente.generarToken(nuevoCliente.id, rolCliente.Nombre_Rol);
        await Token.create({ 
            Token_Usuario: token, 
            ID_Cliente_FK: nuevoCliente.id 
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

const verPerfilCliente = async (req, res) => {
    try {
        const { usuario } = req;

        const direccionCliente = await Direccion.findOne({
            where: {
                ID_Cliente_FK: usuario.id
            }
        });

        res.status(200).send({ usuario, direccionCliente });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del cliente
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const actualizarCliente = async (req, res) => {
    try {
        const { usuario } = req;
        const nuevosCambios = Object.keys(req.body);

        const cambiosPermitidos = ['Nombre_Cliente', 'Apellido_Cliente', 'Telefono_Cliente', 'NIT_Cliente', 'Departamento', 'Municipio', 'Calle', 'Direccion_Referencia'];
        const validarCambios = nuevosCambios.every((nuevoCambio) => cambiosPermitidos.includes(nuevoCambio));

        if (!validarCambios) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        nuevosCambios.forEach((nuevoCambio) => usuario[nuevoCambio] = req.body[nuevoCambio]);

        //Aún queda pendiente lo de actualizar la dirección ***********************************

        await usuario.save();
        res.status(200).send({ usuario, msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

//Exportación de controladores para el cliente
module.exports = {
    crearCliente,
    verPerfilCliente,
    actualizarCliente
};