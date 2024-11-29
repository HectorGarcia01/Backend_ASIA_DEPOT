// const transporter = require('./email');
const fs = require('fs');
const path = require('path');

/**
 * Función para enviar un correo de suscripción al newsletter
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Transportador (email.js)
 */

const newsletterEmail = async (destination) => {
    try {
        const pathHTML = path.join(__dirname, '../views/newsletter.ejs');
        const html = fs.readFileSync(pathHTML, 'utf8');

        const mailOptions = {
            from: "ASIA DEPOT",
            to: destination,
            subject: "Suscripción al newsletter.",
            html
        };

        // const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Función para enviar un correo de anulación de suscripción al newsletter
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Transportador (email.js)
 */

const unsubscriptionNewsletterEmail = async (destination) => {
    try {
        const pathHTML = path.join(__dirname, '../views/unsubscription_newsletter.ejs');
        const html = fs.readFileSync(pathHTML, 'utf8');

        const mailOptions = {
            from: "ASIA DEPOT",
            to: destination,
            subject: "Anulación de suscripción al newsletter.",
            html
        };

        // const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    newsletterEmail,
    unsubscriptionNewsletterEmail
};