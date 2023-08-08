const Sequelize = require('sequelize');
const Empleado = require('../models/employee');
const Direccion = require('../models/address');
const Rol = require('../models/role');
const Estado = require('../models/state');
const Token = require('../models/token');

/**
 * Crear un nuevo empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Empleado (customer.js), 
 *              Modelo Direccion (address.js), 
 *              Modelo Rol (role.js), 
 *              Modelo Estado (state.js)
 *              Modelo Token (token.js)
 */

const crearEmpleado = async (req, res) => {
    try {
        const {
            Nombre_Empleado,
            Apellido_Empleado,
            Telefono_Empleado,
            NIT_Empleado,
            Correo_Empleado,
            Password_Empleado,
            Departamento,
            Municipio,
            Calle,
            Direccion_Referencia
        } = req.body;

        const estadoEmpleado = await Estado.findOne({
            where: {
                Tipo_Estado: 'Pendiente'
            }
        });

        if (!estadoEmpleado) {
            return res.status(404).send({ msg: "Estado no encontrado" });
        }
        
        const nuevoEmpleado = await Empleado.create({
            Nombre_Empleado,
            Apellido_Empleado,
            Telefono_Empleado,
            NIT_Empleado,
            Correo_Empleado,
            Password_Empleado,
            ID_Estado_FK: estadoEmpleado.id
        });

        if (Departamento || Municipio || Calle || Direccion_Referencia) {
            const direccionEmpleado = await Direccion.create({
                Departamento,
                Municipio,
                Calle,
                Direccion_Referencia,
                ID_Empleado_FK: nuevoEmpleado.id
            });
        }

        const rolEmpleado = await Rol.create({ 
            Nombre_Rol: 'Admin',
            ID_Empleado_FK: nuevoEmpleado.id 
        });

        const generarToken = await nuevoEmpleado.generarToken();
        const tokenEmpleado = await Token.create({
            Token_Usuario: generarToken,
            ID_Empleado_FK: nuevoEmpleado.id
        });
        
        res.status(201).send({ nuevoEmpleado, direccionEmpleado });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ msg: '¡El cliente ya existe!' });
        } else {
            res.status(500).send({ error: 'Error interno del servidor.' });
        }
    }
};

//Exportación de controladores para el empleado
module.exports = {
    crearEmpleado
};