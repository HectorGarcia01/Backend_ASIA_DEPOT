const sharp = require('sharp');

/**
 * Función para subir/actualizar imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const addUserAvatar = async (req, res) => {
    try {
        const { user, role } = req;
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        
        if (role === 'User') {
            user.Avatar_Cliente = buffer;
        } else {
            user.Avatar_Empleado = buffer;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil guardada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para obtener imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const getUserAvatar = async (req, res) => {
    try {
        const { user } = req;
        const avatar = user.Avatar_Cliente || user.Avatar_Empleado;

        if (!avatar) {
            return res.status(404).send({ error: "No posees foto de perfil." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(avatar);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const deleteUserAvatar = async (req, res) => {
    try {
        const { user, role } = req;

        if (role === 'User') {
            user.Avatar_Cliente = null;
        } else {
            user.Avatar_Empleado = null;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

//Exportación de controladores para el manejo de imágen
module.exports = {
    addUserAvatar,
    getUserAvatar,
    deleteUserAvatar
};