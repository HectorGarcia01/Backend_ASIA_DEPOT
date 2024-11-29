// const { contactUsEmail } = require('../email/controllers/contact_us');

/**
 * Función para contactar a la empresa
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para enviar correo de contactanos (contact_us.js)
 */

const contactUs = async (req, res) => {
    try {
        const { user } = req;
        const { Nombre, Correo, Asunto, Mensaje } = req.body;

        if (user.Correo_Cliente !== Correo) {
            return res.status(400).send({ error: "Lo siento, el correo ingresado no coincide con tu correo actual." });
        }

        // await contactUsEmail(Nombre, user.Correo_Cliente, Asunto, Mensaje);
        res.status(200).send({ msg: "Correo enviado con éxito" });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    contactUs
};