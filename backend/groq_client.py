try:
    from .config import GROQ_API_KEY, GROQ_MODEL
except ImportError:
    from config import GROQ_API_KEY, GROQ_MODEL


def has_groq():
    return bool(GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here")


def generate_answer(messages, temperature=0.2, max_tokens=900, model=None):
    if not has_groq():
        raise RuntimeError("GROQ_API_KEY not configured")
    from groq import Groq

    client = Groq(api_key=GROQ_API_KEY)
    resp = client.chat.completions.create(
        model=model or GROQ_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return (resp.choices[0].message.content or "").strip()


def demo_answer(question, sources=None, reason=None):
    sources = sources or []
    src_text = "; ".join(sources[:3]) if sources else "data/sources.json (official source list)"
    reason_text = " (%s)" % reason if reason else ""
    return (
        "Demo mode%s: AI backend key/config abhi set nahi hai, isliye main abhi limited/demo answer de raha hoon.\n\n" % reason_text +
        "Sawal: %s\n\n" % question +
        "Agle step: .env me GROQ_API_KEY set karo aur data/raw me material download karke ingest karo, tab real syllabus/book-based jawab milega.\n"
        "Sources: %s" % src_text
    )
