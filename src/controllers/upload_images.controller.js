const sharp = require('sharp');
const CustomerModel = require('../models/customer');
const EmployeeModel = require('../models/employee');
const { findProduct } = require('../utils/find_product');

/**
 * Función para subir/actualizar imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const addUserAvatar = async (req, res) => {
    try {
        const { user, role } = req;

        if (!req.file) {
            return res.status(400).send({ error: "Por favor selecciona una imágen." });
        }

        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png({ compressionLevel: 9 }).toBuffer();
        
        if (role === 'User') {
            user.Avatar_Cliente = buffer;
        } else {
            user.Avatar_Empleado = buffer;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil guardada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para subir/actualizar imágen de un producto
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar producto (find_product.js)
 */

const addProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).send({ error: "Por favor selecciona una imágen." });
        }

        const product = await findProduct(id);
        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png({ compressionLevel: 9 }).toBuffer();
        product.Imagen_Producto = buffer;

        await product.save();
        res.status(200).send({ msg: "Foto de perfil guardada con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para obtener imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const getUserAvatar = async (req, res) => {
    try {
        const { user } = req;
        const avatar = user.Avatar_Cliente || user.Avatar_Empleado;

        if (!avatar) {
            return res.status(404).send({ error: "No posees foto de perfil." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(avatar);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para obtener imágen del Cliente
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js)
 */

const getUserAvatarId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await CustomerModel.findByPk(id);

        if (!user) {
            return res.status(404).send({ error: "Cliente no encontrado." });
        }
        const avatar = user.Avatar_Cliente;

        if (!avatar) {
            return res.status(404).send({ error: "No posee foto de perfil." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(avatar);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para obtener imágen del Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js)
 */

const getAdminAvatarId = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await EmployeeModel.findByPk(id);

        if (!admin) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }
        const avatar = admin.Avatar_Empleado;

        if (!avatar) {
            return res.status(404).send({ error: "No posee foto de perfil." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(avatar);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para obtener imágen del producto
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar producto (find_product.js)
 */

const getProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await findProduct(id);
        if (!product.Imagen_Producto) {
            return res.status(404).send({ error: "El producto no tiene una imágen." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(product.Imagen_Producto);
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para eliminar imágen del Cliente/Empleado
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const deleteUserAvatar = async (req, res) => {
    try {
        const { user, role } = req;

        if (role === 'User') {
            user.Avatar_Cliente = null;
        } else {
            user.Avatar_Empleado = null;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

/**
 * Función para eliminar imágen del producto
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar producto (find_product.js)
 */

const deleteProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await findProduct(id);

        product.Imagen_Producto = null;
        
        await product.save();
        res.status(200).send({ msg: "Imágen del producto eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

//Exportación de controladores para el manejo de imágen
module.exports = {
    addUserAvatar,
    addProductPhoto,
    getUserAvatar,
    getUserAvatarId,
    getProductPhoto,
    getAdminAvatarId,
    deleteUserAvatar,
    deleteProductPhoto
};