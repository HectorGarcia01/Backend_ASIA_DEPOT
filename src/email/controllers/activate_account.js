const transporter = require('./email');
const ejs = require('ejs');
const path = require('path');

/**
 * Función para enviar un correo de activación de cuenta
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Transportador (email.js)
 */

const accountActivationEmail = async (destination, userToken) => {
    try {
        const html = await ejs.renderFile(path.join(__dirname, 'views/activate_account.ejs'), { userToken });
        const mailOptions = {
            from: "ASIA DEPOT",
            to: destination,
            subject: "Activación de cuenta de usuario.",
            html
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    accountActivationEmail
};