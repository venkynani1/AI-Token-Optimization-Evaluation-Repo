// Zero-dependency CSV export for the analytics table.
// Pure functions (buildCsv, formatCell) are separated from the browser
// side effect (downloadCsv) so they can be unit-tested without a DOM.

/**
 * @typedef {Object} Column
 * @property {string}  id        Row key to read.
 * @property {string}  header    Header label shown in the table.
 * @property {boolean} [hidden]  Hidden columns are never exported.
 * @property {'date'|'string'|'number'} [type]
 * @property {(row:Object)=>any} [accessor] Optional custom value getter.
 */

/** Convert a Date / timestamp / date string to ISO 8601. */
export function toIso8601(value) {
  if (value === null || value === undefined || value === '') return '';
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString();
}

/** Escape one cell per RFC 4180 and neutralise spreadsheet formula injection. */
export function escapeCell(raw) {
  if (raw === null || raw === undefined) return '';
  let s = String(raw);
  if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function formatCell(row, column) {
  const value = column.accessor ? column.accessor(row) : row[column.id];
  if (column.type === 'date' || value instanceof Date) return toIso8601(value);
  return value;
}

/**
 * Build CSV text.
 * @param {Object[]} visibleRows Rows exactly as displayed: ALREADY filtered and sorted.
 * @param {Column[]} columns     Columns in current display order.
 */
export function buildCsv(visibleRows, columns) {
  const cols = columns.filter((c) => !c.hidden);
  const lines = [cols.map((c) => escapeCell(c.header)).join(',')];
  for (const row of visibleRows) {
    lines.push(cols.map((c) => escapeCell(formatCell(row, c))).join(','));
  }
  return lines.join('\r\n');
}

/** Trigger a browser download using only built-in Web APIs. */
export function downloadCsv(csv, filename = 'analytics-export.csv') {
  // BOM so Excel opens UTF-8 correctly.
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCsv(visibleRows, columns, filename) {
  downloadCsv(buildCsv(visibleRows, columns), filename);
}
