const express = require('express');
const router = new express.Router();
const { sendRecaptchaKey } = require('../controllers/recaptcha.controller');

router.get('recaptcha/obtener/clave', sendRecaptchaKey);

//Exportación de todas las rutas de recaptcha
module.exports = router;