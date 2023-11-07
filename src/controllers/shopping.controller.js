const SalesInvoiceModel = require('../models/sales_invoice');
const SalesDetailModel = require('../models/sales_detail');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const { findProduct } = require('../utils/find_product');
const findState = require('../utils/find_state');
const { Sequelize } = require('sequelize');
const sendPurchaseDetail = require('../email/controllers/purchase_detail');

/**
 * Función para agregar productos en el carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Función para buscar producto (find_product.js),
 *              Función para buscar estado (find_state.js)
 */

const addShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Producto_FK } = req.body;
        let { Cantidad_Producto } = req.body;

        if (typeof Cantidad_Producto === 'string') {
            Cantidad_Producto = parseFloat(Cantidad_Producto);
        }

        const product = await findProduct(ID_Producto_FK);

        if (product.Cantidad_Stock < Cantidad_Producto) {
            return res.status(400).send({ error: "No hay suficiente stock disponible." });
        }

        const Subtotal_Venta = Cantidad_Producto * product.Precio_Venta;

        const stateShoppingCart = await findState('Carrito');
        let shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });

        if (!shoppingCart) {
            shoppingCart = await SalesInvoiceModel.create({
                NIT_Cliente: user.nit,
                Total_Factura: 0,
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            });
        }

        let shoppingCartDetail = await SalesDetailModel.findOne({
            where: {
                ID_Factura_Venta_FK: shoppingCart.id,
                ID_Producto_FK
            }
        });

        if (shoppingCartDetail) {
            shoppingCartDetail.Cantidad_Producto += Cantidad_Producto;
            shoppingCartDetail.Subtotal_Venta += Subtotal_Venta;
            await shoppingCartDetail.save();
        } else {
            shoppingCartDetail = await SalesDetailModel.create({
                Cantidad_Producto,
                Precio_Unitario: product.Precio_Venta,
                Subtotal_Venta,
                ID_Producto_FK,
                ID_Factura_Venta_FK: shoppingCart.id
            });
        }

        shoppingCart.Total_Factura += Subtotal_Venta;
        await shoppingCart.save();

        product.Cantidad_Stock -= Cantidad_Producto;
        await product.save();

        res.status(201).send({ msg: "Producto agregado al carrito con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todo el detalle del carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Función para buscar estado (find_state.js)
 */

const readShoppingCart = async (req, res) => {
    try {
        const { user } = req;

        const stateShoppingCart = await findState('Carrito');
        const shoppingDetailCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            },
            attributes: ['id', 'Total_Factura'],
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                attributes: ['id', 'Cantidad_Producto', 'Precio_Unitario', 'Subtotal_Venta'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'nombre_producto', 'descripcion_producto']
                }
            }]
        });

        if (!shoppingDetailCart) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        res.status(200).send({ shoppingDetailCart });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para actualizar la cantidad de productos en el carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Función para buscar producto (find_product.js),
 *              Función para buscar estado (find_state.js)
 */

const updateShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Producto_FK } = req.body;
        let { Cantidad_Producto } = req.body;

        if (typeof Cantidad_Producto === 'string') {
            Cantidad_Producto = parseFloat(Cantidad_Producto);
        }

        const product = await findProduct(ID_Producto_FK);
        const stateShoppingCart = await findState('Carrito');
        let shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });

        if (!shoppingCart) {
            return res.status(404).send({ error: "Carrito de compras no encontrado." });
        }

        let shoppingCartDetail = await SalesDetailModel.findOne({
            where: {
                ID_Factura_Venta_FK: shoppingCart.id,
                ID_Producto_FK
            }
        });

        if (!shoppingCartDetail) {
            return res.status(404).send({ error: "Producto no encontrado en el carrito de compras." });
        } 

        const Nueva_Cantidad = Cantidad_Producto - shoppingCartDetail.Cantidad_Producto;

        if (product.Cantidad_Stock < Nueva_Cantidad) {
            return res.status(400).send({ error: "No hay suficiente stock disponible." });
        }

        const Subtotal_Venta = Cantidad_Producto * product.Precio_Venta;

        shoppingCartDetail.Cantidad_Producto = Cantidad_Producto;
        shoppingCartDetail.Subtotal_Venta = Subtotal_Venta;
        await shoppingCartDetail.save();

        if (Nueva_Cantidad < 0) {
            shoppingCart.Total_Factura += (product.Precio_Venta * Nueva_Cantidad);
        } else {
            shoppingCart.Total_Factura += (Subtotal_Venta - product.Precio_Venta);
        }

        product.Cantidad_Stock -= Nueva_Cantidad;
        await shoppingCart.save();
        await product.save();

        res.status(200).send({ msg: "El carrito ha sido actualizado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para eliminar un producto del detalle del carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Función para buscar producto (find_product.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteProductIdShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const product = await findProduct(id);
        const stateShoppingCart = await findState('Carrito');
        const shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });

        if (!shoppingCart) {
            return res.status(404).send({ error: "Carrito de compras no encontrado." });
        }

        const shoppingDetailCart = await SalesDetailModel.findOne({
            where: {
                ID_Factura_Venta_FK: shoppingCart.id,
                ID_Producto_FK: product.id
            }
        });

        if (!shoppingDetailCart) {
            return res.status(404).send({ error: "El producto no existe en el carrito." });
        }

        shoppingCart.Total_Factura -= shoppingDetailCart.Subtotal_Venta;
        product.Cantidad_Stock += shoppingDetailCart.Cantidad_Producto;

        await shoppingCart.save();
        await product.save();
        await shoppingDetailCart.destroy();

        res.status(200).send({ msg: "El producto ha sido eliminado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para eliminar el carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteShoppingCart = async (req, res) => {
    try {
        const { user } = req;

        const stateShoppingCart = await findState('Carrito');
        const shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            },
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto']
                }
            }]
        });

        if (!shoppingCart) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }
        
        const inactiveShoppingCart = await findState('Inactivo');

        for (const detail of shoppingCart.detalles_venta) {
            const product = await ProductModel.findByPk(detail.producto.id);

            if (product) {
                product.Cantidad_Stock += detail.Cantidad_Producto;
                await product.save();
            }
        }

        shoppingCart.ID_Estado_FK = inactiveShoppingCart.id;
        await shoppingCart.save();

        res.status(200).send({ msg: "El carrito ha sido eliminado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para procesar compra del cliente
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Función para buscar estado (find_state.js)
 */

const processCustomerSale = async (req, res) => {
    try {
        const { user } = req;

        const stateShoppingCart = await findState('Carrito');
        const salesInvoice = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            },
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                include: {
                    model: ProductModel,
                    as: 'producto',
                }
            }]
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        const stateSalesInvoice = await findState('Pendiente');
        const orden = `ASDT-${user.id}-${salesInvoice.id}`;
        salesInvoice.numero_orden = orden;
        salesInvoice.ID_Estado_FK = stateSalesInvoice.id;

        await salesInvoice.save();
        await sendPurchaseDetail(user.Correo_Cliente, orden, salesInvoice.detalles_venta, salesInvoice.Total_Factura);

        res.status(200).send({ msg: `Compra procesada con éxito, tu número de orden es ${orden}.`, orden });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
};

