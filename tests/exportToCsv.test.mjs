import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCsv, escapeCell, toIso8601 } from '../src/utils/exportToCsv.js';

const columns = [
  { id: 'date', header: 'Date', type: 'date' },
  { id: 'page', header: 'Page' },
  { id: 'internalId', header: 'Internal ID', hidden: true },
  { id: 'views', header: 'Views', type: 'number' },
];

// Rows as the table shows them: already filtered + sorted by views desc.
const visibleRows = [
  { date: new Date(Date.UTC(2026, 9, 2)), page: '/pricing', internalId: 'x1', views: 900 },
  { date: '2026-10-01T05:30:00Z', page: '/home, main', internalId: 'x2', views: 450 },
];

test('exports exactly the visible rows, in visible order', () => {
  const lines = buildCsv(visibleRows, columns).split('\r\n');
  assert.equal(lines.length, 3);
  assert.match(lines[1], /\/pricing/);
  assert.match(lines[2], /\/home/);
});

test('keeps column order and excludes hidden columns', () => {
  const header = buildCsv(visibleRows, columns).split('\r\n')[0];
  assert.equal(header, 'Date,Page,Views');
  assert.doesNotMatch(buildCsv(visibleRows, columns), /x1|x2/);
});

test('respects reordered columns', () => {
  const reordered = [columns[3], columns[1], columns[0]];
  assert.equal(buildCsv([], reordered), 'Views,Page,Date');
});

test('formats dates as ISO 8601', () => {
  const lines = buildCsv(visibleRows, columns).split('\r\n');
  assert.ok(lines[1].startsWith('2026-10-02T00:00:00.000Z'));
  assert.ok(lines[2].startsWith('2026-10-01T05:30:00.000Z'));
  assert.equal(toIso8601(null), '');
});

test('escapes commas, quotes, newlines and formula injection', () => {
  assert.equal(escapeCell('a,b'), '"a,b"');
  assert.equal(escapeCell('say "hi"'), '"say ""hi"""');
  assert.equal(escapeCell('=SUM(A1)'), "'=SUM(A1)");
  assert.equal(escapeCell('-42'), '-42');
});

test('does not mutate input rows or columns', () => {
  const rowsCopy = JSON.stringify(visibleRows);
  const colsCopy = JSON.stringify(columns);
  buildCsv(visibleRows, columns);
  assert.equal(JSON.stringify(visibleRows), rowsCopy);
  assert.equal(JSON.stringify(columns), colsCopy);
});
