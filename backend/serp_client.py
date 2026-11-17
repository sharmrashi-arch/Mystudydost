import requests
from urllib.parse import urlparse

try:
    from .config import SERP_API_KEY, ALLOWED_SITE_HINTS, SERP_CACHE_DAYS
    from .cache import get_cache, set_cache, cache_key
except ImportError:
    from config import SERP_API_KEY, ALLOWED_SITE_HINTS, SERP_CACHE_DAYS
    from cache import get_cache, set_cache, cache_key

SERP_ENDPOINT = "https://serpapi.com/search.json"


def _is_allowed(url):
    try:
        host = urlparse(url).netloc.lower()
        for h in ALLOWED_SITE_HINTS:
            if h in host:
                return True
        return False
    except Exception:
        return False


def serp_search(query, num=5):
    if not SERP_API_KEY or SERP_API_KEY == "your_serp_api_key_here":
        return []
    key = cache_key("serp", query, str(num))
    cached = get_cache(key)
    if cached is not None:
        return cached

    params = {"engine": "google", "q": query, "api_key": SERP_API_KEY, "num": num}
    try:
        resp = requests.get(SERP_ENDPOINT, params=params, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for item in (data.get("organic_results") or [])[:num]:
            link = item.get("link") or ""
            if not link or not _is_allowed(link):
                continue
            results.append({
                "title": item.get("title") or "Result",
                "link": link,
                "snippet": item.get("snippet") or "",
            })
        set_cache(key, results, SERP_CACHE_DAYS * 24 * 3600)
        return results
    except Exception:
        return []
