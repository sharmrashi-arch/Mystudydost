"""Language list, lookup and lightweight detection helpers."""
import re

# code, English name, native name, direction
LANGUAGES = [
    {"code": "auto", "en": "Auto-detect", "native": "Auto-detect", "rtl": False},
    {"code": "en", "en": "English", "native": "English", "rtl": False},
    {"code": "hi", "en": "Hindi", "native": "हिन्दी", "rtl": False},
    {"code": "hinglish", "en": "Hinglish", "native": "Hinglish", "rtl": False},
    {"code": "ur", "en": "Urdu", "native": "اردو", "rtl": True},
    {"code": "pa", "en": "Punjabi", "native": "ਪੰਜਾਬੀ", "rtl": False},
    {"code": "bn", "en": "Bengali", "native": "বাংলা", "rtl": False},
    {"code": "gu", "en": "Gujarati", "native": "ગુજરાતી", "rtl": False},
    {"code": "mr", "en": "Marathi", "native": "मराठी", "rtl": False},
    {"code": "te", "en": "Telugu", "native": "తెలుగు", "rtl": False},
    {"code": "ta", "en": "Tamil", "native": "தமிழ்", "rtl": False},
    {"code": "kn", "en": "Kannada", "native": "ಕನ್ನಡ", "rtl": False},
    {"code": "ml", "en": "Malayalam", "native": "മലയാളം", "rtl": False},
    {"code": "or", "en": "Odia", "native": "ଓଡ଼ିଆ", "rtl": False},
    {"code": "as", "en": "Assamese", "native": "অসমীয়া", "rtl": False},
    {"code": "mai", "en": "Maithili", "native": "मैथिली", "rtl": False},
    {"code": "sa", "en": "Sanskrit", "native": "संस्कृतम्", "rtl": False},
    {"code": "ne", "en": "Nepali", "native": "नेपाली", "rtl": False},
    {"code": "si", "en": "Sinhala", "native": "සිංහල", "rtl": False},
    {"code": "ar", "en": "Arabic", "native": "العربية", "rtl": True},
    {"code": "fa", "en": "Persian", "native": "فارسی", "rtl": True},
    {"code": "he", "en": "Hebrew", "native": "עברית", "rtl": True},
    {"code": "zh", "en": "Chinese", "native": "中文", "rtl": False},
    {"code": "ja", "en": "Japanese", "native": "日本語", "rtl": False},
    {"code": "ko", "en": "Korean", "native": "한국어", "rtl": False},
    {"code": "es", "en": "Spanish", "native": "Español", "rtl": False},
    {"code": "fr", "en": "French", "native": "Français", "rtl": False},
    {"code": "de", "en": "German", "native": "Deutsch", "rtl": False},
    {"code": "it", "en": "Italian", "native": "Italiano", "rtl": False},
    {"code": "pt", "en": "Portuguese", "native": "Português", "rtl": False},
    {"code": "ru", "en": "Russian", "native": "Русский", "rtl": False},
    {"code": "uk", "en": "Ukrainian", "native": "Українська", "rtl": False},
    {"code": "tr", "en": "Turkish", "native": "Türkçe", "rtl": False},
    {"code": "id", "en": "Indonesian", "native": "Bahasa Indonesia", "rtl": False},
    {"code": "ms", "en": "Malay", "native": "Bahasa Melayu", "rtl": False},
    {"code": "vi", "en": "Vietnamese", "native": "Tiếng Việt", "rtl": False},
    {"code": "th", "en": "Thai", "native": "ไทย", "rtl": False},
    {"code": "nl", "en": "Dutch", "native": "Nederlands", "rtl": False},
    {"code": "pl", "en": "Polish", "native": "Polski", "rtl": False},
    {"code": "sv", "en": "Swedish", "native": "Svenska", "rtl": False},
    {"code": "el", "en": "Greek", "native": "Ελληνικά", "rtl": False},
    {"code": "sw", "en": "Swahili", "native": "Kiswahili", "rtl": False},
    {"code": "am", "en": "Amharic", "native": "አማርኛ", "rtl": False},
]

_BY_CODE = {l["code"]: l for l in LANGUAGES}

# Common 3-letter / regional codes -> our codes
_ALIASES = {
    "zh-cn": "zh", "zh-tw": "zh", "zh-hans": "zh", "zh-hant": "zh",
    "pt-br": "pt", "es-mx": "es", "fr-fr": "fr", "de-de": "de",
    "ur-pk": "ur", "hi-in": "hi", "en-us": "en", "en-in": "en",
    "fil": "tl", "tl": "en", "jv": "id", "ban": "id", "su": "id",
}


def get_language(code):
    code = (code or "en").strip()
    if code in _BY_CODE:
        return _BY_CODE[code]
    if code in _ALIASES and _ALIASES[code] in _BY_CODE:
        return _BY_CODE[_ALIASES[code]]
    return _BY_CODE["en"]


def language_name(code):
    return get_language(code)["en"]


def resolve(code, text):
    """Resolve 'auto' to the detected language of the text."""
    code = (code or "en").strip()
    if code in ("", "auto"):
        return detect_language(text)
    return code


def is_rtl(code):
    return bool(get_language(code)["rtl"])


def list_languages():
    return LANGUAGES


def _looks_hinglish(text):
    """Detect romanised Hindi (Hinglish) using common function words."""
    low = text.lower()
    words = re.findall(r"[a-z]+", low)
    if not words:
        return False
    strong = {"kya", "batao", "btao", "samjhao", "kaise", "kaisa", "kyun", "kyu", "kahan", "kitna", "kitne"}
    common = {
        "hai", "hain", "hota", "hoti", "hote", "hoga", "hogi", "kab", "kaha", "kitni",
        "mujhe", "tum", "tumhe", "aap", "hum", "mera", "meri", "mere", "tera", "teri",
        "nahi", "nhi", "haan", "krna", "karna", "kiya", "kiye", "gaya", "raha", "rahi",
        "matlab", "liye", "bahut", "bohot", "thoda", "jyada", "zyada", "kaun", "acha",
        "accha", "bhai", "thik", "padho", "likho", "samjha", "bta", "kar", "ke", "ka", "ki",
    }
    hits = sum(1 for w in words if w in common)
    if any(w in strong for w in words):
        return True
    return hits >= 2


def detect_language(text):
    """Best-effort language detection. Returns a supported code."""
    if not text or not text.strip():
        return "en"
    sample = text[:1500]

    # Devanagari script -> Hindi (unless another Devanagari language is clearly present)
    if any("\u0900" <= ch <= "\u097F" for ch in sample):
        return "hi"
    # Perso-Arabic script -> likely Urdu/Arabic
    if any("\u0600" <= ch <= "\u06FF" for ch in sample):
        try:
            from langdetect import detect
            code = detect(sample)
            if code in ("ar", "fa", "ur"):
                return code
        except Exception:
            pass
        return "ur"

    # Romanised Hindi (Hinglish) check before langdetect (which misfires on short text)
    if _looks_hinglish(sample):
        return "hinglish"

    try:
        from langdetect import detect, DetectorFactory
        DetectorFactory.seed = 0
        code = detect(sample)
    except Exception:
        return "en"

    code = _ALIASES.get(code, code)
    if code in _BY_CODE and code != "auto":
        return code
    return "en"