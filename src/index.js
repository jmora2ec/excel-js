import ExcelJs from 'exceljs';
import { getWorkbook } from './excel/workbook.js';
import { isValidDateString } from './utils/date.js';
import { esNuevoServicio, extractCapacity } from './domain/services.js';
import { tipoFacturacion, SPECIAL_RUBROS } from './domain/billing.js';
import { getColumnIndices, addOutputColumns } from './excel/columns.js';

let fileToProcess = process.argv[2];
let previousBillingCycleStart = process.argv[3];

/**
 * @param {string} fileName
 * @param {string} previousCycleStart
 */
async function processFile(fileName, previousCycleStart) {
  if (!isValidDateString(previousCycleStart)) {
    console.log(
      'Fecha o formato fecha mes anterior no es correcto, ingrese yyyy-mm-dd',
    );
    return;
  }
  const fechaInicioMesAnterior = new Date(previousCycleStart);

  const workbook = await getWorkbook(fileName);

  const worksheet = workbook.worksheets[0];

  //add outputColumns(ws)
  console.log(`Determinando donde insertar nuevas columnas`);

  const outputColumns = addOutputColumns(worksheet);

  //Recuperarndo indices de columnas para referencias
  console.log(outputColumns);

  const inputColumns = getColumnIndices(worksheet);
  console.log(inputColumns);

  //process Rows
  //Obteniendo datos de servicios
  const rows = worksheet.getRows(2, worksheet.rowCount - 1);
  console.log('Procesando registros...');

  let count = 0;

  rows?.forEach((row) => {
    count++;
    const servicio = row.getCell(inputColumns.servicio).value?.toString();
    // Determinando capacidad de servicios en nueva columna
    row.getCell(outputColumns.capacidadEnlace).value =
      extractCapacity(servicio);

    //determinando si servicio es nuevo

    const fechaAlta = new Date(row.getCell(inputColumns.fechaAlta).value);
    row.getCell(outputColumns.nuevoServicio).value = esNuevoServicio(
      fechaAlta,
      fechaInicioMesAnterior,
    )
      ? 'SI'
      : 'NO';

    if (row.getCell(inputColumns.fechaDesde).value) {
      const fechaDesde = new Date(row.getCell(inputColumns.fechaDesde).value);

      row.getCell(outputColumns.tipoFacturacion).value = tipoFacturacion(
        fechaAlta,
        fechaDesde,
      );
    } else {
      const rubroText = row.getCell(inputColumns.rubro).value.normalize('NFC');

      if (SPECIAL_RUBROS.some((word) => rubroText.includes(word))) {
        row.getCell(outputColumns.tipoFacturacion).value = 'Suscripcion';
      } else {
        row.getCell(outputColumns.tipoFacturacion).value = 'Otro';
      }
    }
  });

  console.log(`Registros procesados ${count}`);

  await workbook.xlsx.writeFile(
    `${fileName.substring(0, fileName.length - 5)}_modified.xlsx`,
  );
}

processFile(fileToProcess, previousBillingCycleStart);
