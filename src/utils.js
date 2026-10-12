const CAPACITY_REGEX = /(\d+)\s*(mbps|gbps)/i;
const SPECIAL_RUBROS = [
  'Instalacion',
  'Suscripcion',
  'Instalación',
  'Suscripción',
];

function tipoFacturacion(fechaAlta, fechaDesde) {
  //si fecha alta y fechadesde sameMonth es true -> proporcional
  if (sameMonth(fechaAlta, fechaDesde)) return 'Proporcional';
  //si fecha Alta < fechaDesde -> Corriente
  if (fechaAlta < fechaDesde) return 'Corriente';
}

function esNuevoServicio(fechaAlta, inicioMesAnterior) {
  return fechaAlta >= inicioMesAnterior;
}

//check if 2 dates are in the same month

function sameMonth(a, b) {
  return (
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCFullYear() === b.getUTCFullYear()
  );
}

//busca formato XX mbps o XX gbps en cadena de caracteres
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

// const date1 = new Date('2025-12-01');
// const date2 = new Date('2025-12-15');

// console.log(sameMonth(date1, date2));

export {
  extractCapacity,
  isValidDateString,
  CAPACITY_REGEX,
  SPECIAL_RUBROS,
  sameMonth,
  esNuevoServicio,
  tipoFacturacion,
};
