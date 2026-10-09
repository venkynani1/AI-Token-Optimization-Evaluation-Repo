import { writeFileSync } from 'node:fs';
import { buildCsv } from '../src/utils/exportToCsv.js';
const columns = [
  { id: 'date', header: 'Date', type: 'date' },
  { id: 'page', header: 'Page' },
  { id: 'internalId', header: 'Internal ID', hidden: true },
  { id: 'views', header: 'Views' },
  { id: 'note', header: 'Note' },
];
const all = [
  { date: new Date(Date.UTC(2026, 9, 1)), page: '/home', internalId: 'a1', views: 450, note: 'main, landing' },
  { date: new Date(Date.UTC(2026, 9, 2)), page: '/pricing', internalId: 'a2', views: 900, note: 'says "buy"' },
  { date: new Date(Date.UTC(2026, 9, 3)), page: '/blog', internalId: 'a3', views: 120, note: '=HYPERLINK("x")' },
  { date: new Date(Date.UTC(2026, 9, 4)), page: '/docs', internalId: 'a4', views: 30, note: 'filtered out' },
];
// Simulate the table: filter views >= 100, sort by views desc.
const visible = all.filter((r) => r.views >= 100).sort((a, b) => b.views - a.views);
const csv = buildCsv(visible, columns);
writeFileSync(new URL('./sample-export.csv', import.meta.url), csv);
console.log(csv);
