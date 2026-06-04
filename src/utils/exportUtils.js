import * as XLSX from 'xlsx';

export function exportRowsToExcel(rows = [], columns = [], filename = 'export.xlsx', sheetName = 'Sheet1') {
  const sheet = XLSX.utils.json_to_sheet(
    rows.map((row) =>
      columns.reduce((acc, column) => {
        acc[column.label] = typeof column.value === 'function' ? column.value(row) : row[column.value];
        return acc;
      }, {}),
    ),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
