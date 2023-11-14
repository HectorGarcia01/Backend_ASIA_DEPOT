const SalesInvoiceModel = require('../models/sales_invoice');
const SalesDetailModel = require('../models/sales_detail');
const ProductModel = require('../models/product');
const EmployeeModel = require('../models/employee');
const InventoryModel = require('../models/inventory');
const StateModel = require('../models/state');
const findState = require('../utils/find_state');

/**
 * Función para ver todas las ventas
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js),
 *              Función para buscar estado (find_state.js)
 */

const readSalesInvoices = async (req, res) => {
    try {
        const { page, pageSize, estado } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 10;
        const where = {};

        if (estado) {
            const stateSalesInvoice = await findState(estado);
            where.ID_Estado_FK = stateSalesInvoice.id
        }

        const count = await SalesInvoiceModel.count();
        const salesInvoice = await SalesInvoiceModel.findAll({
            where,
            attributes: ['id', 'Numero_Orden', 'Total_Factura', 'createdAt'],
            include: [{
                model: EmployeeModel,
                as: 'empleado',
                attributes: ['id', 'Nombre_Empleado', 'Apellido_Empleado']
            }, {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }],
            order: [['createdAt', 'DESC']],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (salesInvoice.length === 0) {
            return res.status(404).send({ error: "No hay ninguna venta registrada." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);
        res.status(200).send({ salesInvoice, currentPage: pageValue, totalPages });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el detalle de venta por id
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js)
 *              Modelo Estado (state.js)
 */

const readSalesInvoiceId = async (req, res) => {
    try {
        const { id } = req.params;

        const salesInvoice = await SalesInvoiceModel.findByPk(id, {
            attributes: ['id', 'Numero_Orden', 'Total_Factura', 'createdAt'],
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                attributes: ['id', 'Cantidad_Producto', 'Precio_Unitario', 'Subtotal_Venta'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto']
                }
            },
            {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }]
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Detalle de venta no encontrado." });
        }

        res.status(200).send({ salesInvoice });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para cambiar estado de la venta (pendiente -> en proceso)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js),
 *              Función para buscar estado (find_state.js)
 */

const changeSalesInvoiceProcess = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const stateSalesInvoice = await findState('Pendiente');
        const salesInvoice = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Estado_FK: stateSalesInvoice.id
            }
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Venta no encontrada." });
        }

        const changeSalesStatus = await findState("En proceso");

        salesInvoice.ID_Estado_FK = changeSalesStatus.id;
        salesInvoice.ID_Empleado_FK = user.id;
        await salesInvoice.save();

        //*************Se podría implementar una lógica para enviar el correo de que ya fue completado su pedido */
        res.status(200).send({ msg: "Venta en proceso." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para cambiar estado de la venta y generar inventario (en proceso -> completo)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js),
 *              Modelo Inventario (inventory.js),
 *              Función para buscar estado (find_state.js)
 */

const changeSalesInvoiceComplete = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const stateSalesInvoice = await findState("En proceso");
        const salesInvoice = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Empleado_FK: user.id,
                ID_Estado_FK: stateSalesInvoice.id
            },
            attributes: ['id', 'Total_Factura'],
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                attributes: ['id', 'Cantidad_Producto', 'Precio_Unitario', 'Subtotal_Venta'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto']
                }
            },
            {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }]
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Venta no encontrada." });
        }

        const changeSalesStatus = await findState('Completado');

        for (const salesDetail of salesInvoice.detalles_venta) {
            const product = await ProductModel.findByPk(salesDetail.producto.id);

            if (product) {
                const inventoryEntry = await InventoryModel.create({
                    Tipo_Movimiento: 'Venta',
                    Cantidad_Movimiento: salesDetail.Cantidad_Producto,
                    Monto_Movimiento: salesInvoice.Total_Factura,
                    ID_Empleado_FK: user.id,
                    ID_Producto_FK: product.id,
                });

                if (!inventoryEntry) {
                    return res.status(500).send({ error: "Error al crear el registro de inventario." });
                }
            }
        }

        salesInvoice.ID_Estado_FK = changeSalesStatus.id;
        await salesInvoice.save();

        //*************Se podría implementar una lógica para enviar el correo de que ya fue completado su pedido */
        res.status(200).send({ msg: "Venta completada." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    readSalesInvoices,
    readSalesInvoiceId,
    changeSalesInvoiceProcess,
    changeSalesInvoiceComplete
}