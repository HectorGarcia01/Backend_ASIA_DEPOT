const express = require('express');
const router = new express.Router();
const {
    crearEmpleado,
    verPerfilEmpleado
} = require('../controllers/employee.controller');
const esquemaValidacion = require('../schemas/employee.schema');
const middlewareValidate = require('../middlewares/validate');
const middlewareAuth = require('../middlewares/auth');
const middlewareRol = require('../middlewares/check_rol');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post('/superAdmin/nuevo/empleado', middlewareValidate(esquemaValidacion), middlewareRol('SuperAdmin'), crearEmpleado);
router.get('/superAdmin/ver/perfil', middlewareAuth, middlewareRol('SuperAdmin'), verPerfilEmpleado);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/perfil', middlewareAuth, middlewareRol('Admin'), verPerfilEmpleado);

//Exportación de todas las rutas de empleado
module.exports = router;