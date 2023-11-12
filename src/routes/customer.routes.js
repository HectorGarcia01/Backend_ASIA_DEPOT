const express = require('express');
const router = new express.Router();
const {
    addCustomer,
    customerProfile,
    updateCustomer,
    readCustomers,
    readCustomerId,
    deleteCustomerId,
    activateCustomerId
} = require('../controllers/customer.controller');
const {
    customerValidateSchema,
    updateCustomerValidateSchema
} = require('../schemas/customer.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el cliente
router.post('/nuevo/cliente', validateMiddleware(customerValidateSchema), addCustomer);
router.get('/usuario/ver/perfil', authMiddleware, roleMiddleware('User'), customerProfile);
router.patch(
    '/usuario/actualizar/perfil', 
    authMiddleware, 
    roleMiddleware('User'), 
    validateMiddleware(updateCustomerValidateSchema), 
    updateCustomer
);

//Configuración de rutas (endpoints) para el SuperAdmin
router.get('/superAdmin/ver/clientes', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readCustomers);
router.get('/superAdmin/ver/cliente/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readCustomerId);
router.patch(
    '/superAdmin/activar/cliente/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    activateCustomerId
);
router.delete('/superAdmin/eliminar/cliente/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteCustomerId);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/clientes', authMiddleware, roleMiddleware('Admin', 'Ver'), readCustomers);
router.get('/admin/ver/cliente/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), readCustomerId);

//Exportación de todas las rutas de cliente
module.exports = router;