/**
 * Frontify "Rebranding Redefined" — Google Slides Master
 * ─────────────────────────────────────────────────────────
 * USAGE:
 *   1. Open Google Slides → create a new blank presentation.
 *   2. Extensions → Apps Script → paste this file → Save.
 *   3. Run buildFrontifyMaster() — authorize when prompted.
 *   4. The function populates all slide templates in the active presentation.
 *
 * FONTS used (both available natively in Google Slides):
 *   Heading: Montserrat Bold / ExtraBold
 *   Body:    Inter Regular / Light
 *
 * BRAND TOKENS
 *   Dark BG   #100E1D   Violet   #5834E8   Cream  #F2EDE0
 *   Dark Text #1A162A   Mid Gray #8884A0   White  #FFFFFF
 */

// ─── BRAND COLORS ────────────────────────────────────────
const C = {
  darkBg:    { r: 16,  g: 14,  b: 29  },  // #100E1D
  violet:    { r: 88,  g: 52,  b: 232 },  // #5834E8
  violetDk:  { r: 58,  g: 32,  b: 176 },  // #3A20B0
  violetLt:  { r: 196, g: 180, b: 255 },  // #C4B4FF
  cream:     { r: 242, g: 237, b: 224 },  // #F2EDE0
  creamMid:  { r: 227, g: 219, b: 200 },  // #E3DBC8
  white:     { r: 255, g: 255, b: 255 },
  darkText:  { r: 26,  g: 22,  b: 42  },  // #1A162A
  midGray:   { r: 136, g: 132, b: 160 },  // #8884A0
  lightGray: { r: 200, g: 196, b: 216 },  // #C8C4D8
  // Chapter accent palette
  ch01: { r: 88,  g: 52,  b: 232 },  // Violet
  ch02: { r: 255, g: 96,  b: 56  },  // Orange
  ch03: { r: 0,   g: 212, b: 176 },  // Teal
  ch04: { r: 56,  g: 128, b: 255 },  // Blue
  ch05: { r: 48,  g: 209, b: 88  },  // Green
  ch06: { r: 255, g: 55,  b: 95  },  // Crimson
};

// ─── HELPERS ──────────────────────────────────────────────

function rgb(c) {
  return { red: c.r / 255, green: c.g / 255, blue: c.b / 255 };
}

function hexRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { red: r / 255, green: g / 255, blue: b / 255 };
}

// pt → EMU (914400 EMU = 1 inch; 1 pt = 12700 EMU)
function pt(n) { return n * 12700; }
// inches → EMU
function inch(n) { return n * 914400; }

/**
 * Set slide background to a solid color.
 */
function setBg(slide, colorObj) {
  const bg = slide.getBackground();
  bg.setSolidFill(colorObj.r / 255, colorObj.g / 255, colorObj.b / 255);
}

/**
 * Add a filled rectangle. Returns the PageElement.
 */
function addRect(slide, x, y, w, h, fillColor, lineColor) {
  const shape = slide.insertShape(SlidesApp.ShapeType.RECTANGLE,
    inch(x), inch(y), inch(w), inch(h));
  shape.getFill().setSolidFill(fillColor.r / 255, fillColor.g / 255, fillColor.b / 255);
  if (lineColor) {
    shape.getBorder().getLineFill().setSolidFill(
      lineColor.r / 255, lineColor.g / 255, lineColor.b / 255);
    shape.getBorder().setWeight(1);
  } else {
    shape.getBorder().setTransparent();
  }
  return shape;
}

/**
 * Add a text box with consistent styling.
 * textStyles: array of { text, font, size, bold, italic, color }
 * Each entry maps to one paragraph run.
 */
