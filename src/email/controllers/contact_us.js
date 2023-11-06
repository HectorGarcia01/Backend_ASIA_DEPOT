const transporter = require('./email');

/**
 * Función para enviar un correo de contáctanos
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Transportador (email.js)
 */

const contactUsEmail = async (customer, email, subject, message) => {
    try {
        const from = `${customer}`;
        const html = `${message} <h3>Nombre: ${customer}</h3> <h3>Correo: ${email}</h3>`;
        const mailOptions = {
            from,
            to: 'hg2779948@gmail.com',
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    contactUsEmail
};