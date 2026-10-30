import { getWorkbook } from './excel/workbook.js';
import { isValidDateString, createOutputPath } from './utils/utils.js';
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

  processFile(fileToProcess, previousBillingCycleStart);
}

/**
 * @param {string} fileName
 * @param {string} previousCycleStart
 */
async function processFile(fileName, previousCycleStart) {
  const fechaInicioMesAnterior = new Date(previousCycleStart);

  const workbook = await getWorkbook(fileName);
  const worksheet = workbook.worksheets[0];

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

main();
