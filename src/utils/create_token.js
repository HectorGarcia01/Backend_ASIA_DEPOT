const TokenModel = require('../models/token');

/**
 * Función para crear un token
 * Fecha creación: 02/10/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Token (token.js)
 */

const createToken = async (Rol, Token_Usuario, ID_Estado_FK, UserId) => {
    if (Rol === 'User') {
        await TokenModel.create({
            Token_Usuario,
            ID_Estado_FK,
            ID_Cliente_FK: UserId
        });
    } else {
        await TokenModel.create({
            Token_Usuario,
            ID_Estado_FK,
            ID_Empleado_FK: UserId
        });
    }
};

//Exportación de la función para crear un token
module.exports = createToken;
