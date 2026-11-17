import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from .config import APP_NAME, APP_ENV, CATALOG_PATH, MAX_QUESTION_LENGTH
    from .rag import answer_question, generate_quiz
except ImportError:
    from config import APP_NAME, APP_ENV, CATALOG_PATH, MAX_QUESTION_LENGTH
    from rag import answer_question, generate_quiz

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = FastAPI(title=APP_NAME, version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


class ChatRequest(BaseModel):
    question = Field(..., min_length=1, max_length=MAX_QUESTION_LENGTH)
    board = ""
    klass = Field(default="", alias="class")
    subject = ""
    language = "en"
    chapter = ""

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True


class QuizRequest(BaseModel):
    topic = ""
    board = ""
    klass = Field(default="", alias="class")
    subject = ""
    language = "en"
    chapter = ""

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True


@app.get("/health")
def health():
    return {"status": "ok", "app": APP_NAME, "env": APP_ENV}


@app.get("/api/catalog")
def get_catalog():
    if CATALOG_PATH.exists():
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"boards": [], "note": "catalog.json not found"}


@app.post("/api/chat")
def chat(req: ChatRequest):
    topic_bits = [getattr(req, "board", "") or "", getattr(req, "klass", "") or "", getattr(req, "subject", "") or "", getattr(req, "chapter", "") or "", getattr(req, "question", "")]
    question = " | ".join([b for b in topic_bits if b]).strip()
    result = answer_question(
        question=question or getattr(req, "question", ""),
        board=getattr(req, "board", "") or "",
        klass=getattr(req, "klass", "") or "",
        subject=getattr(req, "subject", "") or "",
        language=getattr(req, "language", "en") or "en",
    )
    return {"answer": result.get("answer", ""), "sources": result.get("sources", []), "mode": result.get("mode", "unknown")}


@app.post("/api/quiz")
def quiz(req: QuizRequest):
    topic = getattr(req, "topic", "") or getattr(req, "chapter", "") or " ".join([p for p in [getattr(req, "board", ""), getattr(req, "klass", ""), getattr(req, "subject", "")] if p]).strip() or "study topic"
    result = generate_quiz(
        topic=topic,
        board=getattr(req, "board", "") or "",
        klass=getattr(req, "klass", "") or "",
        subject=getattr(req, "subject", "") or "",
        language=getattr(req, "language", "en") or "en",
    )
    return {"quiz": result.get("quiz", ""), "sources": result.get("sources", []), "mode": result.get("mode", "unknown")}


@app.get("/")
def index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "%s backend running. Frontend not found yet." % APP_NAME}


@app.get("/chat")
def chat_page():
    chat_file = FRONTEND_DIR / "chat.html"
    if chat_file.exists():
        return FileResponse(str(chat_file))
    return {"message": "Chat page not found yet."}
