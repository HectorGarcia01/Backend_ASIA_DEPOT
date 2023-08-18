const sharp = require('sharp');

/**
 * Función para subir/actualizar imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const guardarImagenUsuario = async (req, res) => {
    try {
        const { usuario, rol } = req;
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        
        if (rol === 'User') {
            usuario.Avatar_Cliente = buffer;
        } else {
            usuario.Avatar_Empleado = buffer;
        }

        await usuario.save();
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

const verImagenUsuario = async (req, res) => {
    try {
        const { usuario } = req;
        const avatar = usuario.Avatar_Cliente || usuario.Avatar_Empleado;

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

const eliminarImagenUsuario = async (req, res) => {
    try {
        const { usuario, rol } = req;

        if (rol === 'User') {
            usuario.Avatar_Cliente = null;
        } else {
            usuario.Avatar_Empleado = null;
        }

        await usuario.save();
        res.status(200).send({ msg: "Foto de perfil eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

//Exportación de controladores para el manejo de imágen
module.exports = {
    guardarImagenUsuario,
    verImagenUsuario,
    eliminarImagenUsuario
};