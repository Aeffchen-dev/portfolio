import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();

// ─── theme ───────────────────────────────────────────────────────────────────
const BG       = '060606';
const TEXT     = 'F0F0F0';
const MUTED    = '555555';
const DIM      = '222222';
const ACCENT   = 'FFFFFF';
const FONT     = 'DM Sans';
const FONT_FB  = 'Helvetica Neue';

pptx.layout  = 'LAYOUT_WIDE';          // 13.33 × 7.5 in
pptx.author  = 'Jana Gramlich';
pptx.subject = 'Agentic Design Systems';
pptx.title   = 'Agentic Design Systems';

// ─── helpers ─────────────────────────────────────────────────────────────────
const W = 13.33;
const H = 7.5;

const PAD_X = 1.4;
const PAD_Y = 1.1;

function bg(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: BG },
    line: { color: BG },
  });
}

function slideNum(slide, n, total = 10) {
  slide.addText(`${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}`, {
    x: W - 1.6, y: 0.28, w: 1.4, h: 0.22,
    fontSize: 8, color: MUTED, fontFace: FONT_FB,
    align: 'right', charSpacing: 1.5,
  });
}

function label(slide, text, y = PAD_Y) {
  slide.addText(text.toUpperCase(), {
    x: PAD_X, y, w: 8, h: 0.2,
    fontSize: 8, color: MUTED, fontFace: FONT_FB,
    charSpacing: 2, bold: false,
  });
}

function rule(slide, y = PAD_Y) {
  slide.addShape(pptx.ShapeType.rect, {
    x: PAD_X, y, w: 0.5, h: 0.01,
    fill: { color: DIM }, line: { color: DIM },
  });
}

function headline(slide, text, x = PAD_X, y = PAD_Y + 0.35, w = 9, size = 56) {
  slide.addText(text, {
    x, y, w, h: 3.5,
    fontSize: size, color: TEXT, fontFace: FONT_FB,
    bold: false, valign: 'top',
    lineSpacingMultiple: 1.08,
  });
}

function body(slide, lines, y, { color = TEXT, size = 22, w = 7 } = {}) {
  slide.addText(lines, {
    x: PAD_X, y, w, h: H - y - 0.6,
    fontSize: size, color, fontFace: FONT_FB,
    bold: false, valign: 'top',
    lineSpacingMultiple: 1.55,
  });
}

function itemRow(slide, n, title, desc, y) {
  // number
  slide.addText(n, {
    x: PAD_X, y, w: 0.35, h: 0.28,
    fontSize: 9, color: MUTED, fontFace: FONT_FB, valign: 'top',
  });
  // title
  slide.addText(title, {
    x: PAD_X + 0.4, y, w: 9.5, h: 0.28,
    fontSize: 15, color: TEXT, fontFace: FONT_FB, bold: true, valign: 'top',
  });
  // description
  if (desc) {
    slide.addText(desc, {
      x: PAD_X + 0.4, y: y + 0.28, w: 9.5, h: 0.36,
      fontSize: 12, color: MUTED, fontFace: FONT_FB, valign: 'top',
      lineSpacingMultiple: 1.4,
    });
  }
}

// ─── slide 01 — title ────────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 1);

  label(s, 'Ideas — May 2026', PAD_Y);

  s.addText('Agentic\nDesign\nSystems', {
    x: PAD_X, y: PAD_Y + 0.35, w: 9, h: 4.2,
    fontSize: 72, color: TEXT, fontFace: FONT_FB,
    bold: false, lineSpacingMultiple: 1.08,
    charSpacing: -0.5,
  });

  s.addText('What happens when your design system\ngrows a nervous system.', {
    x: PAD_X, y: H - 1.45, w: 8, h: 0.7,
    fontSize: 14, color: MUTED, fontFace: FONT_FB,
    lineSpacingMultiple: 1.55,
  });
}

// ─── slide 02 — the problem ──────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 2);
  rule(s, PAD_Y);

  s.addText([
    { text: 'Design systems are built to scale consistency.\n', options: { color: TEXT } },
    { text: 'They rarely scale themselves.', options: { color: ACCENT, bold: true } },
  ], {
    x: PAD_X, y: PAD_Y + 0.35, w: 9, h: 1.4,
    fontSize: 24, fontFace: FONT_FB, lineSpacingMultiple: 1.5, valign: 'top',
  });

  s.addText(
    'Tokens drift. Components diverge. Documentation lags months behind\nreality. The system is always catching up — never ahead.',
    {
      x: PAD_X, y: PAD_Y + 2.1, w: 9, h: 1.2,
      fontSize: 16, color: MUTED, fontFace: FONT_FB, lineSpacingMultiple: 1.55,
    }
  );
}

