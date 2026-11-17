LANG_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "te": "Telugu",
    "mr": "Marathi",
    "ta": "Tamil",
    "ur": "Urdu",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "or": "Odia",
    "pa": "Punjabi",
    "as": "Assamese",
    "mai": "Maithili",
    "sa": "Sanskrit",
}


def build_system_prompt(language="en"):
    lang = LANG_NAMES.get((language or "en").lower(), "English")
    return (
        "You are MyStudyDost, a study assistant for Indian students. "
        "Answer only study-related questions using provided context and official/free sources. "
        "If information is missing, say clearly what is not available. Do not invent facts. "
        "Keep answers clear and student-friendly. "
        "Respond in %s unless the user explicitly asks for another language. " % lang +
        "When sources/context are provided, mention source references."
    )


def build_rag_prompt(question, context_blocks, language="en"):
    ctx = "\n\n".join(context_blocks) if context_blocks else "No local textbook/syllabus context found."
    return (
        "Question: %s\n\n" % question +
        "Available context (from ingested official materials):\n%s\n\n" % ctx +
        "Instructions:\n"
        "- Use the context above when relevant.\n"
        "- If context is insufficient, answer briefly with what is known and state that more official material needs to be ingested.\n"
        "- Include a short 'Sources' note based on provided context/source hints.\n"
    )


def build_quiz_prompt(topic, context_blocks, language="en"):
    ctx = "\n\n".join(context_blocks) if context_blocks else "No local context found."
    lang = LANG_NAMES.get((language or "en").lower(), "English")
    return (
        "Create a short quiz in %s for topic: %s\n" % (lang, topic) +
        "Use only the context if relevant. Return 5 MCQs in plain text with options A-D and an answer key at the end.\n\n"
        "Context:\n%s" % ctx
    )
