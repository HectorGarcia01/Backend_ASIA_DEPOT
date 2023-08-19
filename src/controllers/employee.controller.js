const Sequelize = require('sequelize');
const Empleado = require('../models/employee');
const Direccion = require('../models/address');
const Rol = require('../models/role');
const Estado = require('../models/state');
const Token = require('../models/token');

/**
 * Función para crear un nuevo empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Empleado (employee.js), 
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
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const rolEmpleado = await Rol.findOne({
            where: {
                Nombre_Rol: 'Admin'
            }
        });

        if (!rolEmpleado) {
            return res.status(404).send({ error: "Rol no encontrado." });
        }
        
        const nuevoEmpleado = await Empleado.create({
            Nombre_Empleado,
            Apellido_Empleado,
            Telefono_Empleado,
            NIT_Empleado,
            Correo_Empleado,
            Password_Empleado,
            ID_Estado_FK: estadoEmpleado.id,
            ID_Rol_FK: rolEmpleado.id
        });

        if (Departamento || Municipio || Calle || Direccion_Referencia) {
            await Direccion.create({
                Departamento,
                Municipio,
                Calle,
                Direccion_Referencia,
                ID_Empleado_FK: nuevoEmpleado.id
            });
        }

        const token = await nuevoEmpleado.generarToken(nuevoEmpleado.id, rolEmpleado.Nombre_Rol);
        await Token.create({
            Token_Usuario: token,
            ID_Empleado_FK: nuevoEmpleado.id
        });
        
        res.status(201).send({ msg: "Empleado creado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El empleado ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el perfil del empleado
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Direccion (address.js)
 */

const verPerfilEmpleado = async (req, res) => {
    try {
        const { usuario } = req;

        const direccionEmpleado = await Direccion.findOne({
            where: {
                ID_Empleado_FK: usuario.id
            }
        });

        res.status(200).send({ empleado: usuario, direccionEmpleado });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Direccion (address.js)
 */

const actualizarEmpleado = async (req, res) => {
    try {
        const { usuario } = req;
        const nuevosCambios = Object.keys(req.body);

        const cambiosPermitidos = ['Nombre_Empleado', 'Apellido_Empleado', 'Telefono_Empleado', 'NIT_Empleado', 'Departamento', 'Municipio', 'Calle', 'Direccion_Referencia'];
        const validarCambios = nuevosCambios.every((nuevoCambio) => cambiosPermitidos.includes(nuevoCambio));

        if (!validarCambios) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        nuevosCambios.forEach((nuevoCambio) => usuario[nuevoCambio] = req.body[nuevoCambio]);

        //Aún queda pendiente lo de actualizar la dirección ***********************************

        await usuario.save();
        res.status(200).send({ empleado: usuario, msg: "Datos actualizados con éxito." });
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
 *              Modelo Estado (state.js)
 */

const verEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll({});

        if (empleados.length === 0) {
            return res.status(404).send({ error: "No existe ningún empleado registrado." });
        }

        res.status(200).send({ empleados });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

/**
 * Función para ver un empleado por ID
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 */

const verEmpleadoId = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        res.status(200).send({ empleado });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

/**
 * Función para eliminar de forma lógica un empleado por id
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js)
 */

const eliminarEmpleadoId = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        const estadoEmpleado = await Estado.findOne({
            where: {
                Tipo_Estado: "Inactivo"
            }
        });

        empleado.ID_Estado_FK = estadoEmpleado.id;
        await empleado.save();
        res.status(200).send({ msg: "Empleado eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación de controladores para el empleado
module.exports = {
    crearEmpleado,
    verPerfilEmpleado,
    verEmpleadoId,
    actualizarEmpleado,
    verEmpleados,
    eliminarEmpleadoId
};