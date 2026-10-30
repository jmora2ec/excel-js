import path from 'node:path';
import fs from 'node:fs';
//check if 2 dates are in the same month of the year

/**
 * @param {Date} a
 * @param {Date} b
 */
function sameMonth(a, b) {
  return (
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCFullYear() === b.getUTCFullYear()
  );
}

//valida que el formato sea adecuado
/**
 * @param {string} dateString
 */
function isValidDateString(dateString) {
  // Assumes YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);

  // Note: JavaScript months are 0-indexed (0 = January, 11 = December)
  const date = new Date(year, month - 1, day);

  // Check if JavaScript had to auto-correct/roll over any numbers
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDay() === day
  );
}

function createOutputPath(fileName) {
  const fullPath = path.join(
    path.dirname(fileName),
    `${path.basename(fileName, '.xlsx')}_processed.xlsx`,
  );
  return fullPath;
}

function isValidFile(fileName) {
  if (fs.existsSync(fileName)) {
    return true;
  }
  return false;
}

export { sameMonth, isValidDateString, createOutputPath, isValidFile };
