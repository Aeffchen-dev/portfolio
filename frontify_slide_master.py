"""
Frontify "Rebranding Redefined" Style — Google Slides Master Template
Generates a .pptx file importable into Google Slides.
12 slide layouts covering all common presentation needs.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml.ns import qn
from lxml import etree
import math

# ─────────────────────────────────────────────
# BRAND TOKENS
# ─────────────────────────────────────────────
DARK_BG      = RGBColor(0x10, 0x0E, 0x1D)   # primary dark background
VIOLET       = RGBColor(0x58, 0x34, 0xE8)   # Frontify violet
VIOLET_DARK  = RGBColor(0x3A, 0x20, 0xB0)   # deeper violet
CREAM        = RGBColor(0xF2, 0xED, 0xE0)   # warm off-white
CREAM_MID    = RGBColor(0xE3, 0xDB, 0xC8)   # mid cream
WHITE        = RGBColor(0xFF, 0xFF, 0xFF)
DARK_TEXT    = RGBColor(0x1A, 0x16, 0x2A)   # near-black for light backgrounds
MID_GRAY     = RGBColor(0x88, 0x84, 0xA0)   # muted gray
LIGHT_GRAY   = RGBColor(0xC8, 0xC4, 0xD8)   # light gray

# Chapter/section accent palette
CH_01 = RGBColor(0x58, 0x34, 0xE8)   # 01 Typography  – violet
CH_02 = RGBColor(0xFF, 0x60, 0x38)   # 02 Color       – orange
CH_03 = RGBColor(0x00, 0xD4, 0xB0)   # 03 Sound       – teal
CH_04 = RGBColor(0x38, 0x80, 0xFF)   # 04 Motion      – electric blue
CH_05 = RGBColor(0x30, 0xD1, 0x58)   # 05 Flexibility – green
CH_06 = RGBColor(0xFF, 0x37, 0x5F)   # 06 Culture     – crimson

CHAPTER_COLORS = [CH_01, CH_02, CH_03, CH_04, CH_05, CH_06]
CHAPTER_NAMES  = ["Typography", "Color", "Sound", "Motion", "Flexibility", "Cultural Relevance"]

# ─────────────────────────────────────────────
# DIMENSIONS  (16 : 9 widescreen)
# ─────────────────────────────────────────────
W = Inches(13.333)
H = Inches(7.5)
M = Inches(0.9)    # standard margin

# ─────────────────────────────────────────────
# FONTS  (both available in Google Fonts)
# ─────────────────────────────────────────────
FH = "Montserrat"   # heading / display
FB = "Inter"        # body / caption

# ─────────────────────────────────────────────
# LOW-LEVEL HELPERS
# ─────────────────────────────────────────────

def bg(slide, color):
    """Solid background fill for a slide."""
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def rect(slide, l, t, w, h, fill=None, line=None, alpha=None):
    """Add a rectangle; returns the shape."""
    shp = slide.shapes.add_shape(1, l, t, w, h)   # 1 = MSO_AUTO_SHAPE_TYPE.RECTANGLE
    if fill is not None:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    else:
        shp.fill.background()
    if line is not None:
        shp.line.color.rgb = line
        shp.line.width = Pt(1)
    else:
        shp.line.fill.background()
    return shp


def txt(slide, text, l, t, w, h,
        font=FH, size=24, bold=False, italic=False,
        color=WHITE, align=PP_ALIGN.LEFT, wrap=True):
    """Add a text box."""
    box = slide.shapes.add_textbox(l, t, w, h)
    tf  = box.text_frame
    tf.word_wrap = wrap
    p   = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.name  = font
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return box


def multiline_txt(slide, lines, l, t, w, h,
                  font=FB, size=16, bold=False, color=WHITE,
                  align=PP_ALIGN.LEFT, line_spacing=Pt(8)):
    """Add a text box with multiple paragraphs."""
    box = slide.shapes.add_textbox(l, t, w, h)
    tf  = box.text_frame
    tf.word_wrap = True
    for i, (line_text, line_cfg) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = line_cfg.get("align", align)
        if i > 0:
            p.space_before = line_spacing
        run = p.add_run()
        run.text = line_text
        run.font.name  = line_cfg.get("font", font)
        run.font.size  = Pt(line_cfg.get("size", size))
        run.font.bold  = line_cfg.get("bold", bold)
        run.font.color.rgb = line_cfg.get("color", color)
    return box


def img_placeholder(slide, l, t, w, h, label="[IMAGE]", color=None):
    """Image placeholder rectangle with centred label."""
    fill_c = color or RGBColor(0x28, 0x24, 0x3A)
    shp = rect(slide, l, t, w, h, fill=fill_c)
    # label text
    box = slide.shapes.add_textbox(l, t + h // 2 - Inches(0.3), w, Inches(0.6))
    tf = box.text_frame
    p  = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = label
    run.font.name  = FB
    run.font.size  = Pt(13)
    run.font.color.rgb = MID_GRAY
    return shp


def logo_text(slide, l, t, color=WHITE, size=15):
    """Frontify wordmark placeholder."""
    return txt(slide, "frontify", l, t, Inches(1.8), Inches(0.4),
               font=FH, size=size, bold=True, color=color)


def slide_label(slide, label):
    """Grey annotation in bottom-right for orientation."""
    txt(slide, label,
        W - Inches(6), H - Inches(0.38), Inches(5.8), Inches(0.3),
        font=FB, size=9, color=MID_GRAY, align=PP_ALIGN.RIGHT)


def divider_line(slide, y, color=VIOLET, width_pct=0.12):
    """Thin horizontal accent rule."""
    rect(slide, M, y, Inches(13.333 * width_pct), Pt(2), fill=color)


# ─────────────────────────────────────────────
# PRESENTATION SETUP
# ─────────────────────────────────────────────
prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

blank = prs.slide_layouts[6]   # truly blank layout


# ══════════════════════════════════════════════
# SLIDE 01 — COVER / TITLE
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, DARK_BG)

# Violet left accent bar
rect(s, 0, 0, Inches(0.22), H, fill=VIOLET)

# Subtle violet glow block (top-right)
rect(s, W - Inches(3.5), 0, Inches(3.5), Inches(2.8),
     fill=RGBColor(0x2A, 0x14, 0x70))

# Main headline
txt(s, "REBRANDING\nREDEFINED",
    M, Inches(1.1), Inches(9.5), Inches(3.4),
    font=FH, size=82, bold=True, color=WHITE)

# Violet rule below headline
rect(s, M, Inches(4.6), Inches(2.4), Pt(3), fill=VIOLET)

# Subtitle
txt(s, "Six elements of modern brand craft",
    M, Inches(4.85), Inches(8), Inches(0.65),
    font=FB, size=22, color=LIGHT_GRAY)

# Tagline / edition line
txt(s, "A Frontify Guide  ·  2024",
    M, Inches(5.7), Inches(6), Inches(0.5),
    font=FB, size=14, color=MID_GRAY)

# Logo
logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 01 — COVER")


# ══════════════════════════════════════════════
# SLIDE 02 — TABLE OF CONTENTS
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, CREAM)

# Headline
txt(s, "Six elements of\nmodern brand craft",
    M, Inches(0.55), Inches(6), Inches(1.6),
    font=FH, size=38, bold=True, color=DARK_TEXT)

# Violet accent rule
rect(s, M, Inches(2.3), Inches(1.6), Pt(3), fill=VIOLET)

# Six chapter items in a 2×3 grid
chapters = [
    ("01", "Typography",         "How letterforms shape brand voice"),
    ("02", "Color",              "The psychology and strategy of hue"),
    ("03", "Sound",              "Sonic identity in a multi-modal world"),
    ("04", "Motion",             "Animation as brand expression"),
    ("05", "Flexibility",        "Systems that adapt without losing identity"),
    ("06", "Cultural Relevance", "Brands that move with culture"),
]

col_x = [M, Inches(6.8)]
row_start = Inches(2.55)
row_gap   = Inches(1.6)

for i, (num, name, desc) in enumerate(chapters):
    col = i % 2
    row = i // 2
    x = col_x[col]
    y = row_start + row * row_gap
    accent = CHAPTER_COLORS[i]

    # Number pill
    r = rect(s, x, y, Inches(0.55), Inches(0.55), fill=accent)
    txt(s, num, x + Inches(0.06), y + Inches(0.06),
        Inches(0.43), Inches(0.43),
        font=FH, size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

    # Chapter name
    txt(s, name, x + Inches(0.72), y, Inches(5.5), Inches(0.45),
        font=FH, size=17, bold=True, color=DARK_TEXT)

    # Description
    txt(s, desc, x + Inches(0.72), y + Inches(0.42), Inches(5.5), Inches(0.5),
        font=FB, size=13, color=MID_GRAY)

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 02 — TABLE OF CONTENTS")


# ══════════════════════════════════════════════
# SLIDES 03–08 — CHAPTER DIVIDERS (one per chapter)
# ══════════════════════════════════════════════
for i, (ch_color, ch_name) in enumerate(zip(CHAPTER_COLORS, CHAPTER_NAMES)):
    s = prs.slides.add_slide(blank)
    bg(s, DARK_BG)

    num_str = f"0{i+1}"

    # Large colour block left half
    rect(s, 0, 0, Inches(5.8), H, fill=ch_color)

    # Big chapter number (watermark style on the block)
    txt(s, num_str,
        Inches(0.15), Inches(0.4), Inches(5.4), Inches(4.5),
        font=FH, size=260, bold=True,
        color=RGBColor(
            min(ch_color[0] + 40, 255),
            min(ch_color[1] + 40, 255),
            min(ch_color[2] + 40, 255)
        ))

    # Chapter label (small caps style)
    txt(s, f"CHAPTER {num_str}",
        Inches(6.3), Inches(1.4), Inches(6.5), Inches(0.5),
        font=FB, size=13, color=ch_color)

    # Chapter name
    txt(s, ch_name,
        Inches(6.3), Inches(1.95), Inches(6.5), Inches(2.0),
        font=FH, size=52, bold=True, color=WHITE)

    # Accent rule
    rect(s, Inches(6.3), Inches(4.05), Inches(2.0), Pt(2), fill=ch_color)

    # Brief descriptor
    desc_map = {
        0: "How letterforms shape brand voice and personality",
        1: "The psychology and strategy of hue in modern branding",
        2: "Sonic identity in a multi-modal, always-on world",
        3: "Animation as a living expression of brand character",
        4: "Systems that adapt fluidly without losing their identity",
        5: "Brands that move with culture — and sometimes define it",
    }
    txt(s, desc_map[i],
        Inches(6.3), Inches(4.3), Inches(6.5), Inches(1.2),
        font=FB, size=18, color=LIGHT_GRAY)

    logo_text(s, W - Inches(2.0), H - Inches(0.65), color=ch_color)
    slide_label(s, f"SLIDE 0{i+3} — CHAPTER {num_str} DIVIDER")


# ══════════════════════════════════════════════
# SLIDE 09 — CONTENT + IMAGE (image right)
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, CREAM)

# Text area (left)
txt(s, "Section Headline\nGoes Here",
    M, Inches(1.1), Inches(6.0), Inches(1.8),
    font=FH, size=40, bold=True, color=DARK_TEXT)

rect(s, M, Inches(3.05), Inches(1.4), Pt(2), fill=VIOLET)

txt(s, "Body copy occupies this space. Replace with your key insight, "
       "supporting data point, or narrative paragraph. Aim for 3–5 lines "
       "for comfortable readability at this size.",
    M, Inches(3.2), Inches(5.8), Inches(1.5),
    font=FB, size=17, color=DARK_TEXT)

txt(s, "Supporting detail or citation can go here in a smaller size.",
    M, Inches(4.85), Inches(5.8), Inches(0.6),
    font=FB, size=13, color=MID_GRAY)

# Image placeholder (right)
img_placeholder(s, Inches(7.1), 0, Inches(6.233), H,
                label="[IMAGE PLACEHOLDER]",
                color=RGBColor(0xD8, 0xD2, 0xC4))

logo_text(s, M, H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 09 — CONTENT + IMAGE (right)")


# ══════════════════════════════════════════════
# SLIDE 10 — CONTENT + IMAGE (image left)
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, DARK_BG)

# Image placeholder (left)
img_placeholder(s, 0, 0, Inches(6.0), H,
                label="[IMAGE PLACEHOLDER]",
                color=RGBColor(0x22, 0x1E, 0x32))

# Text area (right)
rx = Inches(6.6)
txt(s, "Section Headline\nGoes Here",
    rx, Inches(1.1), Inches(6.0), Inches(1.8),
    font=FH, size=40, bold=True, color=WHITE)

rect(s, rx, Inches(3.05), Inches(1.4), Pt(2), fill=VIOLET)

txt(s, "Body copy occupies this space. Replace with your key insight, "
       "supporting data point, or narrative paragraph.",
    rx, Inches(3.2), Inches(6.0), Inches(1.5),
    font=FB, size=17, color=LIGHT_GRAY)

txt(s, "Supporting detail or attribution.",
    rx, Inches(4.85), Inches(6.0), Inches(0.6),
    font=FB, size=13, color=MID_GRAY)

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 10 — CONTENT + IMAGE (left)")


# ══════════════════════════════════════════════
# SLIDE 11 — PULL QUOTE
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, DARK_BG)

# Large decorative quote mark
txt(s, "“",
    Inches(0.5), Inches(0.1), Inches(3), Inches(2.5),
    font=FH, size=200, bold=True, color=VIOLET)

# Quote text
txt(s, "Branding isn't about perfecting\nstatic assets. It's about building\nliving systems.",
    M, Inches(1.8), Inches(11.0), Inches(3.0),
    font=FH, size=46, bold=True, color=WHITE)

# Attribution rule
rect(s, M, Inches(5.05), Inches(0.8), Pt(2), fill=VIOLET)

# Attribution
txt(s, "Expert Name  ·  Role, Organisation",
    M, Inches(5.2), Inches(8), Inches(0.5),
    font=FB, size=15, color=MID_GRAY)

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 11 — PULL QUOTE")


# ══════════════════════════════════════════════
# SLIDE 12 — STATISTICS / DATA
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, CREAM)

# Section label
txt(s, "BY THE NUMBERS",
    M, Inches(0.5), Inches(10), Inches(0.5),
    font=FB, size=13, color=MID_GRAY)

# Three stats in equal columns
stats = [
    ("78%",   CH_02, "of brand teams plan a rebrand within the next 3 years"),
    ("3.2×",  CH_03, "more brand recall with consistent motion identity"),
    ("60+",   CH_04, "touchpoints where sonic branding now plays a role"),
]

col_w = Inches(4.0)
gap   = Inches(0.35)
for i, (stat, accent, desc) in enumerate(stats):
    x = M + i * (col_w + gap)

    # Accent bar top
    rect(s, x, Inches(1.25), col_w, Pt(4), fill=accent)

    # Big number
    txt(s, stat, x, Inches(1.4), col_w, Inches(2.0),
        font=FH, size=88, bold=True, color=DARK_TEXT)

    # Divider
    rect(s, x, Inches(3.55), col_w, Pt(1), fill=CREAM_MID)

    # Description
    txt(s, desc, x, Inches(3.7), col_w, Inches(1.8),
        font=FB, size=17, color=DARK_TEXT)

logo_text(s, M, H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 12 — STATISTICS")


# ══════════════════════════════════════════════
# SLIDE 13 — TWO-COLUMN CONTENT
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, DARK_BG)

# Section headline spanning both columns
txt(s, "Headline Spanning Full Width",
    M, Inches(0.55), Inches(11.5), Inches(0.85),
    font=FH, size=36, bold=True, color=WHITE)

rect(s, M, Inches(1.5), Inches(11.5), Pt(1), fill=RGBColor(0x38, 0x34, 0x50))

# Left column
lx = M
txt(s, "Left Column Heading",
    lx, Inches(1.7), Inches(5.5), Inches(0.6),
    font=FH, size=22, bold=True, color=VIOLET)

txt(s, "Left column body copy. Use this for one concept, "
       "comparison point, or argument. Keep each column to one "
       "clear idea for maximum impact in the room.",
    lx, Inches(2.4), Inches(5.5), Inches(2.4),
    font=FB, size=17, color=LIGHT_GRAY)

# Bullet items left
for j, item in enumerate(["Key point one", "Key point two", "Key point three"]):
    rect(s, lx, Inches(4.95 + j * 0.52), Inches(0.1), Inches(0.1), fill=VIOLET)
    txt(s, item, lx + Inches(0.25), Inches(4.88 + j * 0.52),
        Inches(5.3), Inches(0.45),
        font=FB, size=16, color=LIGHT_GRAY)

# Right column
rx = Inches(7.1)
txt(s, "Right Column Heading",
    rx, Inches(1.7), Inches(5.5), Inches(0.6),
    font=FH, size=22, bold=True, color=CH_03)

txt(s, "Right column body copy. Mirrors the structure of the left "
       "column. Works well for before/after, pros/cons, or two "
       "distinct brand frameworks.",
    rx, Inches(2.4), Inches(5.5), Inches(2.4),
    font=FB, size=17, color=LIGHT_GRAY)

for j, item in enumerate(["Key point alpha", "Key point beta", "Key point gamma"]):
    rect(s, rx, Inches(4.95 + j * 0.52), Inches(0.1), Inches(0.1), fill=CH_03)
    txt(s, item, rx + Inches(0.25), Inches(4.88 + j * 0.52),
        Inches(5.3), Inches(0.45),
        font=FB, size=16, color=LIGHT_GRAY)

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 13 — TWO COLUMNS")


# ══════════════════════════════════════════════
# SLIDE 14 — FULL-BLEED IMAGE WITH TEXT OVERLAY
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, RGBColor(0x18, 0x14, 0x26))

# Image placeholder fills entire slide
img_placeholder(s, 0, 0, W, H,
                label="[FULL-BLEED IMAGE PLACEHOLDER]",
                color=RGBColor(0x22, 0x1C, 0x34))

# Dark gradient overlay at bottom
rect(s, 0, Inches(4.2), W, Inches(3.3),
     fill=RGBColor(0x08, 0x06, 0x12))

# Text overlay
txt(s, "Image Caption or\nKey Statement Here",
    M, Inches(4.5), Inches(10), Inches(1.8),
    font=FH, size=42, bold=True, color=WHITE)

txt(s, "Supporting line or image credit",
    M, Inches(6.5), Inches(8), Inches(0.5),
    font=FB, size=14, color=MID_GRAY)

logo_text(s, W - Inches(2.0), H - Inches(0.4), color=WHITE)
slide_label(s, "SLIDE 14 — FULL-BLEED IMAGE")


# ══════════════════════════════════════════════
# SLIDE 15 — CALLOUT / KEY INSIGHT
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, VIOLET)

# Decorative circle (top-right)
# pptx oval = shape type 9
shp = slide.shapes.add_shape(9, W - Inches(3.8), Inches(-1.5),
                              Inches(4.5), Inches(4.5)) if False else None
# Keep it simple: geometric corner block
rect(s, W - Inches(2.8), Inches(-0.6), Inches(3.0), Inches(3.0),
     fill=VIOLET_DARK)

# "KEY INSIGHT" eyebrow
txt(s, "KEY INSIGHT",
    M, Inches(1.5), Inches(10), Inches(0.5),
    font=FB, size=13, color=RGBColor(0xC4, 0xB4, 0xFF))

# Main callout text
txt(s, "A successful rebrand is not a\nmoment — it is a system.",
    M, Inches(2.1), Inches(10.5), Inches(2.4),
    font=FH, size=54, bold=True, color=WHITE)

# Divider
rect(s, M, Inches(4.65), Inches(1.8), Pt(2),
     fill=RGBColor(0xC4, 0xB4, 0xFF))

# Supporting text
txt(s, "Chapter synthesis · Applies across all six brand elements",
    M, Inches(4.9), Inches(9), Inches(0.5),
    font=FB, size=16, color=RGBColor(0xC4, 0xB4, 0xFF))

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=WHITE)
slide_label(s, "SLIDE 15 — KEY INSIGHT CALLOUT")


# ══════════════════════════════════════════════
# SLIDE 16 — SECTION SUMMARY / TAKEAWAYS
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, CREAM)

# Eyebrow
txt(s, "CHAPTER SUMMARY",
    M, Inches(0.5), Inches(6), Inches(0.4),
    font=FB, size=12, color=MID_GRAY)

# Chapter name
txt(s, "Typography",
    M, Inches(0.9), Inches(9), Inches(1.0),
    font=FH, size=54, bold=True, color=DARK_TEXT)

rect(s, M, Inches(2.05), Inches(11.5), Pt(1),
     fill=CREAM_MID)

# Three takeaways
takeaways = [
    ("01", "Typefaces encode meaning",
     "Every letterform carries cultural weight. Choose with intention."),
    ("02", "Variable fonts unlock flexibility",
     "A single typeface can span every context when built on a variable axis."),
    ("03", "Consistency builds trust",
     "Typographic discipline applied across touchpoints deepens brand recognition."),
]

for i, (num, heading, body) in enumerate(takeaways):
    x = M + i * Inches(4.1)
    txt(s, num, x, Inches(2.3), Inches(0.7), Inches(0.7),
        font=FH, size=28, bold=True, color=CH_01)

    txt(s, heading, x, Inches(3.1), Inches(3.7), Inches(0.7),
        font=FH, size=19, bold=True, color=DARK_TEXT)

    txt(s, body, x, Inches(3.9), Inches(3.7), Inches(1.4),
        font=FB, size=14, color=RGBColor(0x5A, 0x56, 0x70))

logo_text(s, M, H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 16 — CHAPTER SUMMARY")


# ══════════════════════════════════════════════
# SLIDE 17 — CLOSING / CTA
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, DARK_BG)

# Full-width violet bar (accent)
rect(s, 0, 0, Inches(0.22), H, fill=VIOLET)

# Large "Thank you" or title
txt(s, "Build brands\nthat last.",
    M, Inches(1.0), Inches(10), Inches(3.0),
    font=FH, size=80, bold=True, color=WHITE)

# Divider
rect(s, M, Inches(4.15), Inches(2.2), Pt(3), fill=VIOLET)

# Sub-message
txt(s, "Explore the full Frontify platform at frontify.com",
    M, Inches(4.4), Inches(9), Inches(0.6),
    font=FB, size=22, color=LIGHT_GRAY)

# URL
txt(s, "frontify.com",
    M, Inches(5.15), Inches(5), Inches(0.6),
    font=FH, size=22, bold=True, color=VIOLET)

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 17 — CLOSING CTA")


# ══════════════════════════════════════════════
# SLIDE 18 — BLANK (LIGHT)  — generic content slide
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, CREAM)

txt(s, "Slide Heading",
    M, Inches(0.6), Inches(11.5), Inches(0.85),
    font=FH, size=36, bold=True, color=DARK_TEXT)

rect(s, M, Inches(1.55), Inches(11.5), Pt(1), fill=CREAM_MID)

txt(s, "Content area — add text, images, or charts here.",
    M, Inches(1.75), Inches(11.5), Inches(4.8),
    font=FB, size=20, color=MID_GRAY)

logo_text(s, M, H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 18 — GENERIC (light)")


# ══════════════════════════════════════════════
# SLIDE 19 — BLANK (DARK)  — generic content slide
# ══════════════════════════════════════════════
s = prs.slides.add_slide(blank)
bg(s, DARK_BG)

txt(s, "Slide Heading",
    M, Inches(0.6), Inches(11.5), Inches(0.85),
    font=FH, size=36, bold=True, color=WHITE)

rect(s, M, Inches(1.55), Inches(11.5), Pt(1),
     fill=RGBColor(0x38, 0x34, 0x50))

txt(s, "Content area — add text, images, or charts here.",
    M, Inches(1.75), Inches(11.5), Inches(4.8),
    font=FB, size=20, color=MID_GRAY)

logo_text(s, W - Inches(2.0), H - Inches(0.65), color=VIOLET)
slide_label(s, "SLIDE 19 — GENERIC (dark)")


# ─────────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────────
OUT = "/home/user/portfolio/frontify-slide-master.pptx"
prs.save(OUT)
print(f"✓  Saved: {OUT}")
print(f"   Slides: {len(prs.slides)}")
print()
print("SLIDE INDEX")
print("─" * 50)
index = [
    "01  Cover / Title",
    "02  Table of Contents",
    "03  Chapter 01 — Typography",
    "04  Chapter 02 — Color",
    "05  Chapter 03 — Sound",
    "06  Chapter 04 — Motion",
    "07  Chapter 05 — Flexibility",
    "08  Chapter 06 — Cultural Relevance",
    "09  Content + Image (image right, light)",
    "10  Content + Image (image left, dark)",
    "11  Pull Quote",
    "12  Statistics / Data",
    "13  Two-Column Content",
    "14  Full-Bleed Image with Overlay",
    "15  Key Insight Callout (violet)",
    "16  Chapter Summary / Takeaways",
    "17  Closing CTA",
    "18  Generic Content (light)",
    "19  Generic Content (dark)",
]
for line in index:
    print(" ", line)
