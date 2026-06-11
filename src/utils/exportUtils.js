import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function escapeCsv(value) {
  const text = String(value ?? '');
  if (/["\n,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function getCellValue(row, column) {
  return typeof column.value === 'function' ? column.value(row) : row?.[column.value];
}

function normalizeSheetDefinition(sheetDef = {}) {
  const rows = Array.isArray(sheetDef.rows) ? sheetDef.rows : [];
  const columns =
    Array.isArray(sheetDef.columns) && sheetDef.columns.length
      ? sheetDef.columns
      : rows.length
        ? Object.keys(rows[0]).map((key) => ({ label: key, value: key }))
        : [];

  return {
    name: sheetDef.name || 'Sheet1',
    rows,
    columns,
  };
}

function rowsToSheetObject(rows = [], columns = []) {
  return (Array.isArray(rows) ? rows : []).map((row) =>
    (Array.isArray(columns) ? columns : []).reduce((acc, column) => {
      acc[column.label] = getCellValue(row, column);
      return acc;
    }, {}),
  );
}

function rowsToCsvSection(sheetDef = {}) {
  const sheet = normalizeSheetDefinition(sheetDef);
  const lines = [`Section,${escapeCsv(sheet.name)}`];

  if (!sheet.columns.length) {
    lines.push('No data available');
    return lines;
  }

  lines.push(sheet.columns.map((column) => escapeCsv(column.label)).join(','));
  sheet.rows.forEach((row) => {
    lines.push(sheet.columns.map((column) => escapeCsv(getCellValue(row, column))).join(','));
  });
  return lines;
}

function rowsToHtmlTable(rows = [], columns = []) {
  const headerMarkup = columns.map((column) => `<th>${column.label}</th>`).join('');
  const bodyMarkup = rows
    .map(
      (row) => `
        <tr>
          ${columns
            .map((column) => `<td>${String(getCellValue(row, column) ?? '')}</td>`)
            .join('')}
        </tr>
      `,
    )
    .join('');

  return `
    <table>
      <thead>
        <tr>${headerMarkup}</tr>
      </thead>
      <tbody>${bodyMarkup}</tbody>
    </table>
  `;
}

export function exportRowsToExcel(rows = [], columns = [], filename = 'export.xlsx', sheetName = 'Sheet1') {
  const sheet = XLSX.utils.json_to_sheet(rowsToSheetObject(rows, columns));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

export function exportWorkbookToExcel(sheets = [], filename = 'export.xlsx') {
  const workbook = XLSX.utils.book_new();

  sheets.map(normalizeSheetDefinition).forEach((sheetDef) => {
    const worksheet = XLSX.utils.json_to_sheet(rowsToSheetObject(sheetDef.rows, sheetDef.columns));
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetDef.name);
  });

  XLSX.writeFile(workbook, filename);
}

export function exportRowsToCsv(rows = [], columns = [], filename = 'export.csv') {
  const header = (Array.isArray(columns) ? columns : []).map((column) => escapeCsv(column.label)).join(',');
  const body = (Array.isArray(rows) ? rows : [])
    .map((row) => (Array.isArray(columns) ? columns : []).map((column) => escapeCsv(getCellValue(row, column))).join(','))
    .join('\n');

  const csv = [header, body].filter(Boolean).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportWorkbookToCsv(sheets = [], filename = 'export.csv') {
  const lines = [];

  sheets.map(normalizeSheetDefinition).forEach((sheetDef, index) => {
    if (index > 0) {
      lines.push('');
      lines.push('');
    }

    lines.push(`Section,${escapeCsv(sheetDef.name)}`);

    if (!sheetDef.columns.length) {
      lines.push('No data available');
      return;
    }

    lines.push(sheetDef.columns.map((column) => escapeCsv(column.label)).join(','));
    sheetDef.rows.forEach((row) => {
      lines.push(sheetDef.columns.map((column) => escapeCsv(getCellValue(row, column))).join(','));
    });
  });

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRowsToPdf({ title = 'Report', subtitle = '', rows = [], columns = [], filename } = {}) {
  const list = Array.isArray(rows) ? rows : [];
  const cols = Array.isArray(columns) ? columns : [];
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 28;
  const headerBottom = subtitle ? margin + 34 : margin + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, margin, margin + 6);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(subtitle, margin, margin + 22);
    doc.setTextColor(15, 23, 42);
  }

  autoTable(doc, {
    startY: headerBottom + 16,
    head: [cols.map((column) => column.label)],
    body: list.map((row) => cols.map((column) => String(getCellValue(row, column) ?? ''))),
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      lineColor: [203, 213, 225],
      lineWidth: 0.5,
    },
    bodyStyles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: [250, 252, 255],
    },
    margin: { left: margin, right: margin },
    theme: 'grid',
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      doc.setTextColor(15, 23, 42);
    },
  });

  doc.save(filename || filenameFromTitle(title, 'pdf'));
}

export function exportWorkbookToPdf({ title = 'Report', subtitle = '', sheets = [], filename } = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 28;
  const normalizedSheets = (Array.isArray(sheets) ? sheets : []).map(normalizeSheetDefinition);
  const sectionStart = subtitle ? margin + 52 : margin + 38;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, margin, margin + 6);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(subtitle, margin, margin + 22);
    doc.setTextColor(15, 23, 42);
  }

  normalizedSheets.forEach((sheetDef, index) => {
    if (index > 0) doc.addPage();

    let sectionY = sectionStart;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(sheetDef.name, margin, sectionY);

    if (!sheetDef.columns.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('No data available.', margin, sectionY + 18);
      doc.setTextColor(15, 23, 42);
      return;
    }

    autoTable(doc, {
      startY: sectionY + 14,
      head: [sheetDef.columns.map((column) => column.label)],
      body: sheetDef.rows.map((row) => sheetDef.columns.map((column) => String(getCellValue(row, column) ?? ''))),
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak',
        valign: 'top',
      },
      headStyles: {
        fillColor: [248, 250, 252],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        lineColor: [203, 213, 225],
        lineWidth: 0.5,
      },
      bodyStyles: {
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 252, 255],
      },
      margin: { left: margin, right: margin },
      theme: 'grid',
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.setTextColor(15, 23, 42);
      },
    });
  });

  doc.save(filename || filenameFromTitle(title, 'pdf'));
}

function filenameFromTitle(title, extension) {
  const safe = String(title || 'export')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'export';
  return `${safe}.${extension}`;
}
