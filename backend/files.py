"""Save uploads to a temp folder and clean old files."""
import time
import uuid
from pathlib import Path

try:
    from .config import TMP_DIR, DOWNLOAD_TTL_SECONDS
except ImportError:
    from config import TMP_DIR, DOWNLOAD_TTL_SECONDS


def save_bytes(raw, suffix=".bin"):
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    fid = uuid.uuid4().hex
    path = TMP_DIR / (fid + suffix)
    with open(path, "wb") as f:
        f.write(raw)
    return fid, path


def new_path(suffix):
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    fid = uuid.uuid4().hex
    return fid, TMP_DIR / (fid + suffix)


def cleanup_old():
    if not TMP_DIR.exists():
        return
    cutoff = time.time() - DOWNLOAD_TTL_SECONDS
    for p in TMP_DIR.glob("*"):
        try:
            if p.is_file() and p.stat().st_mtime < cutoff:
                p.unlink()
        except Exception:
            pass