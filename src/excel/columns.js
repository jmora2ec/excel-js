export function getColumnIndices(worksheet) {
  const columns = {
    servicio: null,
    rubro: null,
    fechaAlta: null,
    fechaDesde: null,
    nombreSucursal: null,
  };

  const headerRow = worksheet.getRow(1);

  headerRow.eachCell((cell, colNumber) => {
    switch (cell.value?.toString().toLowerCase()) {
      case 'servicio':
        columns.servicio = colNumber;
        break;
      case 'alta':
        columns.fechaAlta = colNumber;
        break;
      case 'rubro':
        columns.rubro = colNumber;
        break;
      case 'desde':
        columns.fechaDesde = colNumber;
        break;
      case 'nomsuc':
        columns.nombreSucursal = colNumber;
        break;
    }
  });
  validateColumns(columns);
  return columns;
}

function validateColumns(columns) {
  const missing = Object.entries(columns)
    .filter(([, value]) => value === null)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`There are missing values for ${missing.join(', ')}`);
  }
}

export function addOutputColumns(worksheet) {
  const columns = {
    capacidadEnlace: null,
    nuevoServicio: null,
    tipoFacturacion: null,
  };

  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    if (cell.value?.toString().toUpperCase() === 'SERVICIO') {
      worksheet.spliceColumns(
        colNumber + 1,
        0,
        ['Capacidad_Enlace'],
        ['Nuevo_Servicio'],
        ['Tipo_Facturacion'],
      );
      columns.capacidadEnlace = colNumber + 1;
      columns.nuevoServicio = colNumber + 2;
      columns.tipoFacturacion = colNumber + 3;
    }
  });
  worksheet.spliceColumns(worksheet.columnCount - 1, 0, ['Nombre_Sucursal']);
  return columns;
}
