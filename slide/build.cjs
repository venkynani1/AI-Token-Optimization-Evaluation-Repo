const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/mnt/skills/public/pptx/scripts/apply_theme.js');
const THEME = { name: 'Compression Teal', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1:'1F2A37', lt1:'FFFFFF', dk2:'5B6673', lt2:'F2F5F7', accent1:'0F766E', accent2:'DDF1EC',
    accent3:'D97706', accent4:'94A3B8', accent5:'134E4A', accent6:'E2E8F0', hlink:'0F766E', folHlink:'134E4A' } };
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Prompt Compression Challenge — CSV Export';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
pres.defineSlideMaster({ title: 'TITLE_ONLY', background: { color: 'FFFFFF' },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 12.33, h: 0.6, fontSize: 28, bold: true, color: C.text1, fontFace: 'Cambria', valign: 'top', margin: 0 }, text: '' } },
    { text: { text: 'Estimate method: characters ÷ 4  ·  Reference build: React + plain JS, zero dependencies, 6/6 unit tests passing',
      options: { x: 0.5, y: 7.05, w: 12.33, h: 0.3, fontSize: 10, color: C.text2, fontFace: 'Calibri', margin: 0 } } },
  ] });
pres.addSection({ title: 'Summary' });
const s = pres.addSlide({ masterName: 'TITLE_ONLY', sectionTitle: 'Summary' });
s.addText('Prompt Compression: CSV Export for the Analytics Dashboard', { placeholder: 'title' });
s.addText([
  { text: '−54.7% estimated tokens', options: { bold: true, color: C.accent1 } },
  { text: '   with all 13 requirements preserved  ·  220 → 100 tokens  ·  878 → 398 characters' },
], { x: 0.5, y: 0.92, w: 12.33, h: 0.35, fontSize: 15, color: C.text2, margin: 0, isTextBox: true });

const card = (name, x, y, w, h, title, fill) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name, x, y, w, h, rectRadius: 0.08, fill: { color: fill || C.background2 }, line: { color: fill || C.background2 } });
  s.addText(title, { objectName: name + ' title', x: x + 0.25, y: y + 0.18, w: w - 0.5, h: 0.32, fontSize: 15, bold: true, color: C.accent5, fontFace: 'Cambria', margin: 0, isTextBox: true });
};

// --- Problem
const pY = 1.5, pH = 2.5;
card('Problem card', 0.5, pY, 3.95, pH, 'Problem');
s.addText('A long, repetitive, conversational request asks an AI assistant to add CSV export. Filler costs tokens and buries constraints.',
  { x: 0.75, y: pY + 0.58, w: 3.45, h: 0.95, fontSize: 12.5, color: C.text1, margin: 0, valign: 'top', isTextBox: true });
const bar = (label, val, y, frac, color) => {
  s.addText(label, { x: 0.75, y, w: 1.0, h: 0.3, fontSize: 11, color: C.text2, margin: 0, valign: 'middle', isTextBox: true });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.75, y: y + 0.04, w: 2.1 * frac, h: 0.22, rectRadius: 0.05, fill: { color }, line: { color } });
  s.addText(val, { x: 1.75 + 2.1 * frac + 0.08, y, w: 0.5, h: 0.3, fontSize: 11, bold: true, color: C.text1, margin: 0, valign: 'middle', isTextBox: true });
};
bar('Original', '220', pY + 1.62, 1, C.accent4);
bar('Optimized', '100', pY + 2.0, 99.5 / 219.5, C.accent1);

// --- Solution workflow
const wX = 4.7, wW = 8.13;
card('Workflow card', wX, pY, wW, pH, 'Solution approach & workflow');
const steps = [['Extract', '13 atomic requirements'], ['Strip', 'greeting, filler, repeats'], ['Group', 'Task · Rules · Steps'],
  ['Compress', 'terse imperative bullets'], ['Verify', 'trace 13/13 kept'], ['Measure', 'chars ÷ 4 → −54.7%']];
