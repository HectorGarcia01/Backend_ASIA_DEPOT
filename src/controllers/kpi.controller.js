const CustomerModel = require('../models/customer');
const findState = require('../utils/find_state');


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

module.exports = {
    KPICustomer
};