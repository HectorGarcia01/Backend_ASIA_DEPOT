const express = require('express');
const router = new express.Router();
const {
    crearCliente
} = require('../controllers/customer.controller');
const esquemaValidacion = require('../schemas/customer.schema');
const middlewareValidate = require('../middlewares/validate');

router.post('/nuevo/cliente', middlewareValidate(esquemaValidacion), crearCliente);

//Exportación de todas las rutas de cliente
module.exports = router;