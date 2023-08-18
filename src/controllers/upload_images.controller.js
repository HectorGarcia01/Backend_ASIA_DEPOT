const sharp = require('sharp');

/**
 * Función para subir imágenes
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


//Exportación de controladores para el manejo de imágen
module.exports = {
    guardarImagenUsuario
};