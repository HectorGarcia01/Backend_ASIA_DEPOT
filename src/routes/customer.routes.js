const express = require('express');
const router = new express.Router();
const {
    crearCliente
} = require('../controllers/customer.controller');
const esquemaValidacion = require('../schemas/customer.schema');
const middlewareValidate = require('../middlewares/validate');

/**
 * Creación de rutas (endpoints) para clientes
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Controlador cliente (customer.controller.js),
 *              Esquema de validación de cliente (customer.schema.js),
 *              Middleware de validación (validate.js)
 */

router.post('/nuevo/cliente', middlewareValidate(esquemaValidacion), crearCliente);

//Exportación de todas las rutas de cliente
module.exports = router;