const Sequelize = require('sequelize');
const CustomerModel = require('../models/customer');
const findState = require('../utils/find_state');
const SalesInvoiceModel = require('../models/sales_invoice');
const ProductModel = require('../models/product');

const KPICustomer = async (req, res) => {
    try {
        const activeStatus = await findState('Activo');
        const penddingStatus = await findState('Pendiente');
        const inactiveStatus = await findState('Inactivo');

        const activeCustomers = await CustomerModel.count({ where: { ID_Estado_FK: activeStatus.id } });
        const penddingCustomers = await CustomerModel.count({ where: { ID_Estado_FK: penddingStatus.id } });
        const inactiveCustomers = await CustomerModel.count({ where: { ID_Estado_FK: inactiveStatus.id } });

        res.status(200).send({ activeCustomers, penddingCustomers, inactiveCustomers });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

const KPISales = async (req, res) => {
    try {
        const result = await SalesInvoiceModel.sum('Total_Factura');

        res.status(200).send({ result });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

const KPIProducts = async (req, res) => {
    try {
        const products = await ProductModel.findAll({
            where: {
                Cantidad_Stock: {
                    [Sequelize.Op.lt]: 20
                }
            }
        });

        res.status(200).send({ products });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

const KPICustomerCount = async (req, res) => {
    try {
        const today = new Date();
        const beginningWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        
        const count = await CustomerModel.count({
            where: {
                createdAt: {
                    [Sequelize.Op.gte]: beginningWeek
                }
            }
        });

        res.status(200).send({ count });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    KPICustomer,
    KPISales,
    KPIProducts, 
    KPICustomerCount
};