function addTextBox(slide, x, y, w, h, textStyles, alignment) {
  const box = slide.insertTextBox('', inch(x), inch(y), inch(w), inch(h));
  const tf  = box.getText();
  tf.clear();

  textStyles.forEach((ts, i) => {
    if (i > 0) tf.appendText('\n');
    const startIdx = tf.asString().length - (i > 0 ? 1 : 0);
    tf.appendText(ts.text);
    const range = tf.getRange(i === 0 ? 0 : startIdx, tf.asString().length);
    const style = range.getTextStyle();
    style.setFontFamily(ts.font || 'Montserrat');
    style.setFontSize(ts.size || 18);
    style.setBold(ts.bold || false);
    style.setItalic(ts.italic || false);
    if (ts.color) {
      style.setForegroundColor(ts.color.r / 255, ts.color.g / 255, ts.color.b / 255);
    }
  });

  const para = box.getText().getParagraphs();
  para.forEach(p => {
    p.getRange().getParagraphStyle().setParagraphAlignment(
      alignment || SlidesApp.ParagraphAlignment.START);
  });

  box.setContentAlignment(SlidesApp.ContentAlignment.TOP);
  box.getBorder().setTransparent();
  return box;
}

/** Simple single-style text box. */
function T(slide, text, x, y, w, h, font, size, bold, color, align, italic) {
  return addTextBox(slide,
    x, y, w, h,
    [{ text, font: font || 'Montserrat', size: size || 18,
       bold: !!bold, color: color || C.white, italic: !!italic }],
    align || SlidesApp.ParagraphAlignment.START
  );
}

/** Image placeholder (grey rectangle + label). */
function imgPlaceholder(slide, x, y, w, h, label, fillColor) {
  const fc = fillColor || { r: 40, g: 36, b: 58 };
  addRect(slide, x, y, w, h, fc);
  T(slide, label || '[IMAGE]',
    x + w / 2 - 0.9, y + h / 2 - 0.2, 1.8, 0.4,
    'Inter', 12, false, C.midGray,
    SlidesApp.ParagraphAlignment.CENTER);
}

/** Frontify wordmark placeholder. */
function logo(slide, x, y, color) {
  T(slide, 'frontify', x, y, 1.8, 0.4, 'Montserrat', 14, true,
    color || C.violet);
}

/** Thin accent rule (rectangle). */
function rule(slide, x, y, w, color) {
  addRect(slide, x, y, w, 0.025, color || C.violet);
}

/** Slide-index annotation in bottom-right corner. */
function label(slide, text) {
  T(slide, text, 7.2, 7.12, 5.8, 0.3, 'Inter', 9, false, C.midGray,
    SlidesApp.ParagraphAlignment.END);
}

// ─── MAIN FUNCTION ────────────────────────────────────────

