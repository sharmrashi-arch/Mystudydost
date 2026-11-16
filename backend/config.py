import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

APP_NAME = os.getenv("APP_NAME", "MyStudyDost")
APP_ENV = os.getenv("APP_ENV", "development")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SERP_API_KEY = os.getenv("SERP_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
CATALOG_PATH = DATA_DIR / "catalog.json"
SOURCES_PATH = DATA_DIR / "sources.json"
DB_DIR = BASE_DIR / "db"
CACHE_DB_PATH = DB_DIR / "cache.sqlite3"

RETRIEVAL_TOP_K = 5
DISTANCE_THRESHOLD = 1.2  # tune after ingestion/testing
SERP_CACHE_DAYS = 7
RATE_LIMIT_PER_MINUTE = 20
MAX_QUESTION_LENGTH = 1000

ALLOWED_SITE_HINTS = [
    "ncert.nic.in",
    "cbseacademic.nic.in",
    "cbse.gov.in",
    "bseh.org.in",
    "nios.ac.in",
    "ignou.ac.in",
    "epathshala.nic.in",
    "diksha.gov.in",
]
