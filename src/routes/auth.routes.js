const express = require('express');
const router = new express.Router();
const {
    iniciarSesion
} = require('../controllers/auth.controller');
const esquemaValidacion = require('../schemas/auth.schema');
const middlewareValidate = require('../middlewares/validate');

router.post('/usuario/login', middlewareValidate(esquemaValidacion), iniciarSesion);

//Exportación de todas las rutas de autenticación
module.exports = router;