const express = require('express');
const router = new express.Router();
const {
    iniciarSesion,
    cerrarSesion,
    cerrarTodasSesiones
} = require('../controllers/auth.controller');
const esquemaValidacion = require('../schemas/auth.schema');
const middlewareValidate = require('../middlewares/validate');
const middlewareAuth =  require('../middlewares/auth');

router.post('/usuario/login', middlewareValidate(esquemaValidacion), iniciarSesion);
router.post('/usuario/logout', middlewareAuth, cerrarSesion);
router.post('/usuario/logoutAll', middlewareAuth, cerrarTodasSesiones);

//Exportación de todas las rutas de autenticación
module.exports = router;