const express = require('express');
const router = new express.Router();
const {
    addUserAvatar,
    getUserAvatar,
    deleteUserAvatar
} = require('../controllers/upload_images.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');
const uploadMiddleware = require('../middlewares/upload_images');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/subir/avatar', 
    authMiddleware, 
    roleMiddleware('SuperAdmin'), 
    uploadMiddleware.single('avatar'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/superAdmin/ver/avatar', authMiddleware, roleMiddleware('SuperAdmin'), getUserAvatar);
router.delete('/superAdmin/eliminar/avatar', authMiddleware, roleMiddleware('SuperAdmin'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/subir/avatar',
    authMiddleware,
    roleMiddleware('Admin'),
    uploadMiddleware.single('avatar'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/admin/ver/avatar', authMiddleware, roleMiddleware('Admin'), getUserAvatar);
router.delete('/admin/eliminar/avatar', authMiddleware, roleMiddleware('Admin'), deleteUserAvatar);

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

//Configuración de rutas (endpoints) para el producto


//Exportación de todas las rutas para el manejo de imágen
module.exports = router;