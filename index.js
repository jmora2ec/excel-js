import ExcelJs from 'exceljs';

let fileToProcess = process.argv[2];
let dateReference = process.argv[3];

async function processFile(fileName, dateReference) {
  const fechaMesAnterior = new Date(dateReference);

  const units = ['mbps', 'gbps'];
  let fechaDesde = new Date(0);
  let fechaAlta = new Date(0);
  let count = 0;

  let columnIndices = {
    servicio: 0,
    capacidad: 0,
    nuevoServicio: 0,
    rubro: 0,
    fechaAlta: 0,
    fechaDesde: 0,
    nombreSucursal: 0,
  };

  const capacidades = [
    ' 1 mbps',
    ' 1 Mbps',
    '12 mbps',
    ' 4 mbps',
    '6 mbps',
    '8 mbps',
    '5 mbps',
    '10 mbps',
    ' 2 mbps',
    '15 mbps',
    '20 mbps',
    '24 mbps',
    '25 mbps',
    '50 mbps',
    '60 mbps',
    '100 mbps',
    '150 mbps',
    '150mbps',
    '200 mbps',
    '300 mbps',
    '600 mbps',
    '1 gbps',
  ];

  const workbook = new ExcelJs.Workbook();
  try {
    await workbook.xlsx.readFile(fileToProcess);
  } catch (error) {
    console.log(`Runtime error: ${error.message}`);
    return;
  }

  if (!workbook) {
    console.log('No se puedo abrir archivo');
    return;
  }

  //selecting the ws
  const worksheet = workbook.worksheets[0];
  const worksheetProperties = {
    columns: worksheet.actualColumnCount,
    rows: worksheet.rowCount,
  };

  //getting the column index for SERVICIO
  console.log(`Determinando donde insertar nuevas columnas`);

  worksheet.eachRow((row, rownumber) => {
    if (rownumber > 1) return;
    row.eachCell((cell, colNumber) => {
      if (cell.value?.toString().toUpperCase() === 'SERVICIO') {
        worksheet.spliceColumns(
          colNumber + 1,
          0,
          ['Capacidad_Enlace'],
          ['Nuevo_Servicio'],
        );
      }

      if (cell.value?.toString().toLocaleUpperCase() === 'NOMSUC') {
        worksheet.spliceColumns(colNumber + 1, 0, ['Nombre_Sucursal']);
      }
    });
  });
  //adding new columns

  console.log('Añadiendo columnas');

  console.log('Recuperarndo indices de columnas');

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

  //Obteninedo datos de servicios
  const rows = worksheet.getRows(2, worksheet.rowCount - 1);
  console.log('Procesando registros...');

  rows?.forEach((row, index) => {
    count++;
    const servicio = row
      .getCell(columnIndices.servicio)
      .value?.toString()
      .toLocaleLowerCase();
    // busca coincidencia en arreglo de enlaces

    let found = false;

    capacidades.forEach((capacidad) => {
      if (servicio.includes(capacidad)) {
        found = true;
        row.getCell(columnIndices.capacidad).value = capacidad;
      }
    });
    if (!found) {
      row.getCell(columnIndices.capacidad).value = servicio;
    }
    //determinando si servicio es nuevo

    if (row.getCell(columnIndices.fechaDesde).value) {
      fechaAlta = new Date(row.getCell(columnIndices.fechaAlta));
      fechaDesde = new Date(row.getCell(columnIndices.fechaDesde));

      // console.log(
      //   fechaAlta.toString(),
      //   fechaDesde.toString(),
      //   fechaMesAnterior.toString(),
      // );

      if (fechaAlta < fechaMesAnterior) {
        row.getCell(columnIndices.nuevoServicio).value = 'NO';
      }
      if (fechaAlta >= fechaMesAnterior && fechaDesde > fechaMesAnterior) {
        row.getCell(columnIndices.nuevoServicio).value = 'SI';
      }

      if (
        fechaAlta >= fechaMesAnterior &&
        fechaDesde.getUTCMonth() === fechaMesAnterior.getUTCMonth()
      ) {
        row.getCell(columnIndices.nuevoServicio).value = 'SI Proporcional';
      }
    } else {
      fechaAlta = new Date(row.getCell(columnIndices.fechaAlta));
      if (fechaAlta < fechaMesAnterior) {
        row.getCell(columnIndices.nuevoServicio).value = 'NO';
      }
      if (fechaAlta >= fechaMesAnterior) {
        row.getCell(columnIndices.nuevoServicio).value = 'SI';
      }

      const rubro = row.getCell(columnIndices.rubro).value;

      const specialsRubros = [
        'Instalacion',
        'Suscripcion',
        'Instalación',
        'Suscripción',
      ];

      specialsRubros.some((word) => {
        if (rubro.normalize('NFC').includes(word)) {
          row.getCell(columnIndices.nuevoServicio).value = 'SI Suscripcion';
        }
      });
    }
  });

  console.log(`Registros procesados ${count}`);
  await workbook.xlsx.writeFile(
    `${fileToProcess.substring(0, fileToProcess.length - 5)}_modified.xlsx`,
  );
}

processFile(fileToProcess, dateReference);