const chipW = 1.13, gap = 0.17, cx0 = wX + 0.25, cy = pY + 0.62;
steps.forEach(([t, d], i) => {
  const x = cx0 + i * (chipW + gap);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Step ' + (i + 1), x, y: cy, w: chipW, h: 1.2, rectRadius: 0.08, fill: { color: C.background1 }, line: { color: C.accent6, width: 1 } });
  s.addShape(pres.shapes.OVAL, { x: x + chipW / 2 - 0.17, y: cy + 0.1, w: 0.34, h: 0.34, fill: { color: C.accent1 }, line: { color: C.accent1 } });
  s.addText(String(i + 1), { x: x + chipW / 2 - 0.17, y: cy + 0.1, w: 0.34, h: 0.34, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addText(t, { x: x + 0.05, y: cy + 0.5, w: chipW - 0.1, h: 0.25, fontSize: 12, bold: true, color: C.text1, align: 'center', margin: 0, isTextBox: true });
  s.addText(d, { x: x + 0.05, y: cy + 0.76, w: chipW - 0.1, h: 0.4, fontSize: 10, color: C.text2, align: 'center', valign: 'top', margin: 0, isTextBox: true });
  if (i < steps.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + chipW + 0.025, y: cy + 0.52, w: 0.12, h: 0.16, fill: { color: C.accent4 }, line: { color: C.accent4 } });
});
s.addText([
  { text: 'Output prompt: ', options: { bold: true, color: C.accent5 } },
  { text: 'Task (CSV button on analytics table) · Rules (filtered + sorted rows, visible order, no hidden cols, ISO 8601, no new deps, keep filter/sort) · Steps (inspect & list files → implement → report changes + verification)' },
], { x: wX + 0.25, y: cy + 1.3, w: wW - 0.5, h: 0.5, fontSize: 11, color: C.text1, margin: 0, valign: 'top', isTextBox: true });

// --- Architecture
const bY = 4.2, bH = 2.65;
card('Architecture card', 0.5, bY, 5.1, bH, 'Architecture (reference build)');
const bw = 1.4, bh = 0.62, ag = 0.3, ax0 = 0.75;
const box = (txt, col, row, isNew) => {
  const x = ax0 + col * (bw + ag), y = bY + 0.65 + row * 0.95;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Arch ' + txt, x, y, w: bw, h: bh, rectRadius: 0.06,
    fill: { color: isNew ? C.accent1 : C.background1 }, line: { color: isNew ? C.accent1 : C.accent4, width: 1 } });
  s.addText(txt, { x: x + 0.04, y, w: bw - 0.08, h: bh, fontSize: 10.5, bold: isNew, color: isNew ? C.background1 : C.text1, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
};
const harrow = (col, row) => s.addShape(pres.shapes.RIGHT_ARROW, { x: ax0 + col * (bw + ag) + bw + 0.07, y: bY + 0.65 + row * 0.95 + bh / 2 - 0.08, w: 0.16, h: 0.16, fill: { color: C.accent4 }, line: { color: C.accent4 } });
box('Filter + sort state', 0, 0); harrow(0, 0);
box('visibleRows (useMemo)', 1, 0); harrow(1, 0);
box('Table render', 2, 0);
box('ExportCsvButton (read-only)', 1, 1, true); harrow(1, 1);
box('buildCsv() → Blob download', 2, 1, true);
s.addShape(pres.shapes.DOWN_ARROW, { x: ax0 + (bw + ag) + bw / 2 - 0.08, y: bY + 0.65 + bh + 0.06, w: 0.16, h: 0.2, fill: { color: C.accent4 }, line: { color: C.accent4 } });
s.addText([
  { text: 'Teal', options: { bold: true, color: C.accent1, breakLine: true } },
  { text: 'new code', options: { breakLine: true } },
  { text: 'Grey', options: { bold: true, color: C.text2, breakLine: true } },
  { text: 'existing, unchanged' },
], { x: ax0, y: bY + 1.6, w: bw, h: 0.85, fontSize: 10, color: C.text2, margin: 0, valign: 'top', isTextBox: true });

// --- Key features
const fX = 5.85, fW = 3.6;
card('Features card', fX, bY, fW, bH, 'Key features');
const feats = ['Exports only filtered, sorted rows', 'Visible column order kept', 'Hidden columns excluded', 'ISO 8601 dates', 'Zero new dependencies', 'Filter/sort logic untouched', 'CSV escaping + formula guard'];
s.addText(feats.map((f, i) => ({ text: f, options: { bullet: { indent: 14 }, breakLine: i < feats.length - 1 } })),
  { x: fX + 0.25, y: bY + 0.6, w: fW - 0.45, h: 1.95, fontSize: 12, color: C.text1, margin: 0, valign: 'top', paraSpaceAfter: 3, isTextBox: true });

// --- Business impact
const iX = 9.7, iW = 3.13;
card('Impact card', iX, bY, iW, bH, 'Business impact', C.accent2);
const stats = [['−54.7%', 'tokens per run'], ['13/13', 'requirements kept'], ['0', 'new dependencies'], ['6/6', 'tests passing']];
stats.forEach(([n, l], i) => {
  const x = iX + 0.25 + (i % 2) * 1.45, y = bY + 0.62 + Math.floor(i / 2) * 0.76;
  s.addText(n, { x, y, w: 1.35, h: 0.45, fontSize: 24, bold: true, color: C.accent1, fontFace: 'Cambria', margin: 0, isTextBox: true });
  s.addText(l, { x, y: y + 0.44, w: 1.35, h: 0.28, fontSize: 10, color: C.text2, margin: 0, isTextBox: true });
});
s.addText('Lower cost and latency at scale; less rework from missed constraints.',
  { x: iX + 0.25, y: bY + 2.1, w: iW - 0.45, h: 0.4, fontSize: 10, italic: true, color: C.accent5, margin: 0, valign: 'top', isTextBox: true });

s.addNotes('Problem: verbose 878-char prompt (≈220 tokens). Approach: extract 13 requirements, strip filler, group into Task/Rules/Steps, compress, verify traceability, measure with chars÷4. Result: 398 chars (≈100 tokens), −54.7%. Reference React implementation proves completeness: read-only export button consuming derived visibleRows, pure buildCsv, native Blob download, 6 unit tests.');

(async () => {
  await pres.writeFile({ fileName: '../CSV_Export_Prompt_Compression.pptx' });
  await applyTheme('../CSV_Export_Prompt_Compression.pptx', THEME);
  console.log('ok');
})();
