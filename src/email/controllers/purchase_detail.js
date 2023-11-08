const transporter = require('./email');
const ejs = require('ejs');
const path = require('path');

/**
 * Función para enviar un correo de proceso de compra del cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Transportador (email.js)
 */

const sendPurchaseDetail = async (destination, orden, purchaseDetail, total) => {
    try {
        const html = await ejs.renderFile(path.join(__dirname, '../views/purchase.ejs'), { 
            orden,
            purchaseDetail,
            total
        });

        const mailOptions = {
            from: "ASIA DEPOT",
            to: destination,
            subject: "Tu compra ha sido registrada.",
            html
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = sendPurchaseDetail;