// ─── slide 03 — core idea ────────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 3);
  label(s, 'The idea', PAD_Y);

  s.addText([
    { text: 'What if the design system\ncould ', options: { color: TEXT } },
    { text: 'notice, adapt,', options: { color: MUTED, italic: true } },
    { text: '\nand ', options: { color: TEXT } },
    { text: 'propose', options: { color: MUTED, italic: true } },
    { text: ' —\non its own?', options: { color: TEXT } },
  ], {
    x: PAD_X, y: PAD_Y + 0.5, w: 10, h: 4,
    fontSize: 42, fontFace: FONT_FB, lineSpacingMultiple: 1.25, valign: 'top',
    charSpacing: -0.3,
  });
}

// ─── slide 04 — three shifts ─────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 4);
  label(s, 'Three shifts', PAD_Y);

  const items = [
    ['01', 'From docs to dialogue',
     'Ask the system a question. Get a grounded answer with token references and usage examples — not a stale wiki page.'],
    ['02', 'From static to generative',
     'Components as intent, not just files. An agent interprets a brief and scaffolds the right variant — constrained by the system, never outside it.'],
    ['03', 'From maintained to self-maintaining',
     'Agents that audit drift, flag broken token usage, and open pull requests to bring reality back in line with spec.'],
  ];

  items.forEach(([n, title, desc], i) => {
    itemRow(s, n, title, desc, PAD_Y + 0.5 + i * 1.1);
  });
}

// ─── slide 05 — tokens as language ───────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 5);
  label(s, 'Tokens as language', PAD_Y);

  s.addText([
    { text: 'Design tokens aren\'t just CSS variables.\nThey\'re the ', options: { color: TEXT } },
    { text: 'vocabulary', options: { color: ACCENT, bold: true } },
    { text: ' agents use to reason\nabout visual decisions.', options: { color: TEXT } },
  ], {
    x: PAD_X, y: PAD_Y + 0.45, w: 6.2, h: 1.8,
    fontSize: 18, fontFace: FONT_FB, lineSpacingMultiple: 1.55, valign: 'top',
  });

  s.addText(
    'When a token has semantic meaning —\ncolor.feedback.error instead of #f04 —\nan agent can make choices that are design-correct,\nnot just technically valid.',
    {
      x: PAD_X, y: PAD_Y + 2.5, w: 6.2, h: 1.4,
      fontSize: 13, color: MUTED, fontFace: FONT_FB, lineSpacingMultiple: 1.5,
    }
  );

  const tags = ['Semantic tokens','Component API','Usage rules','Variant logic','Motion spec','Accessibility','Spacing scale','Breakpoints'];
  const colX = 8.2;
  tags.forEach((t, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    s.addShape(pptx.ShapeType.roundRect, {
      x: colX + col * 2.2, y: PAD_Y + 0.45 + row * 0.52,
      w: 2.0, h: 0.36,
      fill: { color: '111111' },
      line: { color: DIM, pt: 0.5 },
      rectRadius: 0.18,
    });
    s.addText(t, {
      x: colX + col * 2.2 + 0.08, y: PAD_Y + 0.45 + row * 0.52,
      w: 1.84, h: 0.36,
      fontSize: 9, color: MUTED, fontFace: FONT_FB,
      charSpacing: 0.5, valign: 'middle', align: 'center',
    });
  });
}

// ─── slide 06 — what agents can do ───────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 6);
  label(s, 'What agents can do', PAD_Y);

  const items = [
    ['→', 'Audit', 'scan the codebase for off-token color or spacing values and surface them as issues'],
    ['→', 'Generate', 'produce new components from a brief, grounded in your existing token set and patterns'],
    ['→', 'Sync', 'keep Figma and code in agreement, flagging divergence instead of letting it compound'],
    ['→', 'Document', 'write and update usage notes from actual component usage in the product'],
    ['→', 'Advise', 'answer "which component should I use here?" with context from real patterns'],
  ];

  items.forEach(([n, title, desc], i) => {
    s.addText(n, {
      x: PAD_X, y: PAD_Y + 0.45 + i * 0.9, w: 0.3, h: 0.26,
      fontSize: 10, color: MUTED, fontFace: FONT_FB, valign: 'top',
    });
    s.addText([
      { text: title + ' ', options: { bold: true, color: TEXT } },
      { text: '— ' + desc, options: { color: MUTED } },
    ], {
      x: PAD_X + 0.35, y: PAD_Y + 0.45 + i * 0.9, w: 10.5, h: 0.58,
      fontSize: 13, fontFace: FONT_FB, lineSpacingMultiple: 1.4, valign: 'top',
    });
  });
}