/**
 * Función para cancelar la compra del cliente (solo con estado pendiente)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Función para buscar estado (find_state.js)
 */

const cancelCustomerSaleId = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const shopping = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Cliente_FK: user.id
            },
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                include: {
                    model: ProductModel,
                    as: 'producto',
                }
            }]
        });

        if (!shopping) {
            return res.status(404).send({ error: "Compra no encontrada." });
        }

        const stateShopping = await findState('Pendiente');

        if (shopping.ID_Estado_FK !== stateShopping.id) {
            return res.status(404).send({ error: "Lo siento, no puedes cancelar esta compra." });
        }

        const cancelStateShopping = await findState('Cancelado');
        shopping.ID_Estado_FK = cancelStateShopping.id;
        await shopping.save();

        for (const detail of shopping.detalles_venta) {
            const product = await ProductModel.findByPk(detail.producto.id);

            if (product) {
                product.Cantidad_Stock += detail.Cantidad_Producto;
                await product.save();
            }
        }

        res.status(200).send({ msg: "Su compra ha sido cancelada." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el historial de compra del cliente
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Estado (state.js),
 *              Función para buscar estado (find_state.js)
 */

const shoppingHistory = async (req, res) => {
    try {
        const { user } = req;

        const inactiveStatusShopping = await findState('Inactivo');
        const carritoStatusShopping = await findState('Carrito');
        const customerPurchase = await SalesInvoiceModel.findAll({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: {
                    [Sequelize.Op.notIn]: [inactiveStatusShopping.id, carritoStatusShopping.id]
                }
            },
            attributes: ['id', 'numero_orden', 'Total_Factura'],
            include: {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }
        });

        if (customerPurchase.length === 0) {
            return res.status(404).send({ error: "No tienes ninguna compra procesada." });
        }

        res.status(200).send({ shoppingHistory: customerPurchase });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el detalle de compra por id del cliente
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js)
 *              Modelo Estado (state.js),
 *              Función para buscar estado (find_state.js)
 */

const shoppingHistoryId = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const inactiveStatusShopping = await findState('Inactivo');
        const carritoStatusShopping = await findState('Carrito');
        const shoppingDetail = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Cliente_FK: user.id,
                ID_Estado_FK: {
                    [Sequelize.Op.notIn]: [inactiveStatusShopping.id, carritoStatusShopping.id]
                }
            },
            attributes: ['id', 'Total_Factura'],
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                attributes: ['id', 'Cantidad_Producto', 'Precio_Unitario', 'Subtotal_Venta'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'nombre_producto', 'descripcion_producto']
                }
            },
            {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (!shoppingDetail) {
            return res.status(404).send({ error: "Detalle de compra no encontrado." });
        }

        res.status(200).send({ shoppingDetail });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    addShoppingCart,
    readShoppingCart,
    updateShoppingCart,
    deleteProductIdShoppingCart,
    deleteShoppingCart,
    processCustomerSale,
    cancelCustomerSaleId,
    shoppingHistory,
    shoppingHistoryId
}