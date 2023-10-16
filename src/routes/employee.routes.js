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
const {
    employeeValidateSchema,
    updateEmployeeValidateSchema
} = require('../schemas/employee.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/empleado', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Crear'), 
    validateMiddleware(employeeValidateSchema), 
    addEmployee
);
router.get('/superAdmin/ver/perfil', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), employeeProfile);
router.get('/superAdmin/ver/empleados', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readEmployees);
router.get('/superAdmin/ver/empleado/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readEmployeeId);
router.patch(
    '/superAdmin/actualizar/perfil', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Modificar'), 
    validateMiddleware(updateEmployeeValidateSchema), 
    updateEmployee
);
router.delete('/superAdmin/eliminar/empleado/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteEmployeeId);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/perfil', authMiddleware, roleMiddleware('Admin', 'Ver'), employeeProfile);
router.patch('/admin/actualizar/perfil', authMiddleware, roleMiddleware('Admin', 'Modificar'), updateEmployee);

//Exportación de todas las rutas de empleado
module.exports = router;