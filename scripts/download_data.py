import json
import logging
import re
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests

try:
    from backend.config import BASE_DIR, RAW_DATA_DIR, SOURCES_PATH
except Exception:
    BASE_DIR = Path(__file__).resolve().parent.parent
    RAW_DATA_DIR = BASE_DIR / "data" / "raw"
    SOURCES_PATH = BASE_DIR / "data" / "sources.json"

LOG_PATH = BASE_DIR / "data" / "download.log"
DELAY_SECONDS = 1.5
USER_AGENT = "BrainBuddyBot/0.1 (+educational; local study app)"
TIMEOUT = 30
MAX_DISCOVER_PER_SOURCE = 50


class LinkExtractor(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() != "a":
            return
        for k, v in attrs:
            if k.lower() == "href" and v:
                self.links.append(v)


def setup_logging():
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.FileHandler(str(LOG_PATH), encoding="utf-8"), logging.StreamHandler()],
    )


def load_sources():
    with open(str(SOURCES_PATH), "r", encoding="utf-8") as f:
        return json.load(f)


def can_fetch(url):
    parsed = urlparse(url)
    robots_url = "%s://%s/robots.txt" % (parsed.scheme, parsed.netloc)
    rp = RobotFileParser()
    try:
        rp.set_url(robots_url)
        rp.read()
        return rp.can_fetch(USER_AGENT, url)
    except Exception as e:
        logging.warning("robots.txt unreadable for %s (%s); proceeding cautiously", robots_url, e)
        return True


def safe_name(text):
    keep = []
    for ch in str(text):
        if ch.isalnum() or ch in ("-", "_", "."):
            keep.append(ch)
        elif ch in (" ", "/", "\\", ":", "(", ")", "[", "]"):
            keep.append("_")
    name = "".join(keep).strip("._") or "file"
    return re.sub(r"_+", "_", name)[:120]


def target_path(item, url, title_hint=""):
    board = safe_name(item.get("board", "unknown"))
    cls = safe_name(item.get("class_range") or item.get("class") or "all")
    subject = safe_name(item.get("subject", "all"))
    folder = RAW_DATA_DIR / board / cls / subject
    folder.mkdir(parents=True, exist_ok=True)
    parsed = urlparse(url)
    fname = Path(parsed.path).name or safe_name(title_hint or item.get("title", "resource"))
    lower = fname.lower()
    if ".pdf" in lower:
        if not lower.endswith(".pdf"):
            fname = fname.split("?")[0]
            if not fname.lower().endswith(".pdf"):
                fname += ".pdf"
    else:
        if not (lower.endswith(".html") or lower.endswith(".htm") or lower.endswith(".txt")):
            fname = safe_name(title_hint or item.get("title", fname)) + ".html"
    return folder / fname


def is_probable_file_url(url):
    p = urlparse(url)
    path = (p.path or "").lower()
    return path.endswith(".pdf") or (".pdf" in path)


def discover_links(session, base_url):
    try:
        resp = session.get(base_url, timeout=TIMEOUT)
        resp.raise_for_status()
        ctype = (resp.headers.get("Content-Type") or "").lower()
        if ("html" not in ctype) and ("xml" not in ctype) and ("text" not in ctype):
            return []
        parser = LinkExtractor()
        try:
            parser.feed(resp.text)
        except Exception:
            return []
        found = []
        base_host = urlparse(base_url).netloc
        for href in parser.links:
            try:
                abs_url = urljoin(base_url, href)
            except Exception:
                continue
            if not abs_url.startswith("http"):
                continue
            if urlparse(abs_url).netloc != base_host:
                continue
            if is_probable_file_url(abs_url):
                found.append(abs_url.split("#")[0])
        seen = set()
        out = []
        for u in found:
            if u not in seen:
                seen.add(u)
                out.append(u)
            if len(out) >= MAX_DISCOVER_PER_SOURCE:
                break
        return out
    except Exception as e:
        logging.warning("Discovery failed for %s: %s", base_url, e)
        return []


def download_one(session, item, url):
    if not can_fetch(url):
        logging.error("Skipped by robots.txt: %s", url)
        return "skipped-robots"
    path = target_path(item, url)
    try:
        if path.exists() and path.stat().st_size > 0:
            logging.info("Skip existing: %s", path)
            return "exists"
    except Exception:
        pass
    logging.info("Downloading: %s", url)
    try:
        resp = session.get(url, timeout=TIMEOUT, allow_redirects=True)
        resp.raise_for_status()
        ctype = (resp.headers.get("Content-Type") or "").lower()
        data = resp.content
        if str(path).lower().endswith(".pdf") and ("pdf" not in ctype) and (not data.startswith(b"%PDF")):
            logging.warning("Expected PDF but got Content-Type=%s for %s", ctype, url)
        with open(str(path), "wb") as f:
            f.write(data)
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
    summary = {"downloaded": 0, "exists": 0, "failed": 0, "skipped-robots": 0, "hubs-scanned": 0, "discovered": 0}

    for item in sources:
        url = item.get("url", "")
        if not url.startswith("http"):
            summary["failed"] += 1
            continue
        if is_probable_file_url(url):
            status = download_one(session, item, url)
            summary[status] = summary.get(status, 0) + 1
            time.sleep(DELAY_SECONDS)
            continue
        logging.info("Scanning hub/index: %s - %s", item.get("title"), url)
        summary["hubs-scanned"] += 1
        links = discover_links(session, url)
        logging.info("Discovered %s file links on %s", len(links), url)
        summary["discovered"] += len(links)
        for link in links:
            status = download_one(session, item, link)
            summary[status] = summary.get(status, 0) + 1
            time.sleep(DELAY_SECONDS)
        if not links:
            logging.info("No direct PDF links discovered (site may be JS-driven/protected or links are indirect): %s", url)
        time.sleep(DELAY_SECONDS)

    logging.info("Summary: %s", summary)
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
