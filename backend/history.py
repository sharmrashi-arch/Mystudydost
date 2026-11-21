"""Per-session chat history stored in SQLite (no global data leak)."""
import json
import sqlite3
import uuid
from datetime import datetime, timezone

try:
    from .config import HISTORY_DB_PATH, DB_DIR
except ImportError:
    from config import HISTORY_DB_PATH, DB_DIR


def _now():
    return datetime.now(timezone.utc).isoformat()


def _conn():
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(HISTORY_DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with _conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chats (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                title TEXT NOT NULL,
                board TEXT,
                klass TEXT,
                subject TEXT,
                language TEXT,
                messages TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_chats_session ON chats(session_id)")


def list_chats(session_id):
    init_db()
    with _conn() as conn:
        rows = conn.execute(
            "SELECT * FROM chats WHERE session_id = ? ORDER BY updated_at DESC", (session_id,)
        ).fetchall()
    out = []
    for r in rows:
        try:
            msgs = json.loads(r["messages"])
        except Exception:
            msgs = []
        out.append({
            "id": r["id"], "title": r["title"], "board": r["board"],
            "klass": r["klass"], "subject": r["subject"], "language": r["language"],
            "createdAt": r["created_at"], "updatedAt": r["updated_at"],
            "messageCount": len(msgs),
        })
    return out


def get_chat(session_id, chat_id):
    init_db()
    with _conn() as conn:
        r = conn.execute("SELECT * FROM chats WHERE id = ? AND session_id = ?", (chat_id, session_id)).fetchone()
    if not r:
        return None
    return {
        "id": r["id"], "title": r["title"], "board": r["board"], "klass": r["klass"],
        "subject": r["subject"], "language": r["language"],
        "messages": json.loads(r["messages"]),
        "createdAt": r["created_at"], "updatedAt": r["updated_at"],
    }


def create_chat(session_id, data):
    init_db()
    now = _now()
    chat = {
        "id": str(uuid.uuid4()),
        "title": (data.get("title") or "New Chat")[:120],
        "board": data.get("board", ""),
        "klass": data.get("klass", ""),
        "subject": data.get("subject", ""),
        "language": data.get("language", "en"),
        "messages": data.get("messages", []),
        "createdAt": now,
        "updatedAt": now,
    }
    with _conn() as conn:
        conn.execute(
            "INSERT INTO chats(id, session_id, title, board, klass, subject, language, messages, created_at, updated_at) "
            "VALUES(?,?,?,?,?,?,?,?,?,?)",
            (chat["id"], session_id, chat["title"], chat["board"], chat["klass"],
             chat["subject"], chat["language"], json.dumps(chat["messages"], ensure_ascii=False), now, now),
        )
    return chat


def update_chat(session_id, chat_id, update):
    init_db()
    chat = get_chat(session_id, chat_id)
    if not chat:
        return None
    for field in ("title", "board", "klass", "subject", "language"):
        if update.get(field) is not None:
            chat[field] = update[field]
    if update.get("messages") is not None:
        chat["messages"] = update["messages"]
    chat["updatedAt"] = _now()
    with _conn() as conn:
        conn.execute(
            "UPDATE chats SET title=?, board=?, klass=?, subject=?, language=?, messages=?, updated_at=? WHERE id=? AND session_id=?",
            (chat["title"], chat["board"], chat["klass"], chat["subject"], chat["language"],
             json.dumps(chat["messages"], ensure_ascii=False), chat["updatedAt"], chat_id, session_id),
        )
    return chat


def delete_chat(session_id, chat_id):
    init_db()
    with _conn() as conn:
        conn.execute("DELETE FROM chats WHERE id = ? AND session_id = ?", (chat_id, session_id))
    return True