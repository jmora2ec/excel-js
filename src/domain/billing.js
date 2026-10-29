import { sameMonth } from '../utils/utils.js';

const SPECIAL_RUBROS = ['Instalacion', 'Suscripcion'];

/**
 * @param {  Date} fechaAlta
 * @param {Date} fechaDesde
 */
function tipoFacturacion(fechaAlta, fechaDesde) {
  //si fecha alta y fechadesde sameMonth es true -> proporcional
  if (sameMonth(fechaAlta, fechaDesde) && fechaAlta <= fechaDesde)
    return 'Proporcional';
  //si fecha Alta < fechaDesde -> Corriente
  if (fechaAlta < fechaDesde) return 'Corriente';

  return 'No Determinado';
}

export { tipoFacturacion, SPECIAL_RUBROS };
