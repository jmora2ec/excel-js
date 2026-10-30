import { getWorkbook } from './excel/workbook.js';
import {
  isValidDateString,
  createOutputPath,
  isValidFile,
} from './utils/utils.js';
import { getColumnIndices, addOutputColumns } from './excel/columns.js';
import { processRows } from './excel/processRow.js';

function main() {
  const [, , fileToProcess, previousBillingCycleStart] = process.argv;

  if (!fileToProcess || !previousBillingCycleStart) {
    console.log('Nombre archivo y/o fecha ciclo anterior no proporcionado.');
    return;
  }

  if (!isValidDateString(previousBillingCycleStart)) {
    throw new Error('Formato (yyyy-mm-dd) o fecha ciclo anterior no válido.');
  }

  if (!isValidFile(fileToProcess)) {
    throw new Error('file name or path is not valid.');
  }

  processFile(fileToProcess, new Date(previousBillingCycleStart));
}

/**
 * @param {string} fileName
 * @param {Date} previousCycleStartDate
 */
async function processFile(fileName, previousCycleStartDate) {
  const workbook = await getWorkbook(fileName);
  const worksheet = workbook.worksheets[0];

  console.log(`Determinando donde insertar nuevas columnas`);
  const outputColumns = addOutputColumns(worksheet);
  console.log(outputColumns);

  console.log(`Determinando columnas de datos actuales`);
  const inputColumns = getColumnIndices(worksheet);
  console.log(inputColumns);

  //Obteniendo datos de servicios
  console.log('Procesando registros...');

  const count = processRows(
    worksheet,
    inputColumns,
    outputColumns,
    previousCycleStartDate,
  );

  console.log(`${count} registros procesados.`);

  const outputPath = createOutputPath(fileName);

  await workbook.xlsx.writeFile(outputPath);
}

main();
