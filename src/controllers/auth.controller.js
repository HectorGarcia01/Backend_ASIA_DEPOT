const Cliente = require('../models/customer');
const Empleado = require('../models/employee');
const Rol = require('../models/role');
const Token = require('../models/token');

/**
 * Inicio de sesión
 * Fecha creación: 04/08/2023
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
            res.status(401).send({ error: "Credenciales inválidas." });
        }

        const { Nombre_Rol } = await Rol.findOne({
            where: {
                id: usuario.ID_Rol_FK
            }
        });

        const Token_Usuario = await usuario.generarToken();

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

//Exportación del controlador de autenticación
module.exports = {
    iniciarSesion
};