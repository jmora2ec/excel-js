import ExcelJs from 'exceljs';
import { getWorkbook } from './excel/workbook.js';
import { isValidDateString } from './utils/date.js';
import { esNuevoServicio, extractCapacity } from './domain/services.js';
import { tipoFacturacion, SPECIAL_RUBROS } from './domain/billing.js';

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

  let count = 0;
  let columnIndices = {
    servicio: 0,
    capacidad: 0,
    nuevoServicio: 0,
    tipoFacturacion: 0,
    rubro: 0,
    fechaAlta: 0,
    fechaDesde: 0,
    nombreSucursal: 0,
  };

  const workbook = await getWorkbook(fileName);

  //selecting the ws
  const worksheet = workbook.worksheets[0];

  //getting the column index for SERVICIO
  console.log(`Determinando donde insertar nuevas columnas`);

  worksheet.eachRow((row, rownumber) => {
    if (rownumber > 1) return;
    row.eachCell((cell, colNumber) => {
      if (cell.value?.toString().toUpperCase() === 'SERVICIO') {
        //adding new columns

        console.log('Añadiendo columnas');

        worksheet.spliceColumns(
          colNumber + 1,
          0,
          ['Capacidad_Enlace'],
          ['Nuevo_Servicio'],
          ['Tipo_Facturacion'],
        );
      }
    });
    worksheet.spliceColumns(worksheet.columnCount - 1, 0, ['Nombre_Sucursal']);
  });

  //Recuperarndo indices de columnas para referencias
  console.log('Recuperando indices de columnas');

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) return;

    row.eachCell((cell, colNumber) => {
      switch (cell.value?.toString().toLowerCase()) {
        case 'servicio':
          columnIndices.servicio = colNumber;
          break;
        case 'capacidad_enlace':
          columnIndices.capacidad = colNumber;
          break;
        case 'nuevo_servicio':
          columnIndices.nuevoServicio = colNumber;
          break;
        case 'tipo_facturacion':
          columnIndices.tipoFacturacion = colNumber;
          break;
        case 'alta':
          columnIndices.fechaAlta = colNumber;
          break;
        case 'rubro':
          columnIndices.rubro = colNumber;
          break;
        case 'desde':
          columnIndices.fechaDesde = colNumber;
          break;
        case 'nomsuc':
          columnIndices.nombreSucursal = colNumber;
          break;
      }
    });
  });

  console.log(columnIndices);

  //Obteniendo datos de servicios
  const rows = worksheet.getRows(2, worksheet.rowCount - 1);
  console.log('Procesando registros...');

  rows?.forEach((row) => {
    count++;
    const servicio = row.getCell(columnIndices.servicio).value?.toString();
    // Determinando capacidad de servicios en nueva columna
    row.getCell(columnIndices.capacidad).value = extractCapacity(servicio);

    //determinando si servicio es nuevo

    const fechaAlta = new Date(row.getCell(columnIndices.fechaAlta).value);
    row.getCell(columnIndices.nuevoServicio).value = esNuevoServicio(
      fechaAlta,
      fechaInicioMesAnterior,
    )
      ? 'SI'
      : 'NO';

    if (row.getCell(columnIndices.fechaDesde).value) {
      const fechaDesde = new Date(row.getCell(columnIndices.fechaDesde).value);

      row.getCell(columnIndices.tipoFacturacion).value = tipoFacturacion(
        fechaAlta,
        fechaDesde,
      );
    } else {
      const rubroText = row.getCell(columnIndices.rubro).value.normalize('NFC');

      if (SPECIAL_RUBROS.some((word) => rubroText.includes(word))) {
        row.getCell(columnIndices.tipoFacturacion).value = 'Suscripcion';
      } else {
        row.getCell(columnIndices.tipoFacturacion).value = 'Otro';
      }
    }
  });

  console.log(`Registros procesados ${count}`);

  await workbook.xlsx.writeFile(
    `${fileName.substring(0, fileName.length - 5)}_modified.xlsx`,
  );
}

processFile(fileToProcess, previousBillingCycleStart);
