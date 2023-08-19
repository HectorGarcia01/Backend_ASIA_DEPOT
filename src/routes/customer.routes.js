const express = require('express');
const router = new express.Router();
const {
    crearCliente,
    verPerfilCliente,
    actualizarCliente
} = require('../controllers/customer.controller');
const esquemaValidacion = require('../schemas/customer.schema');
const middlewareValidate = require('../middlewares/validate');
const middlewareAuth = require('../middlewares/auth');
const middlewareRol = require('../middlewares/check_rol');

router.post('/nuevo/cliente', middlewareValidate(esquemaValidacion), crearCliente);
router.get('/usuario/ver/perfil', middlewareAuth, middlewareRol('User'), verPerfilCliente);
router.patch('/usuario/actualizar/perfil', middlewareAuth, middlewareRol('User'), actualizarCliente);

//Exportación de todas las rutas de cliente
module.exports = router;