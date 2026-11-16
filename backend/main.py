import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

try:
    from .config import APP_NAME, APP_ENV, CATALOG_PATH
except ImportError:
    from config import APP_NAME, APP_ENV, CATALOG_PATH

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = FastAPI(title=APP_NAME, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/health")
def health():
    return {"status": "ok", "app": APP_NAME, "env": APP_ENV}


@app.get("/api/catalog")
def get_catalog():
    if CATALOG_PATH.exists():
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"boards": [], "note": "catalog.json not found"}


@app.get("/")
def index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": f"{APP_NAME} backend running. Frontend not found yet."}


@app.get("/chat")
def chat_page():
    chat_file = FRONTEND_DIR / "chat.html"
    if chat_file.exists():
        return FileResponse(chat_file)
    return {"message": "Chat page not found yet."}
