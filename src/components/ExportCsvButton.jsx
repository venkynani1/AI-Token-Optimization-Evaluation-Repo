import React from 'react';
import { exportToCsv } from '../utils/exportToCsv';

/**
 * Read-only export button. It receives the table's *derived* state
 * (rows after filter + sort, columns in display order) and never mutates
 * filter or sort state, so existing table behaviour is untouched.
 */
export default function ExportCsvButton({ visibleRows, columns, filename }) {
  const date = new Date().toISOString().slice(0, 10);
  return (
    <button
      type="button"
      className="export-csv-button"
      disabled={!visibleRows || visibleRows.length === 0}
      aria-label="Export visible table rows as CSV"
      onClick={() => exportToCsv(visibleRows, columns, filename ?? `analytics-${date}.csv`)}
    >
      Export CSV
    </button>
  );
}
