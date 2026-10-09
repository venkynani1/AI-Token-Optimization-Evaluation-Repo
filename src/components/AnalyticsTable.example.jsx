// Integration example: how the existing AnalyticsTable wires in the button.
// Only the marked lines are new; filter/sort logic is unchanged.
import React, { useMemo, useState } from 'react';
import ExportCsvButton from './ExportCsvButton'; // NEW

export default function AnalyticsTable({ data, columns }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ id: null, dir: 'asc' });

  // Existing derived state — the single source of truth for what is visible.
  const visibleRows = useMemo(() => {
    const q = filter.toLowerCase();
    const filtered = q
      ? data.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)))
      : data;
    if (!sort.id) return filtered;
    const m = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (a[sort.id] > b[sort.id] ? m : a[sort.id] < b[sort.id] ? -m : 0));
  }, [data, filter, sort]);

  const shownColumns = columns.filter((c) => !c.hidden);

  return (
    <div>
      <div className="toolbar">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter" />
        <ExportCsvButton visibleRows={visibleRows} columns={columns} /> {/* NEW */}
      </div>
      <table>
        <thead>
          <tr>
            {shownColumns.map((c) => (
              <th key={c.id} onClick={() => setSort((s) => ({ id: c.id, dir: s.id === c.id && s.dir === 'asc' ? 'desc' : 'asc' }))}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((r, i) => (
            <tr key={i}>{shownColumns.map((c) => <td key={c.id}>{String(r[c.id])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
