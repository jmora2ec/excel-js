import ExcelJs from 'exceljs';

async function getWorkbook(fileName = 'sample.xlsx') {
  const workbook = new ExcelJs.Workbook();
  try {
    await workbook.xlsx.readFile(fileName);
    return workbook;
  } catch (error) {
    // @ts-ignore
    throw new Error(`Can not open file ${fileName}`, { cause: error });
  }
}

export { getWorkbook };
