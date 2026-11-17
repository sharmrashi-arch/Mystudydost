import json
from pathlib import Path

try:
    from .config import DB_DIR, RETRIEVAL_TOP_K, DISTANCE_THRESHOLD, SOURCES_PATH
    from .prompts import build_system_prompt, build_rag_prompt, build_quiz_prompt
    from .groq_client import generate_answer, demo_answer, has_groq
    from .serp_client import serp_search
except ImportError:
    from config import DB_DIR, RETRIEVAL_TOP_K, DISTANCE_THRESHOLD, SOURCES_PATH
    from prompts import build_system_prompt, build_rag_prompt, build_quiz_prompt
    from groq_client import generate_answer, demo_answer, has_groq
    from serp_client import serp_search

_collection = None


def _load_collection():
    global _collection
    if _collection is not None:
        return _collection
    try:
        import chromadb
        from chromadb.utils import embedding_functions
        if not Path(str(DB_DIR)).exists():
            return None
        client = chromadb.PersistentClient(path=str(DB_DIR))
        ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        try:
            _collection = client.get_collection(name="mystudydost", embedding_function=ef)
        except Exception:
            return None
        return _collection
    except Exception:
        return None


def _load_source_hints(limit=5):
    try:
        with open(SOURCES_PATH, "r", encoding="utf-8") as f:
            items = json.load(f)
        out = []
        for i in items[:limit]:
            url = i.get("url")
            if url:
                out.append("%s: %s" % (i.get("title", "Source"), url))
        return out
    except Exception:
        return []


def retrieve(query, board="", klass="", subject="", k=RETRIEVAL_TOP_K):
    col = _load_collection()
    if col is None:
        return [], []
    where_clauses = []
    if board:
        where_clauses.append({"board": {"$eq": board}})
    if klass:
        where_clauses.append({"class": {"$eq": klass}})
    if subject:
        where_clauses.append({"subject": {"$eq": subject}})
    where = None
    if len(where_clauses) == 1:
        where = where_clauses[0]
    elif len(where_clauses) > 1:
        where = {"$and": where_clauses}
    try:
        res = col.query(query_texts=[query], n_results=k, where=where, include=["documents", "metadatas", "distances"])
    except Exception:
        try:
            res = col.query(query_texts=[query], n_results=k, include=["documents", "metadatas", "distances"])
        except Exception:
            return [], []
    docs = (res.get("documents") or [[]])[0] or []
    metas = (res.get("metadatas") or [[]])[0] or []
    dists = (res.get("distances") or [[]])[0] or []
    contexts, sources = [], []
    for i, doc in enumerate(docs):
        meta = metas[i] if i < len(metas) else {}
        dist = dists[i] if i < len(dists) else None
        try:
            if dist is not None and float(dist) > float(DISTANCE_THRESHOLD):
                continue
        except Exception:
            pass
        label = "%s/%s/%s - %s (p%s)" % (
            meta.get("board", ""), meta.get("class", ""), meta.get("subject", ""),
            meta.get("chapter", ""), meta.get("page", "?")
        )
        contexts.append("[%s] %s" % (label, doc))
        src = meta.get("source_path") or meta.get("source_file") or label
        if src and str(src) not in sources:
            sources.append(str(src))
    return contexts, sources


def answer_question(question, board="", klass="", subject="", language="en"):
    q = (question or "").strip()
    if not q:
        return {"answer": "Question is empty.", "sources": [], "mode": "error"}
    contexts, sources = retrieve(q, board=board, klass=klass, subject=subject)
    mode = "rag" if contexts else "fallback"
    if not contexts:
        serp_q = " ".join([p for p in [board, klass, subject, q] if p])
        serp_results = serp_search(serp_q, num=3)
        if serp_results:
            for r in serp_results:
                contexts.append("[Web:%s] %s (%s)" % (r.get("title", ""), r.get("snippet", ""), r.get("link", "")))
                link = r.get("link")
                if link and link not in sources:
                    sources.append(link)
            mode = "serp"

    if not has_groq():
        if not sources:
            sources = _load_source_hints()
        return {"answer": demo_answer(q, sources=sources, reason="GROQ key missing"), "sources": sources[:5], "mode": "demo"}

    system = build_system_prompt(language)
    user = build_rag_prompt(q, contexts, language)
    try:
        answer = generate_answer([{"role": "system", "content": system}, {"role": "user", "content": user}])
    except Exception as e:
        if not sources:
            sources = _load_source_hints()
        return {"answer": demo_answer(q, sources=sources, reason="Groq error: %s" % e), "sources": sources[:5], "mode": "demo"}
    if not sources:
        sources = _load_source_hints()
    return {"answer": answer, "sources": sources[:5], "mode": mode}


def generate_quiz(topic, board="", klass="", subject="", language="en"):
    t = (topic or "").strip() or "this chapter"
    contexts, sources = retrieve(t, board=board, klass=klass, subject=subject)
    if not has_groq():
        sample = (
            "Demo quiz (configure GROQ_API_KEY for AI-generated quiz):\n"
            "1) Sample question based on selected topic?\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\n"
            "Answer key: 1-A (sample). Ingest data/raw material for topic-specific quiz."
        )
        if not sources:
            sources = _load_source_hints()
        return {"quiz": sample, "sources": sources[:5], "mode": "demo"}
    system = build_system_prompt(language)
    user = build_quiz_prompt(t, contexts, language)
    try:
        quiz = generate_answer([{"role": "system", "content": system}, {"role": "user", "content": user}], temperature=0.4, max_tokens=1200)
    except Exception as e:
        if not sources:
            sources = _load_source_hints()
        return {"quiz": demo_answer(t, sources=sources, reason="Groq error: %s" % e), "sources": sources[:5], "mode": "demo"}
    if not sources:
        sources = _load_source_hints()
    return {"quiz": quiz, "sources": sources[:5], "mode": "rag" if contexts else "fallback"}
