# Architecture

Two layers: the **prompt pipeline** (the challenge itself) and the **reference implementation** the optimized prompt should produce, used to prove the compressed prompt is still complete.

## 1. Prompt-compression workflow

```
Original prompt (878 chars)
   │  1. Extract   → list every atomic requirement (13 found)
   │  2. Strip     → greetings, filler, justifications, repetition
   │  3. Group     → Task │ Rules │ Steps
   │  4. Compress  → terse imperative bullets ("Dates: ISO 8601")
   │  5. Verify    → traceability matrix: 13/13 kept
   │  6. Measure   → chars ÷ 4 → 219.5 → 99.5 tokens (−54.7 %)
   ▼
Optimized prompt (398 chars)
```

## 2. Reference feature architecture

```
AnalyticsTable (existing)
 ├─ filter state ─┐
 ├─ sort state  ──┼─► useMemo → visibleRows  ──► <tbody> (render)
 │                │                         └──► ExportCsvButton (NEW, read-only)
 └─ columns (order + hidden flag) ─────────────────┘        │
                                                            ▼
                              utils/exportToCsv.js (NEW, zero deps)
                              ├─ buildCsv(rows, cols)   pure
                              │   ├─ drop hidden columns
                              │   ├─ formatCell → toIso8601 for dates
                              │   └─ escapeCell (RFC 4180 + formula guard)
                              └─ downloadCsv(csv)      Blob + <a download>
```

### Design decisions

| Decision | Why it satisfies the prompt |
|---|---|
| Export consumes the table's derived `visibleRows` | Single source of truth → what you see is exactly what you export (filters + sort) |
| Columns passed in display order, `hidden` filtered out | Visible order kept, hidden columns excluded |
| `toIso8601` on `type: 'date'` or `Date` values | ISO 8601 dates |
| Native `Blob`, `URL.createObjectURL`, `<a download>` | No new dependency |
| Button is read-only, never calls `setFilter`/`setSort` | Existing filter/sort behavior unchanged |
| Pure `buildCsv` split from DOM `downloadCsv` | Testable in Node without a browser |
| Formula-injection guard + UTF-8 BOM | Safe in Excel, correct encoding |

## 3. Files

| File | Role |
|---|---|
| `prompts/original_prompt.txt` | Original input (878 chars) |
| `prompts/optimized_prompt.txt` | Optimized prompt (398 chars) |
| `src/utils/exportToCsv.js` | CSV builder + downloader (new) |
| `src/components/ExportCsvButton.jsx` | Export button (new) |
| `src/components/AnalyticsTable.example.jsx` | Integration example; 2 new lines |
| `tests/exportToCsv.test.mjs` | 6 unit tests (node:test, no deps) |
| `docs/SUBMISSION.md` | Required competition deliverables |
