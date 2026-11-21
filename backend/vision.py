"""Image helpers: resize/compress before sending to the vision model."""
import base64
import io

try:
    from .config import MAX_IMAGE_MB
    from .llm import vision_answer
    from .prompts import build_vision_prompt
except ImportError:
    from config import MAX_IMAGE_MB
    from llm import vision_answer
    from prompts import build_vision_prompt


def _strip_data_url(data_url):
    if not data_url:
        return b"", "image/jpeg"
    if data_url.startswith("data:"):
        header, _, b64 = data_url.partition(",")
        mime = "image/jpeg"
        if "image/" in header:
            mime = header.split(";")[0].replace("data:", "").strip() or "image/jpeg"
        try:
            return base64.b64decode(b64), mime
        except Exception:
            return b"", mime
    try:
        return base64.b64decode(data_url), "image/jpeg"
    except Exception:
        return b"", "image/jpeg"


def prepare_image(data_url, max_side=1600, quality=82):
    """Decode, resize and re-encode an image as a JPEG data URL."""
    raw, mime = _strip_data_url(data_url)
    if not raw:
        raise ValueError("Could not decode image data")
    from PIL import Image
    img = Image.open(io.BytesIO(raw))
    img = img.convert("RGB")
    w, h = img.size
    scale = min(1.0, max_side / float(max(w, h)))
    if scale < 1.0:
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=quality, optimize=True)
    encoded = base64.b64encode(out.getvalue()).decode()
    return "data:image/jpeg;base64," + encoded


def describe_images(images, question, language="en"):
    prepared = [prepare_image(img) for img in images]
    content = [{"type": "text", "text": build_vision_prompt(question, language)}]
    for img in prepared:
        content.append({"type": "image_url", "image_url": {"url": img}})
    messages = [
        {"role": "system", "content": "You are a helpful visual assistant. Describe and answer clearly, do not identify people."},
        {"role": "user", "content": content},
    ]
    return vision_answer(messages)