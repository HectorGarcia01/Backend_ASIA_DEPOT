const express = require('express');
const router = new express.Router();
const {
    crearCliente,
    verPerfilCliente
} = require('../controllers/customer.controller');
const esquemaValidacion = require('../schemas/customer.schema');
const middlewareValidate = require('../middlewares/validate');
const middlewareAuth = require('../middlewares/auth');

router.post('/nuevo/cliente', middlewareValidate(esquemaValidacion), crearCliente);
router.get('/user/ver/perfil', middlewareAuth, verPerfilCliente);

//Exportación de todas las rutas de cliente
module.exports = router;