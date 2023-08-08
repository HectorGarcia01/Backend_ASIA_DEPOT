/**
 * Función para crear errores personalizados en los esquemas
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

const errorPersonalizado = (mensaje, detalle) => {
    const error = new Error(mensaje);
    error.detalle = detalle;

    return error;
};

//Exportación de la función de errores personalizados
module.exports = errorPersonalizado;