function buildFrontifyMaster() {
  const prs = SlidesApp.getActivePresentation();
  // Clear existing slides (leave one — Slides requires at least one)
  const slides = prs.getSlides();
  for (let i = slides.length - 1; i > 0; i--) slides[i].remove();

  prs.setName('Frontify – Rebranding Redefined – Slide Master');

  // ── 01  COVER ─────────────────────────────────────────
  const s01 = slides[0];
  setBg(s01, C.darkBg);
  addRect(s01, 0, 0, 0.22, 7.5, C.violet);                  // left accent bar
  addRect(s01, 10.8, 0, 2.53, 2.8, C.violetDk);             // top-right glow
  T(s01, 'REBRANDING\nREDEFINED',
    0.9, 1.1, 9.5, 3.4, 'Montserrat', 82, true, C.white);
  rule(s01, 0.9, 4.6, 2.4, C.violet);
  T(s01, 'Six elements of modern brand craft',
    0.9, 4.85, 8, 0.65, 'Inter', 22, false, C.lightGray);
  T(s01, 'A Frontify Guide  ·  2024',
    0.9, 5.7, 6, 0.5, 'Inter', 14, false, C.midGray);
  logo(s01, 11.3, 6.85, C.violet);
  label(s01, 'SLIDE 01 — COVER');

  // ── 02  TABLE OF CONTENTS ────────────────────────────
  const s02 = prs.appendSlide();
  setBg(s02, C.cream);
  T(s02, 'Six elements of\nmodern brand craft',
    0.9, 0.55, 6, 1.6, 'Montserrat', 38, true, C.darkText);
  rule(s02, 0.9, 2.3, 1.6, C.violet);

  const chapters = [
    ['01', C.ch01, 'Typography',         'How letterforms shape brand voice'],
    ['02', C.ch02, 'Color',              'The psychology and strategy of hue'],
    ['03', C.ch03, 'Sound',              'Sonic identity in a multi-modal world'],
    ['04', C.ch04, 'Motion',             'Animation as brand expression'],
    ['05', C.ch05, 'Flexibility',        'Systems that adapt without losing identity'],
    ['06', C.ch06, 'Cultural Relevance', 'Brands that move with culture'],
  ];
  const colX = [0.9, 7.05];
  const rowY  = 2.55;
  const rowGap = 1.6;

  chapters.forEach(([num, accent, name, desc], i) => {
    const x = colX[i % 2];
    const y = rowY + Math.floor(i / 2) * rowGap;
    addRect(s02, x, y, 0.55, 0.55, accent);
    T(s02, num, x + 0.06, y + 0.06, 0.43, 0.43,
      'Montserrat', 14, true, C.white, SlidesApp.ParagraphAlignment.CENTER);
    T(s02, name, x + 0.72, y, 5.5, 0.45, 'Montserrat', 17, true, C.darkText);
    T(s02, desc, x + 0.72, y + 0.42, 5.5, 0.5, 'Inter', 13, false, C.midGray);
  });

  logo(s02, 11.3, 6.85, C.violet);
  label(s02, 'SLIDE 02 — TABLE OF CONTENTS');

  // ── 03–08  CHAPTER DIVIDERS ───────────────────────────
  const chapterDescs = [
    'How letterforms shape brand voice and personality',
    'The psychology and strategy of hue in modern branding',
    'Sonic identity in a multi-modal, always-on world',
    'Animation as a living expression of brand character',
    'Systems that adapt fluidly without losing their identity',
    'Brands that move with culture — and sometimes define it',
  ];

  chapters.forEach(([num, accent, name], i) => {
    const s = prs.appendSlide();
    setBg(s, C.darkBg);
    // Colour block left half
    addRect(s, 0, 0, 5.8, 7.5, accent);
    // Big number ghost
    const lightAccent = {
      r: Math.min(accent.r + 40, 255),
      g: Math.min(accent.g + 40, 255),
      b: Math.min(accent.b + 40, 255),
    };
    T(s, `0${i + 1}`, 0.1, -0.8, 5.6, 6.5, 'Montserrat', 260, true, lightAccent);
    // Right side
    T(s, `CHAPTER 0${i + 1}`, 6.3, 1.4, 6.5, 0.5, 'Inter', 13, false, accent);
    T(s, name, 6.3, 1.95, 6.5, 2.0, 'Montserrat', 52, true, C.white);
    rule(s, 6.3, 4.05, 2.0, accent);
    T(s, chapterDescs[i], 6.3, 4.3, 6.5, 1.2, 'Inter', 18, false, C.lightGray);
    logo(s, 11.3, 6.85, accent);
    label(s, `SLIDE 0${i + 3} — CHAPTER 0${i + 1}`);
  });

  // ── 09  CONTENT + IMAGE (image right, light) ──────────
  const s09 = prs.appendSlide();
  setBg(s09, C.cream);
  T(s09, 'Section Headline\nGoes Here',
    0.9, 1.1, 6.0, 1.8, 'Montserrat', 40, true, C.darkText);
  rule(s09, 0.9, 3.05, 1.4, C.violet);
  T(s09, 'Body copy occupies this space. Replace with your key insight, '
       + 'supporting data point, or narrative paragraph. Aim for 3–5 lines '
       + 'for comfortable readability.',
    0.9, 3.2, 5.8, 1.5, 'Inter', 17, false, C.darkText);
  T(s09, 'Supporting detail or citation can go here.',
    0.9, 4.85, 5.8, 0.5, 'Inter', 13, false, C.midGray);
  imgPlaceholder(s09, 7.1, 0, 6.233, 7.5, '[IMAGE PLACEHOLDER]',
    { r: 216, g: 210, b: 196 });
  logo(s09, 0.9, 6.85, C.violet);
  label(s09, 'SLIDE 09 — CONTENT + IMAGE (right)');

  // ── 10  CONTENT + IMAGE (image left, dark) ────────────
  const s10 = prs.appendSlide();
  setBg(s10, C.darkBg);
  imgPlaceholder(s10, 0, 0, 6.0, 7.5, '[IMAGE PLACEHOLDER]',
    { r: 34, g: 30, b: 50 });
  T(s10, 'Section Headline\nGoes Here',
    6.6, 1.1, 6.0, 1.8, 'Montserrat', 40, true, C.white);
  rule(s10, 6.6, 3.05, 1.4, C.violet);
  T(s10, 'Body copy occupies this space. Replace with your key insight.',
    6.6, 3.2, 6.0, 1.5, 'Inter', 17, false, C.lightGray);
  T(s10, 'Supporting detail or attribution.',
    6.6, 4.85, 6.0, 0.5, 'Inter', 13, false, C.midGray);
  logo(s10, 11.3, 6.85, C.violet);
  label(s10, 'SLIDE 10 — CONTENT + IMAGE (left)');

  // ── 11  PULL QUOTE ────────────────────────────────────
  const s11 = prs.appendSlide();
  setBg(s11, C.darkBg);
  T(s11, '“', 0.5, -0.5, 3, 3, 'Montserrat', 200, true, C.violet);
  T(s11, 'Branding isn’t about perfecting\nstatic assets. It’s about building\nliving systems.',
    0.9, 1.8, 11.5, 3.0, 'Montserrat', 46, true, C.white);
  rule(s11, 0.9, 5.05, 0.8, C.violet);
  T(s11, 'Expert Name  ·  Role, Organisation',
    0.9, 5.2, 8, 0.5, 'Inter', 15, false, C.midGray);
  logo(s11, 11.3, 6.85, C.violet);
  label(s11, 'SLIDE 11 — PULL QUOTE');

  // ── 12  STATISTICS ────────────────────────────────────
  const s12 = prs.appendSlide();
  setBg(s12, C.cream);
  T(s12, 'BY THE NUMBERS',
    0.9, 0.5, 10, 0.5, 'Inter', 13, false, C.midGray);

  const stats = [
    ['78%',  C.ch02, 'of brand teams plan a rebrand within the next 3 years'],
    ['3.2×', C.ch03, 'more brand recall with consistent motion identity'],
    ['60+',  C.ch04, 'touchpoints where sonic branding now plays a role'],
  ];
  stats.forEach(([num, accent, desc], i) => {
    const x = 0.9 + i * 4.2;
    addRect(s12, x, 1.25, 4.0, 0.03, accent);
    T(s12, num, x, 1.4, 4.0, 2.0, 'Montserrat', 88, true, C.darkText);
    addRect(s12, x, 3.55, 4.0, 0.01, C.creamMid);
    T(s12, desc, x, 3.7, 4.0, 1.8, 'Inter', 17, false, C.darkText);
  });
  logo(s12, 0.9, 6.85, C.violet);
  label(s12, 'SLIDE 12 — STATISTICS');

  // ── 13  TWO COLUMNS ───────────────────────────────────
  const s13 = prs.appendSlide();
  setBg(s13, C.darkBg);
  T(s13, 'Headline Spanning Full Width',
    0.9, 0.55, 11.5, 0.85, 'Montserrat', 36, true, C.white);
  addRect(s13, 0.9, 1.5, 11.5, 0.01, { r: 56, g: 52, b: 80 });

  // Left col
  T(s13, 'Left Column Heading', 0.9, 1.7, 5.5, 0.6, 'Montserrat', 22, true, C.violet);
  T(s13, 'Left column body. One concept, comparison, or argument per column.',
    0.9, 2.4, 5.5, 2.4, 'Inter', 17, false, C.lightGray);
  ['Key point one', 'Key point two', 'Key point three'].forEach((item, j) => {
    addRect(s13, 0.9, 4.95 + j * 0.52, 0.1, 0.1, C.violet);
    T(s13, item, 1.15, 4.88 + j * 0.52, 5.3, 0.45, 'Inter', 16, false, C.lightGray);
  });

  // Right col
  T(s13, 'Right Column Heading', 7.1, 1.7, 5.5, 0.6, 'Montserrat', 22, true, C.ch03);
  T(s13, 'Right column body. Works for before/after, pros/cons, or two frameworks.',
    7.1, 2.4, 5.5, 2.4, 'Inter', 17, false, C.lightGray);
  ['Key point alpha', 'Key point beta', 'Key point gamma'].forEach((item, j) => {
    addRect(s13, 7.1, 4.95 + j * 0.52, 0.1, 0.1, C.ch03);
    T(s13, item, 7.35, 4.88 + j * 0.52, 5.3, 0.45, 'Inter', 16, false, C.lightGray);
  });

  logo(s13, 11.3, 6.85, C.violet);
  label(s13, 'SLIDE 13 — TWO COLUMNS');

  // ── 14  FULL-BLEED IMAGE ──────────────────────────────
  const s14 = prs.appendSlide();
  setBg(s14, { r: 24, g: 20, b: 38 });
  imgPlaceholder(s14, 0, 0, 13.333, 7.5, '[FULL-BLEED IMAGE]',
    { r: 34, g: 28, b: 52 });
  addRect(s14, 0, 4.2, 13.333, 3.3, { r: 8, g: 6, b: 18 });
  T(s14, 'Image Caption or Key Statement Here',
    0.9, 4.5, 10, 1.8, 'Montserrat', 42, true, C.white);
  T(s14, 'Supporting line or image credit',
    0.9, 6.5, 8, 0.5, 'Inter', 14, false, C.midGray);
  logo(s14, 11.3, 7.05, C.white);
  label(s14, 'SLIDE 14 — FULL-BLEED IMAGE');

  // ── 15  KEY INSIGHT CALLOUT ───────────────────────────
  const s15 = prs.appendSlide();
  setBg(s15, C.violet);
  addRect(s15, 10.5, -0.6, 3.0, 3.0, C.violetDk);
  T(s15, 'KEY INSIGHT',
    0.9, 1.5, 10, 0.5, 'Inter', 13, false, C.violetLt);
  T(s15, 'A successful rebrand is not a\nmoment — it is a system.',
    0.9, 2.1, 10.5, 2.4, 'Montserrat', 54, true, C.white);
  rule(s15, 0.9, 4.65, 1.8, C.violetLt);
  T(s15, 'Chapter synthesis · Applies across all six brand elements',
    0.9, 4.9, 9, 0.5, 'Inter', 16, false, C.violetLt);
  logo(s15, 11.3, 6.85, C.white);
  label(s15, 'SLIDE 15 — KEY INSIGHT');

  // ── 16  CHAPTER SUMMARY ───────────────────────────────
  const s16 = prs.appendSlide();
  setBg(s16, C.cream);
  T(s16, 'CHAPTER SUMMARY', 0.9, 0.5, 6, 0.4, 'Inter', 12, false, C.midGray);
  T(s16, 'Typography', 0.9, 0.9, 9, 1.0, 'Montserrat', 54, true, C.darkText);
  addRect(s16, 0.9, 2.05, 11.5, 0.01, C.creamMid);

  const takeaways = [
    ['01', 'Typefaces encode meaning',
     'Every letterform carries cultural weight. Choose with intention.'],
    ['02', 'Variable fonts unlock flexibility',
     'A single typeface can span every context on a variable axis.'],
    ['03', 'Consistency builds trust',
     'Typographic discipline across touchpoints deepens brand recall.'],
  ];
  takeaways.forEach(([num, heading, body], i) => {
    const x = 0.9 + i * 4.1;
    T(s16, num, x, 2.3, 0.7, 0.7, 'Montserrat', 28, true, C.ch01);
    T(s16, heading, x, 3.1, 3.7, 0.7, 'Montserrat', 19, true, C.darkText);
    T(s16, body, x, 3.9, 3.7, 1.4, 'Inter', 14, false, C.midGray);
  });

  logo(s16, 0.9, 6.85, C.violet);
  label(s16, 'SLIDE 16 — CHAPTER SUMMARY');

  // ── 17  CLOSING CTA ───────────────────────────────────
  const s17 = prs.appendSlide();
  setBg(s17, C.darkBg);
  addRect(s17, 0, 0, 0.22, 7.5, C.violet);
  T(s17, 'Build brands\nthat last.',
    0.9, 1.0, 10, 3.0, 'Montserrat', 80, true, C.white);
  rule(s17, 0.9, 4.15, 2.2, C.violet);
  T(s17, 'Explore the full Frontify platform at frontify.com',
    0.9, 4.4, 9, 0.6, 'Inter', 22, false, C.lightGray);
  T(s17, 'frontify.com',
    0.9, 5.15, 5, 0.6, 'Montserrat', 22, true, C.violet);
  logo(s17, 11.3, 6.85, C.violet);
  label(s17, 'SLIDE 17 — CLOSING CTA');

  // ── 18  GENERIC (light) ───────────────────────────────
  const s18 = prs.appendSlide();
  setBg(s18, C.cream);
  T(s18, 'Slide Heading', 0.9, 0.6, 11.5, 0.85, 'Montserrat', 36, true, C.darkText);
  addRect(s18, 0.9, 1.55, 11.5, 0.01, C.creamMid);
  T(s18, 'Content area — add text, images, or charts here.',
    0.9, 1.75, 11.5, 4.8, 'Inter', 20, false, C.midGray);
  logo(s18, 0.9, 6.85, C.violet);
  label(s18, 'SLIDE 18 — GENERIC (light)');

  // ── 19  GENERIC (dark) ────────────────────────────────
  const s19 = prs.appendSlide();
  setBg(s19, C.darkBg);
  T(s19, 'Slide Heading', 0.9, 0.6, 11.5, 0.85, 'Montserrat', 36, true, C.white);
  addRect(s19, 0.9, 1.55, 11.5, 0.01, { r: 56, g: 52, b: 80 });
  T(s19, 'Content area — add text, images, or charts here.',
    0.9, 1.75, 11.5, 4.8, 'Inter', 20, false, C.midGray);
  logo(s19, 11.3, 6.85, C.violet);
  label(s19, 'SLIDE 19 — GENERIC (dark)');

  SlidesApp.getUi().alert(
    '✓ Done! 19 slide templates created.\n\n' +
    '01 Cover  ·  02 TOC  ·  03–08 Chapter Dividers  ·  ' +
    '09–10 Content+Image  ·  11 Quote  ·  12 Stats  ·  ' +
    '13 Two-Col  ·  14 Full-Bleed  ·  15 Callout  ·  ' +
    '16 Summary  ·  17 CTA  ·  18–19 Generic\n\n' +
    'Fonts: Montserrat (headings) · Inter (body)\n' +
    'Colours: Violet #5834E8  ·  Dark BG #100E1D  ·  Cream #F2EDE0'
  );
}
