# Prompt Compression Challenge — CSV Export

Rewrites a verbose 220-token request into a 100-token structured prompt (**−54.7 %**) with all 13 requirements intact, plus a reference implementation proving the compressed prompt is complete.

- **Submission (judges):** `docs/SUBMISSION.md`
- **Architecture & workflow:** `docs/ARCHITECTURE.md`
- **Slide:** `CSV_Export_Prompt_Compression.pptx`

## Outputs (`outputs/`)

- `test-results.txt`: full test run, 6/6 passing
- `sample-export.csv`: real export. The table is filtered (views ≥ 100) and sorted (views desc). The `/docs` row is filtered out, the hidden "Internal ID" column is absent, dates are ISO 8601, and commas, quotes and formulas are escaped. Regenerate with `node outputs/generate-sample.mjs`.
- `slide-preview.png`: image of the summary slide

## Run the tests

```bash
npm test     # Node 18+, zero dependencies → 6 passing
```

## Integrate into a real dashboard

1. Copy `src/utils/exportToCsv.js` and `src/components/ExportCsvButton.jsx`.
2. In the analytics table, render `<ExportCsvButton visibleRows={visibleRows} columns={columns} />`, passing the **already filtered + sorted** rows and the columns in display order (each with optional `hidden` and `type: 'date'`).

## Manual verification

1. Apply a filter and a sort, then click **Export CSV**.
2. Row count and row order in the file match the table.
3. Header order matches on-screen columns; hidden columns are absent.
4. Date cells look like `2026-10-02T00:00:00.000Z`.
5. `package.json` dependencies unchanged.
6. Filtering and sorting still work after exporting.
