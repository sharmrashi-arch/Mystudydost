import json
import logging
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import requests

try:
    from backend.config import BASE_DIR, RAW_DATA_DIR, SOURCES_PATH
except Exception:
    BASE_DIR = Path(__file__).resolve().parent.parent
    RAW_DATA_DIR = BASE_DIR / "data" / "raw"
    SOURCES_PATH = BASE_DIR / "data" / "sources.json"

LOG_PATH = BASE_DIR / "data" / "download.log"
DELAY_SECONDS = 2
USER_AGENT = "MyStudyDostBot/0.1 (+educational; contact=local-user)"
TIMEOUT = 30


def setup_logging():
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.FileHandler(LOG_PATH, encoding="utf-8"), logging.StreamHandler()],
    )


def load_sources():
    with open(SOURCES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def can_fetch(url: str) -> bool:
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    rp = RobotFileParser()
    try:
        rp.set_url(robots_url)
        rp.read()
        allowed = rp.can_fetch(USER_AGENT, url)
        logging.info("robots.txt check %s -> %s", robots_url, allowed)
        return allowed
    except Exception as e:
        logging.warning("robots.txt unreadable for %s (%s); proceeding cautiously", robots_url, e)
        return True


def safe_name(text: str) -> str:
    keep = []
    for ch in text:
        if ch.isalnum() or ch in ("-", "_", "."):
            keep.append(ch)
        elif ch in (" ", "/", "\\", ":"):
            keep.append("_")
    name = "".join(keep).strip("._") or "file"
    return name[:120]


def target_path(item: dict, url: str) -> Path:
    board = safe_name(str(item.get("board", "unknown")))
    cls = safe_name(str(item.get("class_range") or item.get("class") or "all"))
    subject = safe_name(str(item.get("subject", "all")))
    folder = RAW_DATA_DIR / board / cls / subject
    folder.mkdir(parents=True, exist_ok=True)
    parsed = urlparse(url)
    fname = Path(parsed.path).name or safe_name(item.get("title", "resource"))
    if not fname.lower().endswith(".pdf"):
        fname = safe_name(item.get("title", fname)) + ".html"
    return folder / fname


def download_one(session: requests.Session, item: dict, url: str) -> str:
    if not can_fetch(url):
        logging.error("Skipped by robots.txt: %s", url)
        return "skipped-robots"
    path = target_path(item, url)
    if path.exists() and path.stat().st_size > 0:
        logging.info("Skip existing: %s", path)
        return "exists"

    logging.info("Downloading: %s", url)
    try:
        resp = session.get(url, timeout=TIMEOUT, allow_redirects=True)
        resp.raise_for_status()
        ctype = resp.headers.get("Content-Type", "").lower()
        data = resp.content
        if path.suffix.lower() == ".pdf" and "pdf" not in ctype and not data.startswith(b"%PDF"):
            logging.warning("Expected PDF but got Content-Type=%s for %s (saved for review)", ctype, url)
        path.write_bytes(data)
        logging.info("Saved: %s (%s bytes)", path, len(data))
        return "downloaded"
    except Exception as e:
        logging.exception("Failed: %s -> %s", url, e)
        return "failed"


def main():
    setup_logging()
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    sources = load_sources()
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})
    summary = {"downloaded": 0, "exists": 0, "failed": 0, "skipped-robots": 0, "non-file": 0}

    for item in sources:
        url = item.get("url", "")
        if not url.startswith("http"):
            summary["failed"] += 1
            continue
        if item.get("type", "").endswith("hub") or item.get("type", "").endswith("index") or item.get("type", "").endswith("home"):
            logging.info("Hub/index source recorded (add direct PDF URLs to download): %s - %s", item.get("title"), url)
            summary["non-file"] += 1
            time.sleep(DELAY_SECONDS)
            continue
        status = download_one(session, item, url)
        summary[status] = summary.get(status, 0) + 1
        time.sleep(DELAY_SECONDS)

    logging.info("Summary: %s", summary)
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
