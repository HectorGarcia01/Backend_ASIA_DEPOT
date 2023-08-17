const Cliente = require('../models/customer');
const Empleado = require('../models/employee');
const Rol = require('../models/role');
const Token = require('../models/token');

/**
 * Función para iniciar sesión
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Empleado (employee.js), 
 *              Modelo Rol (role.js),
 *              Modelo Token (token.js)
 */

const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        const clienteBuild = Cliente.build();
        const empleadoBuild = Empleado.build();

        const cliente = await clienteBuild.validarCredenciales(correo, password);
        const usuario = cliente || await empleadoBuild.validarCredenciales(correo, password);

        if (!usuario) {
            return res.status(401).send({ error: "Credenciales inválidas." });
        }

        const { Nombre_Rol } = await Rol.findOne({
            where: {
                id: usuario.ID_Rol_FK
            }
        });

        const Token_Usuario = await usuario.generarToken(usuario.id, Nombre_Rol);

        if (Nombre_Rol === 'User') {
            await Token.create({
                Token_Usuario,
                ID_Cliente_FK: usuario.id
            });
        } else {
            await Token.create({
                Token_Usuario,
                ID_Empleado_FK: usuario.id
            });
        }        

        res.status(200).send({ usuario, Nombre_Rol, Token_Usuario });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

/**
 * Función para cerrar sesión
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Token (token.js)
 */

const cerrarSesion = async (req, res) => {
    try {
        const Token_Usuario = req.token;

        const tokenEliminado = await Token.destroy({
            where: {
                Token_Usuario
            }
        });

        if(tokenEliminado === 0) {
            return res.status(404).send({ error: "Error al cerrar sesión." });
        }

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

const cerrarTodasSesiones = async (req, res) => {
    try {
        const { id } = req.usuario;

        if (Nombre_Rol === 'User') {
            tokenEliminado = await Token.destroy({
                where: {
                    ID_Cliente_FK: id
                }
            });
        } else {
            tokenEliminado = await Token.destroy({
                where: {
                    ID_Empleado_FK: id
                }
            });
        }
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación del controlador de autenticación
module.exports = {
    iniciarSesion,
    cerrarSesion,
    cerrarTodasSesiones
};