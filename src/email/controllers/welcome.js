const transporter = require('./email');
const fs = require('fs');
const path = require('path');

/**
 * Función para enviar un correo de bienvenida
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Transportador (email.js)
 */

const welcomeEmail = async (destination) => {
    try {
        const pathHTML = path.join(__dirname, '../views/welcome.ejs');
        const html = fs.readFileSync(pathHTML, 'utf8');

        const mailOptions = {
            from: "ASIA DEPOT",
            to: destination,
            subject: "Tu cuenta ha sido verificada.",
            html
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = welcomeEmail;