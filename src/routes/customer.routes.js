const express = require('express');
const router = new express.Router();
const {
    addCustomer,
    customerProfile,
    updateCustomer
} = require('../controllers/customer.controller');
const {
    customerValidateSchema,
    updateCustomerValidateSchema
} = require('../schemas/customer.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

router.post('/nuevo/cliente', validateMiddleware(customerValidateSchema), addCustomer);
router.get('/usuario/ver/perfil', authMiddleware, roleMiddleware('User'), customerProfile);
router.patch(
    '/usuario/actualizar/perfil', 
    authMiddleware, 
    roleMiddleware('User'), 
    validateMiddleware(updateCustomerValidateSchema), 
    updateCustomer
);

//Exportación de todas las rutas de cliente
module.exports = router;