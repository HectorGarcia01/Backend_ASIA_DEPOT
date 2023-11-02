const Sequelize = require('sequelize');
const CustomerModel = require('../models/customer');
const NewsletterModel = require('../models/newsletter');
const { newsletterEmail } = require('../email/controllers/newsletter');

/**
 * Función para suscribirse al newsletter
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js),
 *              Modelo Newsletter (newsletter.js)
 */

const subscriptionNewsletter = async (req, res) => { 
    try {
        const { user } = req;
        const { Correo_Cliente } = req.body;

        if (user.Correo_Cliente !== Correo_Cliente) {
            return res.status(400).send({ error: "Lo siento, el correo ingresado no coincide con tu correo actual." });
        }

        await NewsletterModel.create({ ID_Cliente_FK: user.id });
        await newsletterEmail(user.Correo_Cliente);
        res.status(200).send({ msg: "¡Gracias por suscribirte a nuestro newsletter! Ahora estarás al tanto de nuestras últimas noticias y ofertas especiales." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡Ya eres un suscriptor de nuestro newsletter! Te mantendremos actualizado con nuestras últimas noticias y ofertas." });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para anular suscripción del newsletter
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js),
 *              Modelo Newsletter (newsletter.js)
 */

const unsubscriptionNewsletter = async (req, res) => {
    try {
        const { user } = req;
        const removedNewsletter = await NewsletterModel.destroy({ where: { ID_Cliente_FK: user.id } });

        if (removedNewsletter === 0) {
            return res.status(404).send({ error: "Lo siento, no estás suscrito al newsletter." });
        }

        res.status(200).send({ msg: "Tu solicitud de desuscripción se ha completado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    subscriptionNewsletter,
    unsubscriptionNewsletter
};