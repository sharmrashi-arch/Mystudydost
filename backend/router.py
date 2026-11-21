"""Decide which kind of answer a question needs (lightweight heuristics)."""

MATH_HINTS = [
    "solve", "calculate", "compute", "step by step", "derivative", "differentiate",
    "integral", "integrate", "equation", "simplify", "factorise", "factorize",
    "prove that", "find the value", "value of x", "sum of", "product of", "probability",
]

VISION_HINTS = ["this image", "in the image", "photo", "picture", "what is this", "read this", "diagram"]


def decide_mode(question, has_context=False, has_images=False):
    q = (question or "").lower()
    if has_images:
        return "vision"
    if any(h in q for h in MATH_HINTS):
        return "math"
    if has_context:
        return "rag"
    return "chat"


def short_title(text, max_len=48):
    t = " ".join((text or "").split())
    if len(t) <= max_len:
        return t or "New Chat"
    return t[: max_len - 1].rstrip() + "…"