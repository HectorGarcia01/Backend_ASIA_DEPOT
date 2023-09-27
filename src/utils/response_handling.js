/**
 * Función para el manejo de respuestas con estados existosos
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 */

const handleSuccess = (res, status = 200, data = null) => {
    res.status(status).send(data);
};

/**
 * Función para el manejo de respuestas con estados de error
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 */

const handleResponse = (res, status = 500, error = "Error interno del servidor.") => {
    res.status(status).send({ error });
};

//Exportación de las funciones para el manejo de respuestas y estados
module.exports = {
    handleSuccess,
    handleResponse
};
