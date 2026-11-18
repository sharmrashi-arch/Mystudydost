import json
import uuid
from pathlib import Path
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from .config import APP_NAME, APP_ENV, CATALOG_PATH, MAX_QUESTION_LENGTH, BASE_DIR
    from .rag import answer_question, generate_quiz
except ImportError:
    from config import APP_NAME, APP_ENV, CATALOG_PATH, MAX_QUESTION_LENGTH, BASE_DIR
    from rag import answer_question, generate_quiz

FRONTEND_DIR = BASE_DIR / "frontend"
CHATS_FILE = BASE_DIR / "data" / "chats.json"

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


# Chat history storage
def load_chats():
    if CHATS_FILE.exists():
        try:
            with open(CHATS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_chats(chats):
    CHATS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CHATS_FILE, "w", encoding="utf-8") as f:
        json.dump(chats, f, ensure_ascii=False, indent=2)


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=MAX_QUESTION_LENGTH)
    board: str = ""
    klass: str = Field(default="", alias="class")
    subject: str = ""
    language: str = "en"
    chapter: str = ""

    model_config = {"populate_by_name": True}


class QuizRequest(BaseModel):
    topic: str = ""
    board: str = ""
    klass: str = Field(default="", alias="class")
    subject: str = ""
    language: str = "en"
    chapter: str = ""

    model_config = {"populate_by_name": True}


class ChatCreate(BaseModel):
    title: str = "New Chat"
    board: str = "CBSE"
    klass: str = "Class 1"
    subject: str = "Mathematics"
    language: str = "en"


class ChatUpdate(BaseModel):
    title: str | None = None
    messages: list | None = None
    board: str | None = None
    klass: str | None = None
    subject: str | None = None
    language: str | None = None


@app.get("/health")
def health():
    return {"status": "ok", "app": APP_NAME, "env": APP_ENV}


@app.get("/api/catalog")
def get_catalog():
    if CATALOG_PATH.exists():
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"boards": [], "note": "catalog.json not found"}


# Chat history endpoints
@app.get("/api/chats")
def list_chats():
    chats = load_chats()
    # Return summary without full messages
    return [
        {
            "id": c["id"],
            "title": c.get("title", "New Chat"),
            "board": c.get("board", "CBSE"),
            "klass": c.get("klass", "Class 1"),
            "subject": c.get("subject", "Mathematics"),
            "language": c.get("language", "en"),
            "createdAt": c.get("createdAt"),
            "updatedAt": c.get("updatedAt"),
            "messageCount": len(c.get("messages", []))
        }
        for c in chats
    ]


@app.get("/api/chats/{chat_id}")
def get_chat(chat_id: str):
    chats = load_chats()
    chat = next((c for c in chats if c["id"] == chat_id), None)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@app.post("/api/chats")
def create_chat(chat: ChatCreate):
    chats = load_chats()
    new_chat = {
        "id": str(uuid.uuid4()),
        "title": chat.title,
        "board": chat.board,
        "klass": chat.klass,
        "subject": chat.subject,
        "language": chat.language,
        "messages": [],
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "updatedAt": datetime.utcnow().isoformat() + "Z"
    }
    chats.insert(0, new_chat)
    save_chats(chats)
    return new_chat


@app.put("/api/chats/{chat_id}")
def update_chat(chat_id: str, update: ChatUpdate):
    chats = load_chats()
    idx = next((i for i, c in enumerate(chats) if c["id"] == chat_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats[idx]
    if update.title is not None:
        chat["title"] = update.title
    if update.messages is not None:
        chat["messages"] = update.messages
    if update.board is not None:
        chat["board"] = update.board
    if update.klass is not None:
        chat["klass"] = update.klass
    if update.subject is not None:
        chat["subject"] = update.subject
    if update.language is not None:
        chat["language"] = update.language
    chat["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    
    chats[idx] = chat
    save_chats(chats)
    return chat


@app.delete("/api/chats/{chat_id}")
def delete_chat(chat_id: str):
    chats = load_chats()
    chats = [c for c in chats if c["id"] != chat_id]
    save_chats(chats)
    return {"status": "deleted"}


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