// ─── slide 07 — the feedback loop ────────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 7);
  rule(s, PAD_Y);

  s.addText([
    { text: 'Design system as ', options: { color: TEXT } },
    { text: 'living spec', options: { color: ACCENT, bold: true } },
    { text: '.\nProduct as ', options: { color: TEXT } },
    { text: 'constant signal', options: { color: ACCENT, bold: true } },
    { text: '.\nAgents as the ', options: { color: TEXT } },
    { text: 'connective tissue', options: { color: ACCENT, bold: true } },
    { text: '\nbetween them.', options: { color: TEXT } },
  ], {
    x: PAD_X, y: PAD_Y + 0.4, w: 9.5, h: 2.8,
    fontSize: 26, fontFace: FONT_FB, lineSpacingMultiple: 1.5, valign: 'top',
  });

  s.addText('The loop closes: what\'s built informs the system, the system informs what\'s built. No more divergence tax.', {
    x: PAD_X, y: PAD_Y + 3.5, w: 9, h: 0.8,
    fontSize: 14, color: MUTED, fontFace: FONT_FB, lineSpacingMultiple: 1.55,
  });
}

// ─── slide 08 — the real tension ─────────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 8);
  label(s, 'The real tension', PAD_Y);

  s.addText([
    { text: 'Automation scales consistency.\n', options: { color: TEXT } },
    { text: 'Craft doesn\'t scale.', options: { color: MUTED, italic: true } },
  ], {
    x: PAD_X, y: PAD_Y + 0.5, w: 9.5, h: 2.2,
    fontSize: 38, fontFace: FONT_FB, lineSpacingMultiple: 1.25, valign: 'top',
    charSpacing: -0.2,
  });

  s.addText(
    'If agents handle all the maintenance work, does the designer stop\nunderstanding the system deeply? Does the system stop surprising\nus in useful ways?',
    {
      x: PAD_X, y: PAD_Y + 3.0, w: 9.5, h: 0.9,
      fontSize: 14, color: MUTED, fontFace: FONT_FB, lineSpacingMultiple: 1.55,
    }
  );

  s.addText('The risk isn\'t that agents get things wrong. It\'s that they get things perfectly average.', {
    x: PAD_X, y: PAD_Y + 4.0, w: 9.5, h: 0.6,
    fontSize: 14, color: MUTED, fontFace: FONT_FB, lineSpacingMultiple: 1.55, italic: true,
  });
}

// ─── slide 09 — who owns the taste ───────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 9);
  rule(s, PAD_Y);

  s.addText('Who owns the taste?', {
    x: PAD_X, y: PAD_Y + 0.4, w: 10, h: 0.8,
    fontSize: 32, color: ACCENT, fontFace: FONT_FB, bold: true,
  });

  s.addText(
    'Agents can reason about rules. They can\'t yet feel when a rule should be\nbroken for the right reason. That instinct — the one that makes a design\nsystem a design system and not a style guide — still lives with people.',
    {
      x: PAD_X, y: PAD_Y + 1.5, w: 10, h: 1.5,
      fontSize: 16, color: TEXT, fontFace: FONT_FB, lineSpacingMultiple: 1.6,
    }
  );

  s.addText([
    { text: 'The role shifts: from ', options: { color: MUTED } },
    { text: 'writing and enforcing', options: { color: MUTED, italic: true } },
    { text: ' the system to ', options: { color: MUTED } },
    { text: 'teaching and trusting', options: { color: MUTED, italic: true } },
    { text: ' it.', options: { color: MUTED } },
  ], {
    x: PAD_X, y: PAD_Y + 3.3, w: 10, h: 0.6,
    fontSize: 15, fontFace: FONT_FB, lineSpacingMultiple: 1.5,
  });
}

// ─── slide 10 — what I'm exploring ───────────────────────────────────────────
{
  const s = pptx.addSlide();
  bg(s);
  slideNum(s, 10);
  label(s, 'What I\'m exploring', PAD_Y);

  const items = [
    ['→', 'A token schema designed to be agent-readable from day one'],
    ['→', 'An audit agent that runs on CI — no drift ships silently'],
    ['→', 'Figma ↔ code sync with an agent in the loop, not a person'],
    ['→', 'Taste gates — human review steps that can\'t be automated away'],
  ];

  items.forEach(([n, text], i) => {
    s.addText(n, {
      x: PAD_X, y: PAD_Y + 0.5 + i * 0.7, w: 0.3, h: 0.26,
      fontSize: 10, color: MUTED, fontFace: FONT_FB, valign: 'top',
    });
    s.addText(text, {
      x: PAD_X + 0.35, y: PAD_Y + 0.5 + i * 0.7, w: 10.5, h: 0.5,
      fontSize: 15, color: TEXT, fontFace: FONT_FB, valign: 'top',
    });
  });

  s.addText([
    { text: 'The design system of the near future isn\'t a tool you maintain.\nIt\'s a collaborator you ', options: { color: MUTED } },
    { text: 'shape.', options: { color: TEXT, bold: true } },
  ], {
    x: PAD_X, y: H - 1.6, w: 9.5, h: 0.9,
    fontSize: 16, fontFace: FONT_FB, lineSpacingMultiple: 1.55,
  });
}

// ─── export ───────────────────────────────────────────────────────────────────
await pptx.writeFile({ fileName: 'slides-agentic-design-systems.pptx' });
console.log('Done → slides-agentic-design-systems.pptx');
