"""Document generators: PDF, Word (docx) and PowerPoint (pptx).

Heavy libraries are imported lazily so the rest of the app still runs if they
are not installed. PDF uses a Unicode font when available (Nirmala UI / Mangal
on Windows) so Hindi and other scripts render.
"""
import os
from xml.sax.saxutils import escape

try:
    from .config import TMP_DIR
except ImportError:
    from config import TMP_DIR


def _find_unicode_font():
    fonts_dir = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts")
    for name in [
        "Nirmala.ttf", "NirmalaB.ttf", "Nirmalab.ttf", "mangal.ttf", "aparajita.ttf",
        "kokila.ttf", "utsaah.ttf", "vrinda.ttf", "shruti.ttf", "sanskrit2003.ttf",
    ]:
        p = os.path.join(fonts_dir, name)
        if os.path.exists(p):
            return p
    return None


def _register_pdf_font():
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    path = _find_unicode_font()
    if path:
        try:
            pdfmetrics.registerFont(TTFont("AppUnicode", path))
            return "AppUnicode"
        except Exception:
            pass
    return "Helvetica"


def _split_blocks(text):
    return [b.strip() for b in (text or "").split("\n")]


def generate_pdf(text, title, out_path):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

    font = _register_pdf_font()
    doc = SimpleDocTemplate(
        str(out_path), pagesize=A4,
        topMargin=18 * mm, bottomMargin=18 * mm, leftMargin=18 * mm, rightMargin=18 * mm,
        title=title or "BrainBuddy",
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("T", parent=styles["Title"], fontName=font, fontSize=20, leading=25)
    body = ParagraphStyle("B", parent=styles["Normal"], fontName=font, fontSize=11, leading=16)
    story = [Paragraph(escape(title or "BrainBuddy"), title_style), Spacer(1, 6 * mm)]
    for block in _split_blocks(text):
        if not block:
            story.append(Spacer(1, 3 * mm))
        else:
            story.append(Paragraph(escape(block).replace("\n", "<br/>"), body))
    doc.build(story)
    return str(out_path)


def generate_docx(text, title, out_path):
    from docx import Document
    from docx.shared import Pt

    doc = Document()
    normal = doc.styles["Normal"]
    normal.font.name = "Nirmala UI"
    normal.font.size = Pt(11)
    doc.add_heading(title or "BrainBuddy", 0)
    for block in _split_blocks(text):
        if block:
            doc.add_paragraph(block)
    doc.save(str(out_path))
    return str(out_path)


def generate_pptx(text, title, out_path, slides=8):
    from pptx import Presentation
    from pptx.util import Pt

    prs = Presentation()
    # Title slide
    s = prs.slides.add_slide(prs.slide_layouts[0])
    s.shapes.title.text = title or "BrainBuddy"
    if len(s.placeholders) > 1:
        s.placeholders[1].text = "BrainBuddy"

    bullets = [b.strip() for b in _split_blocks(text) if b.strip()]
    per_slide = 5
    chunks = [bullets[i:i + per_slide] for i in range(0, len(bullets), per_slide)] or [["(No content)"]]
    for chunk in chunks[: max(1, slides - 2)]:
        slide = prs.slides.add_slide(prs.slide_layouts[1])
        slide.shapes.title.text = title or "BrainBuddy"
        body = slide.placeholders[1].text_frame
        body.clear()
        for i, b in enumerate(chunk):
            p = body.paragraphs[0] if i == 0 else body.add_paragraph()
            p.text = b
            for run in p.runs:
                run.font.size = Pt(18)
                run.font.name = "Nirmala UI"
    # Summary slide
    summary = prs.slides.add_slide(prs.slide_layouts[1])
    summary.shapes.title.text = "Summary"
    tf = summary.placeholders[1].text_frame
    tf.clear()
    tf.paragraphs[0].text = "Quick recap of the key points above."
    prs.save(str(out_path))
    return str(out_path)


def generate(kind, text, title, out_path, slides=8):
    kind = (kind or "pdf").lower()
    if kind == "docx":
        return generate_docx(text, title, out_path)
    if kind == "pptx":
        return generate_pptx(text, title, out_path, slides=slides)
    return generate_pdf(text, title, out_path)