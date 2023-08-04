const express = require('express');
const router = new express.Router();
const {
    crearCliente
} = require('../controllers/customer.controller');

/**
 * Creación de rutas (endpoints) para clientes
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Controlador cliente (customer.controller.js)
 */
router.post('/nuevo/cliente', crearCliente);

//Exportación de todas las rutas de cliente
module.exports = router;