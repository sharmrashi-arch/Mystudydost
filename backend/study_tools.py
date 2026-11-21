"""Study tools: quiz, flashcards and study plan."""
try:
    from .config import SOURCES_PATH
    from .llm import generate_answer, has_groq, demo_answer
    from .prompts import build_system_prompt, build_quiz_prompt, build_flashcards_prompt, build_study_plan_prompt
    from .rag import retrieve
    from .languages import resolve as resolve_language
except ImportError:
    from config import SOURCES_PATH
    from llm import generate_answer, has_groq, demo_answer
    from prompts import build_system_prompt, build_quiz_prompt, build_flashcards_prompt, build_study_plan_prompt
    from rag import retrieve
    from languages import resolve as resolve_language


def flashcards(topic, board="", klass="", subject="", language="en", count=10):
    t = (topic or "").strip() or "this chapter"
    language = resolve_language(language, t)
    contexts, sources = retrieve(t, board=board, klass=klass, subject=subject)
    if not has_groq():
        return {"text": "Demo flashcards (set GROQ_API_KEY for AI cards):\nQ: What is this topic? | A: Ingest material for real cards.", "sources": sources[:5], "mode": "demo"}
    system = build_system_prompt(language, mode="rag")
    user = build_flashcards_prompt(t, contexts, language, count=count)
    try:
        text = generate_answer([{"role": "system", "content": system}, {"role": "user", "content": user}], temperature=0.4, max_tokens=1400)
    except Exception as e:
        return {"text": demo_answer(t, sources=sources, reason="Groq error: %s" % e), "sources": sources[:5], "mode": "demo"}
    return {"text": text, "sources": sources[:5], "mode": "rag" if contexts else "fallback"}


def study_plan(subjects, days_left, hours_per_day, language="en"):
    language = resolve_language(language, subjects)
    if not has_groq():
        return {"text": "Demo study plan (set GROQ_API_KEY for a personalised plan). Subjects: %s | Days: %s | Hours/day: %s" % (subjects, days_left, hours_per_day), "sources": [], "mode": "demo"}
    system = build_system_prompt(language, mode="chat")
    user = build_study_plan_prompt(subjects, days_left, hours_per_day, language)
    try:
        text = generate_answer([{"role": "system", "content": system}, {"role": "user", "content": user}], temperature=0.4, max_tokens=1400)
    except Exception as e:
        return {"text": demo_answer(subjects, reason="Groq error: %s" % e), "sources": [], "mode": "demo"}
    return {"text": text, "sources": [], "mode": "plan"}