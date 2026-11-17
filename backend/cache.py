import sqlite3
import json
import time

try:
    from .config import CACHE_DB_PATH, DB_DIR
except ImportError:
    from config import CACHE_DB_PATH, DB_DIR


def _ensure_db():
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(CACHE_DB_PATH))
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                expires_at INTEGER NOT NULL
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


def get_cache(key):
    _ensure_db()
    now = int(time.time())
    conn = sqlite3.connect(str(CACHE_DB_PATH))
    try:
        cur = conn.execute("SELECT value, expires_at FROM cache WHERE key = ?", (key,))
        row = cur.fetchone()
        if not row:
            return None
        value, expires_at = row
        if expires_at < now:
            conn.execute("DELETE FROM cache WHERE key = ?", (key,))
            conn.commit()
            return None
        try:
            return json.loads(value)
        except Exception:
            return value
    finally:
        conn.close()


def set_cache(key, value, ttl_seconds):
    _ensure_db()
    now = int(time.time())
    payload = json.dumps(value, ensure_ascii=False)
    conn = sqlite3.connect(str(CACHE_DB_PATH))
    try:
        conn.execute(
            "INSERT OR REPLACE INTO cache(key, value, created_at, expires_at) VALUES (?, ?, ?, ?)",
            (key, payload, now, now + int(ttl_seconds)),
        )
        conn.commit()
    finally:
        conn.close()


def cache_key(prefix, *parts):
    norm = "|".join((p or "").strip().lower() for p in parts)
    return "%s:%s" % (prefix, norm)
