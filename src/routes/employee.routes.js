const express = require('express');
const router = new express.Router();
const {
    addEmployee,
    employeeProfile,
    updateEmployee,
    readEmployees,
    readEmployeeId,
    deleteEmployeeId
} = require('../controllers/employee.controller');
const employeeSchema = require('../schemas/employee.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/empleado', 
    authMiddleware, 
    roleMiddleware('SuperAdmin'), 
    validateMiddleware(employeeSchema), 
    addEmployee
);
router.get('/superAdmin/ver/perfil', authMiddleware, roleMiddleware('SuperAdmin'), employeeProfile);
router.get('/superAdmin/ver/empleados', authMiddleware, roleMiddleware('SuperAdmin'), readEmployees);
router.get('/superAdmin/ver/empleado/:id', authMiddleware, roleMiddleware('SuperAdmin'), readEmployeeId);
router.patch('/superAdmin/actualizar/perfil', authMiddleware, roleMiddleware('SuperAdmin'), updateEmployee);
router.delete('/superAdmin/eliminar/empleado/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteEmployeeId);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/perfil', authMiddleware, roleMiddleware('Admin'), employeeProfile);
router.patch('/admin/actualizar/perfil', authMiddleware, roleMiddleware('Admin'), updateEmployee);

//Exportación de todas las rutas de empleado
module.exports = router;