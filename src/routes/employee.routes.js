const express = require('express');
const router = new express.Router();
const {
    crearEmpleado
} = require('../controllers/employee.controller');
const esquemaValidacion = require('../schemas/employee.schema');
const middlewareValidate = require('../middlewares/validate');

/**
 * Creación de rutas (endpoints) para empleados
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Controlador empleado (employee.controller.js)
 *              Esquema de validación de cliente (employee.schema.js),
 *              Middleware de validación (validate.js)
 */

router.post('/superAdmin/nuevo/empleado', middlewareValidate(esquemaValidacion), crearEmpleado);

//Exportación de todas las rutas de empleado
module.exports = router;