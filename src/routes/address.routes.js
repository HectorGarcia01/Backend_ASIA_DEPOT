const express = require('express');
const router = new express.Router();
const {
    addDepartment,
    addMunicipality,
    readAddresses,
    updateDepartmentId,
    updateMunicipalityId,
    deleteDepartmentId,
    deleteMunicipalityId
} = require('../controllers/address.controller');
const {
    departmentSchema,
    municipalitySchema,
    updateDepartmentSchema,
    updateMunicipalitySchema
} = require('../schemas/address.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/departamento', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Crear'), 
    validateMiddleware(departmentSchema), 
    addDepartment
);
router.post(
    '/superAdmin/crear/municipio',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Crear'),
    validateMiddleware(municipalitySchema),
    addMunicipality
);
router.get('/superAdmin/ver/direcciones', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readAddresses);
router.patch(
    '/superAdmin/actualizar/departamento/:id', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Modificar'), 
    validateMiddleware(updateDepartmentSchema), 
    updateDepartmentId
);
router.patch(
    '/superAdmin/actualizar/municipio/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    validateMiddleware(updateMunicipalitySchema),
    updateMunicipalityId
);
router.delete('/superAdmin/eliminar/departamento/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteDepartmentId);
router.delete('/superAdmin/eliminar/municipio/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteMunicipalityId);

//Rutas (endpoints) para el Admin
router.post(
    '/admin/crear/departamento',
    authMiddleware,
    roleMiddleware('Admin', 'Crear'),
    validateMiddleware(departmentSchema),
    addDepartment
);
router.post(
    '/admin/crear/municipio',
    authMiddleware,
    roleMiddleware('Admin', 'Crear'),
    validateMiddleware(municipalitySchema),
    addMunicipality
);
router.get('/admin/ver/direcciones', authMiddleware, roleMiddleware('Admin', 'Ver'), readAddresses);
router.patch(
    '/admin/actualizar/departamento/:id',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    validateMiddleware(updateDepartmentSchema),
    updateDepartmentId
);
router.patch(
    '/admin/actualizar/municipio/:id',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    validateMiddleware(updateMunicipalitySchema),
    updateMunicipalityId
);

//Rutas (endpoints) para los usuarios sin autenticación
router.get('/usuario/ver/direcciones', readAddresses);

module.exports = router;