const express = require('express');
const router = new express.Router();
const {
    crearEmpleado
} = require('../controllers/employee.controller');
const esquemaValidacion = require('../schemas/employee.schema');
const middlewareValidate = require('../middlewares/validate');

router.post('/superAdmin/nuevo/empleado', middlewareValidate(esquemaValidacion), crearEmpleado);

//Exportación de todas las rutas de empleado
module.exports = router;