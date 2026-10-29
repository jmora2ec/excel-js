import { getWorkbook } from './excel/workbook.js';
import { isValidDateString, createOutputPath } from './utils/utils.js';
import { getColumnIndices, addOutputColumns } from './excel/columns.js';
import { processRows } from './excel/processRow.js';

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
    throw new Error('Formato o fecha ciclo anterior no válido.');
  }

  const fechaInicioMesAnterior = new Date(previousCycleStart);

  const workbook = await getWorkbook(fileName);
  const worksheet = workbook.worksheets[0];

  //add outputColumns(ws)
  console.log(`Determinando donde insertar nuevas columnas`);
  const outputColumns = addOutputColumns(worksheet);
  console.log(outputColumns);

  console.log(`Determinando columnas de datos actuales`);
  const inputColumns = getColumnIndices(worksheet);
  console.log(inputColumns);

  //process Rows
  //Obteniendo datos de servicios
  console.log('Procesando registros...');

  const count = processRows(
    worksheet,
    inputColumns,
    outputColumns,
    fechaInicioMesAnterior,
  );

  console.log(`${count} registros procesados.`);

  const outputPath = createOutputPath(fileName);

  await workbook.xlsx.writeFile(outputPath);
}

processFile(fileToProcess, previousBillingCycleStart);
