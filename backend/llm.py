"""Groq LLM wrapper: simple chat, streaming, vision and transcription.

All model names come from config/.env. On rate-limit or model errors we retry
once with the FAST model so the app never crashes.
"""
import time

try:
    from .config import (
        GROQ_API_KEY,
        GROQ_MODEL,
        GROQ_MODEL_FAST,
        GROQ_MODEL_VISION,
        GROQ_MODEL_STT,
    )
except ImportError:
    from config import (
        GROQ_API_KEY,
        GROQ_MODEL,
        GROQ_MODEL_FAST,
        GROQ_MODEL_VISION,
        GROQ_MODEL_STT,
    )

_client = None


def has_groq():
    return bool(GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here")


def _get_client():
    global _client
    if _client is None:
        from groq import Groq
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def generate_answer(messages, temperature=0.3, max_tokens=1200, model=None):
    if not has_groq():
        raise RuntimeError("GROQ_API_KEY not configured")
    client = _get_client()
    candidates = [model or GROQ_MODEL]
    if not model and GROQ_MODEL_FAST and GROQ_MODEL_FAST != GROQ_MODEL:
        candidates.append(GROQ_MODEL_FAST)
    last_err = None
    for m in candidates:
        try:
            resp = client.chat.completions.create(
                model=m,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return (resp.choices[0].message.content or "").strip()
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(0.4)
    raise last_err if last_err else RuntimeError("Groq request failed")


def stream_answer(messages, temperature=0.3, max_tokens=1200, model=None, demo_text=""):
    """Yield text chunks. Falls back to a demo message when no key is set."""
    if not has_groq():
        yield demo_text or (
            "Demo mode: AI backend key abhi set nahi hai. "
            ".env me GROQ_API_KEY set karo, tab real jawab aayenge."
        )
        return
    client = _get_client()
    try:
        stream = client.chat.completions.create(
            model=model or GROQ_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
        )
        got = False
        for chunk in stream:
            try:
                delta = chunk.choices[0].delta.content
            except Exception:
                delta = None
            if delta:
                got = True
                yield delta
        if not got:
            yield generate_answer(messages, temperature, max_tokens, model)
    except Exception:
        try:
            yield generate_answer(messages, temperature, max_tokens, model)
        except Exception:
            yield demo_text or "Sorry, AI se jawab nahi mil paya. Thodi der baad try karein."


def vision_answer(messages, temperature=0.3, max_tokens=1200):
    if not has_groq():
        raise RuntimeError("GROQ_API_KEY not configured")
    client = _get_client()
    try:
        resp = client.chat.completions.create(
            model=GROQ_MODEL_VISION,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return (resp.choices[0].message.content or "").strip()
    except Exception:
        # Fallback to main model (text only) so the user still gets an answer.
        return generate_answer(messages, temperature, max_tokens)


def transcribe(audio_bytes, filename="audio.webm"):
    if not has_groq():
        raise RuntimeError("GROQ_API_KEY not configured")
    client = _get_client()
    resp = client.audio.transcriptions.create(
        file=(filename, audio_bytes),
        model=GROQ_MODEL_STT,
    )
    return getattr(resp, "text", "") or ""


def demo_answer(question, sources=None, reason=None):
    sources = sources or []
    src_text = "; ".join(sources[:3]) if sources else "data/sources.json (official source list)"
    reason_text = " (%s)" % reason if reason else ""
    return (
        "Demo mode%s: AI backend key/config abhi set nahi hai, isliye main abhi limited/demo answer de raha hoon.\n\n" % reason_text +
        "Sawal: %s\n\n" % question +
        "Agle step: .env me GROQ_API_KEY set karo aur data/raw me material download karke ingest karo, tab real jawab milega.\n"
        "Sources: %s" % src_text
    )