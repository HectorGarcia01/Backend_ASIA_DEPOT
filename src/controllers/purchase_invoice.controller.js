const PurchaseInvoiceModel = require('../models/purchase_invoice');
const PurchaseDetailModel = require('../models/purchase_detail');
const ProductModel = require('../models/product');
const InventoryModel = require('../models/inventory');
const findState = require('../utils/find_state');
const findSupplier = require('../utils/find_supplier');
const { findProduct } = require('../utils/find_product');

/**
 * Función para registrar/actualizar productos en la compra
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Función para buscar proveedor (find_supplier.js),
 *              Función para buscar producto (find_product.js),
 *              Función para buscar estado (find_state.js)
 */

const addPurchaseInvoice = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Proveedor_FK, ID_Producto_FK, Cantidad_Producto } = req.body;
        let product;

        if (ID_Proveedor_FK) {
            await findSupplier(ID_Proveedor_FK);
        }

        if (ID_Producto_FK) {
            product = await findProduct(ID_Producto_FK);
        }

        const Subtotal_Compra = Cantidad_Producto * product.Precio_Compra;
        const statePurchaseInvoice = await findState("En proceso");

        let purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            }
        });

        if (!purchaseInvoice) {
            purchaseInvoice = await PurchaseInvoiceModel.create({
                Total_Factura: 0,
                ID_Empleado_FK: user.id,
                ID_Proveedor_FK,
                ID_Estado_FK: statePurchaseInvoice.id
            });
        }

        let purchaseDetail = await PurchaseDetailModel.findOne({
            where: {
                ID_Factura_Compra_FK: purchaseInvoice.id,
                ID_Producto_FK
            }
        });

        if (purchaseDetail) {
            purchaseDetail.Cantidad_Producto += Cantidad_Producto;
            purchaseDetail.Subtotal_Compra += Subtotal_Compra;
            await purchaseDetail.save();
        } else {
            purchaseDetail = await PurchaseDetailModel.create({
                Cantidad_Producto,
                Precio_Unitario: product.Precio_Compra,
                Subtotal_Compra,
                ID_Producto_FK,
                ID_Factura_Compra_FK: purchaseInvoice.id
            });
        }

        purchaseInvoice.Total_Factura += Subtotal_Compra;
        await purchaseInvoice.save();

        product.Cantidad_Stock += Cantidad_Producto;
        await product.save();

        res.status(201).send({ msg: "Producto agregado a la compra con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver la compra en proceso
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Función para buscar estado (find_state.js)
 */

const readPurchaseInvoiceProcess = async (req, res) => {
    try {
        const { user } = req;
        const statePurchaseInvoice = await findState("En proceso");
        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            },
            attributes: ['id', 'Total_Factura'],
            include: [{
                model: PurchaseDetailModel,
                as: 'detalles_compra',
                attributes: ['id', 'Cantidad_Producto', 'Precio_Unitario', 'Subtotal_Compra'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto']
                }
            }]
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        res.status(200).send({ purchaseInvoice });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para eliminar un producto de la compra en proceso
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Función para buscar producto (find_product.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteProductIdPurchaseInvoice = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const product = await findProduct(id);
        const statePurchaseInvoice = await findState("En proceso");
        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            }
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Compra no encontrada." });
        }

        const purchaseDetail = await PurchaseDetailModel.findOne({
            where: {
                ID_Factura_Compra_FK: purchaseInvoice.id,
                ID_Producto_FK: product.id
            }
        });

        if (!purchaseDetail) {
            return res.status(404).send({ error: "El producto no existe en la compra." });
        }

        purchaseInvoice.Total_Factura -= purchaseDetail.Subtotal_Compra;
        product.Cantidad_Stock -= purchaseDetail.Cantidad_Producto;
        await purchaseInvoice.save();
        await product.save();
        await purchaseDetail.destroy();

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
 * Función para eliminar la compra en proceso
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Modelo Producto (product.js),
 *              Función para buscar estado (find_state.js)
 */

const deletePurchaseInvoiceProcess = async (req, res) => {
    try {
        const { user } = req;

        const statePurchaseInvoice = await findState("En proceso");

        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            },
            include: [{
                model: PurchaseDetailModel,
                as: 'detalles_compra',
                include: {
                    model: ProductModel,
                    as: 'producto',
                }
            }]
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        const inactivePurchaseInvoice = await findState('Cancelado');

        for (const detail of purchaseInvoice.detalles_compra) {
            const product = await ProductModel.findByPk(detail.producto.id);

            if (product) {
                product.Cantidad_Stock -= detail.Cantidad_Producto;
                await product.save();
            }
        }

        purchaseInvoice.ID_Estado_FK = inactivePurchaseInvoice.id;
        await purchaseInvoice.save();

        res.status(200).send({ msg: "La compra ha sido cancelada con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para procesar compra y generar inventario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js),
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Modelo Producto (product.js),
 *              Función para buscar estado (find_state.js),
 *              Modelo Inventario (inventory.js)
 */

const changePurchaseInvoiceComplete = async (req, res) => {
    try {
        const { user } = req;

        const statePurchaseInvoice = await findState("En proceso");
        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            },
            attributes: ['id', 'Total_Factura'],
            include: [{
                model: PurchaseDetailModel,
                as: 'detalles_compra',
                attributes: ['id', 'Cantidad_Producto', 'Precio_Unitario', 'Subtotal_Compra'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto']
                }
            }]
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Compra no encontrada." });
        }

        const changeSalesStatus = await findState('Completado');

        for (const purchaseDetail of purchaseInvoice.detalles_compra) {
            const product = await ProductModel.findByPk(purchaseDetail.producto.id);

            if (product) {
                const inventoryEntry = await InventoryModel.create({
                    Tipo_Movimiento: 'Compra',
                    Cantidad_Movimiento: purchaseDetail.Cantidad_Producto,
                    Monto_Movimiento: purchaseInvoice.Total_Factura,
                    ID_Empleado_FK: user.id,
                    ID_Producto_FK: product.id,
                });

                if (!inventoryEntry) {
                    return res.status(500).send({ error: "Error al crear el registro de inventario." });
                }
            }
        }

        purchaseInvoice.ID_Estado_FK = changeSalesStatus.id;
        await purchaseInvoice.save();

        res.status(200).send({ msg: "Compra completada." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addPurchaseInvoice,
    readPurchaseInvoiceProcess,
    deleteProductIdPurchaseInvoice,
    deletePurchaseInvoiceProcess,
    changePurchaseInvoiceComplete
}