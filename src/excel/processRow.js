import { SPECIAL_RUBROS, tipoFacturacion } from '../domain/billing.js';
import { esNuevoServicio, extractCapacity } from '../domain/services.js';

export function processRows(
  worksheet,
  inputColumns,
  outputColumns,
  previousCycleDate,
) {
  let count = 0;
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const data = readRow(row, inputColumns);
    const result = calculateRow(row, data, previousCycleDate);
    writeRow(row, outputColumns, result);
    count++;
  });

  return count;
}

function readRow(row, columns) {
  return {
    servicio: row.getCell(columns.servicio).value.toString(),
    alta: new Date(row.getCell(columns.fechaAlta).value),
    desde: new Date(row.getCell(columns.fechaDesde).value),
    rubro: row
      .getCell(columns.rubro)
      .value.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''),
    nomsuc: row.getCell(columns.nombreSucursal).value,
  };
}

function calculateRow(row, data, date) {
  let tipofac = 'No determinado';

  if (data.desde.getFullYear() < date.getFullYear()) {
    if (SPECIAL_RUBROS.some((rubro) => data.rubro.includes(rubro))) {
      tipofac = 'Suscripcion';
    } else {
      tipofac = 'Otros';
    }
  } else {
    tipofac = tipoFacturacion(data.alta, data.desde);
  }
  return {
    capacidadEnlace: extractCapacity(data.servicio),
    nuevoServicio: esNuevoServicio(data.alta, date) ? 'SI' : 'NO',
    tipoFacturacion: tipofac,
  };
}

function writeRow(row, columns, data) {
  row.getCell(columns.capacidadEnlace).value = data.capacidadEnlace;
  row.getCell(columns.nuevoServicio).value = data.nuevoServicio;
  row.getCell(columns.tipoFacturacion).value = data.tipoFacturacion;
}
