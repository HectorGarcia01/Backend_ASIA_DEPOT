const express = require('express');
const router = new express.Router();
const {
    crearEmpleado,
    verPerfilEmpleado
} = require('../controllers/employee.controller');
const esquemaValidacion = require('../schemas/employee.schema');
const middlewareValidate = require('../middlewares/validate');
const middlewareAuth = require('../middlewares/auth');

router.post('/superAdmin/nuevo/empleado', middlewareValidate(esquemaValidacion), crearEmpleado);
router.get('/admin/ver/perfil', middlewareAuth, verPerfilEmpleado);

//Exportación de todas las rutas de empleado
module.exports = router;