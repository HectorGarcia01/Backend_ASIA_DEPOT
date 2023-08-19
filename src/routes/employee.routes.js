const express = require('express');
const router = new express.Router();
const {
    crearEmpleado,
    verPerfilEmpleado,
    actualizarEmpleado,
    verEmpleados,
    eliminarEmpleadoId
} = require('../controllers/employee.controller');
const esquemaValidacion = require('../schemas/employee.schema');
const middlewareValidate = require('../middlewares/validate');
const middlewareAuth = require('../middlewares/auth');
const middlewareRol = require('../middlewares/check_rol');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/empleado', 
    middlewareAuth, 
    middlewareRol('SuperAdmin'), 
    middlewareValidate(esquemaValidacion), 
    crearEmpleado
);
router.get('/superAdmin/ver/perfil', middlewareAuth, middlewareRol('SuperAdmin'), verPerfilEmpleado);
router.get('/superAdmin/ver/empleados', middlewareAuth, middlewareRol('SuperAdmin'), verEmpleados);
router.patch('/superAdmin/actualizar/perfil', middlewareAuth, middlewareRol('SuperAdmin'), actualizarEmpleado);
router.delete('/superAdmin/eliminar/empleado/:id', middlewareAuth, middlewareRol('SuperAdmin'), eliminarEmpleadoId);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/perfil', middlewareAuth, middlewareRol('Admin'), verPerfilEmpleado);
router.patch('/admin/actualizar/perfil', middlewareAuth, middlewareRol('Admin'), actualizarEmpleado);

//Exportación de todas las rutas de empleado
module.exports = router;