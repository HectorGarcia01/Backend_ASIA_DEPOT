const express = require('express');
const router = new express.Router();
const {
    addUserAvatar,
    addProductPhoto,
    getUserAvatar,
    getUserAvatarId,
    getAdminAvatarId,
    getProductPhoto,
    deleteUserAvatar,
    deleteProductPhoto
} = require('../controllers/upload_images.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');
const uploadMiddleware = require('../middlewares/upload_images');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/subir/avatar', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Modificar'), 
    uploadMiddleware.single('avatar'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/superAdmin/ver/avatar', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), getUserAvatar);
router.delete('/superAdmin/eliminar/avatar', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/subir/avatar',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    uploadMiddleware.single('avatar'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/admin/ver/avatar', authMiddleware, roleMiddleware('Admin', 'Ver'), getUserAvatar);
router.delete('/admin/eliminar/avatar', authMiddleware, roleMiddleware('Admin', 'Eliminar'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el User
router.post(
    '/usuario/subir/avatar',
    authMiddleware,
    roleMiddleware('User'),
    uploadMiddleware.single('avatar'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/usuario/ver/avatar', authMiddleware, roleMiddleware('User'), getUserAvatar);
router.delete('/usuario/eliminar/avatar', authMiddleware, roleMiddleware('User'), deleteUserAvatar);

//Configuración de rutas (endpoints) para cliente y empleado
router.get('/usuario/ver/avatar/:id', getUserAvatarId);
router.get('/superAdmin/ver/avatars/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), getAdminAvatarId);

//Configuración de rutas (endpoints) para el producto
router.post(
    '/superAdmin/subir/foto/producto/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    uploadMiddleware.single('avatar'),
    addProductPhoto,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.post(
    '/admin/subir/foto/producto/:id',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    uploadMiddleware.single('avatar'),
    addProductPhoto,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/usuario/ver/foto/producto/:id', getProductPhoto);
router.get('/superAdmin/ver/foto/producto/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), getProductPhoto);
router.get('/admin/ver/foto/producto/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), getProductPhoto);
router.delete('/superAdmin/eliminar/foto/producto/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteProductPhoto);
router.delete('/admin/eliminar/foto/producto/:id', authMiddleware, roleMiddleware('Admin', 'Eliminar'), deleteProductPhoto);

//Exportación de todas las rutas para el manejo de imágen
module.exports = router;