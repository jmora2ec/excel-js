const CAPACITY_REGEX = /(\d+)\s*(mbps|gbps)/i;

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

export { esNuevoServicio, extractCapacity };
