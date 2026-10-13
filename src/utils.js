const CAPACITY_REGEX = /(\d+)\s*(mbps|gbps)/i;
const SPECIAL_RUBROS = [
  'Instalacion',
  'Suscripcion',
  'Instalación',
  'Suscripción',
];

//check if 2 dates are in the same month of the year

/**
 * @param {Date} a
 * @param {Date} b
 */
function sameMonth(a, b) {
  return (
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCFullYear() === b.getUTCFullYear()
  );
}

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

/**
 * @param {  Date} fechaAlta
 * @param { Date} inicioMesAnterior
 */
function esNuevoServicio(fechaAlta, inicioMesAnterior) {
  return fechaAlta >= inicioMesAnterior;
}

//busca formato XX mbps o XX gbps en cadena de caracteres
/**
 * @param {string | undefined} serviceName
 */
function extractCapacity(serviceName, pattern = CAPACITY_REGEX) {
  if (serviceName === undefined || serviceName === '') {
    return 'null';
  }

  const match = serviceName.match(pattern);
  if (!match) {
    return serviceName;
  }

  return `${match[1]} ${match[2].toLowerCase()}`;
}

//valida que el formato sea adecuado
/**
 * @param {string} dateString
 */
function isValidDateString(dateString) {
  // Assumes YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);

  // Note: JavaScript months are 0-indexed (0 = January, 11 = December)
  const date = new Date(year, month - 1, day);

  // Check if JavaScript had to auto-correct/roll over any numbers
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export {
  extractCapacity,
  isValidDateString,
  CAPACITY_REGEX,
  SPECIAL_RUBROS,
  sameMonth,
  esNuevoServicio,
  tipoFacturacion,
};
