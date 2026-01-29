const Excel = require('exceljs');

async function processFile(file) {
  const units = ['mbps', 'gbps'];

  const wb = new Excel.Workbook();
  await wb.xlsx.readFile(file);

  if (!wb) return;

  //selecting the ws
  const ws = wb.worksheets[0];
  const wsProperties = {
    columns: ws.columns.length,
    rows: ws.rowCount,
  };

  //adding new columns
  console.log('adding new columns');
  const row = ws.getRow(1);
  row.getCell(wsProperties.columns + 1).value = 'SDWAN Capacidad';
  row.getCell(wsProperties.columns + 2).value = 'Nuevo Servicio';
  row.getCell(wsProperties.columns + 3).value = 'Nombre Ubicacion';

  let serviceColumn = 0;
  ws.getRow(1).eachCell((cell, col) => {
    if (cell.value === 'SERVICIO') {
      serviceColumn = col;
    }
  });

  if (serviceColumn == 0) {
    console.log('No se pudo determinar la columna con los servicios');
    return;
  }

  //console.log(serviceColumn);
  // const services = ws.getColumn(serviceColumn);
  // services.eachCell((cell) => {
  //   const cellValues = cell.value.split(' ');
  //   const values = cellValues.filter((value) => {
  //     if (!isNaN(value)) {
  //       return value;
  //     }
  //   });
  // });

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const service = row.getCell(8).value.split(' ');
    const serviceValue = service.find((value) => {
      if (!isNaN(value)) {
        return value;
      }
    });

    const serviceUnit = service.find((value) => {
      if (units.includes(value.toLowerCase())) return value;
    });

    row.getCell(23).value = `${serviceValue} ${serviceUnit}`;
  });

  ws.eachRow((row) => console.log(row.getCell(23).value));
  await wb.xlsx.writeFile('data/Informe_vip_bco_guayaquil_202601.xlsx');
}

processFile('Informe_vip_bco_guayaquil_202601.xlsx');
