const Sequelize = require('sequelize');

/**
 * Función para construir el objeto where de la consulta
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

const buildWhereClause = async (query) => {
    const where = {};

    if (query.nombre) {
        where[Sequelize.Op.or] = [
            {
                Nombre_Producto: {
                    [Sequelize.Op.like]: `%${query.nombre}%`
                }
            },
            {
                Precio_Compra: query.nombre
            },
            {
                Precio_Venta: query.nombre
            },
            {
                Descripcion_Producto: {
                    [Sequelize.Op.like]: `%${query.nombre}%`
                }
            },
            {
                Codigo_Barras: {
                    [Sequelize.Op.like]: `%${query.nombre}%`
                }
            }
        ];
    }

    if (!query.nombre) {
        delete where[Sequelize.Op.or];
    }

    return where;
}

module.exports = buildWhereClause;