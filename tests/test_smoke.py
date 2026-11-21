import io

from fastapi.testclient import TestClient

import backend.main as m

client = TestClient(m.app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert "groq" in body


def test_languages():
    r = client.get("/api/languages")
    assert r.status_code == 200
    langs = r.json()["languages"]
    codes = {l["code"] for l in langs}
    assert "en" in codes and "hi" in codes and "auto" in codes


def test_catalog():
    r = client.get("/api/catalog")
    assert r.status_code == 200
    assert isinstance(r.json(), dict)


def test_chat_demo():
    r = client.post("/api/chat", json={"question": "What is photosynthesis?", "language": "en"})
    assert r.status_code == 200
    body = r.json()
    assert body["answer"]
    assert body["mode"] in ("demo", "rag", "fallback", "serp", "vision", "chat", "math")


def test_chat_stream():
    r = client.post("/api/chat/stream", json={"question": "Hello", "language": "en"})
    assert r.status_code == 200
    text = r.text
    assert "data:" in text
    assert "delta" in text


def test_quiz_demo():
    r = client.post("/api/quiz", json={"topic": "Algebra", "language": "en"})
    assert r.status_code == 200
    assert r.json()["quiz"]


def test_flashcards_demo():
    r = client.post("/api/flashcards", json={"topic": "Biology", "language": "en"})
    assert r.status_code == 200
    assert r.json()["text"]


def test_study_plan_demo():
    r = client.post("/api/study-plan", json={"subjects": "Maths, Science", "days_left": 14, "hours_per_day": 2})
    assert r.status_code == 200
    assert r.json()["text"]


def test_solve_pdf_demo():
    r = client.post("/api/solve-pdf", json={"text": "Q1. What is 2+2? Q2. Solve x+3=5", "language": "en"})
    assert r.status_code == 200
    assert r.json()["answer"]


def test_generate_pdf_and_download():
    r = client.post("/api/generate", json={"type": "pdf", "text": "# Notes\n\nThis is a test note.\nSecond line.", "title": "Test"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["id"]
    d = client.get(data["url"])
    assert d.status_code == 200
    assert d.content[:4] == b"%PDF"


def test_generate_docx_and_pptx():
    for kind in ("docx", "pptx"):
        r = client.post("/api/generate", json={"type": kind, "text": "Point one\nPoint two\nPoint three", "title": "T"})
        assert r.status_code == 200, (kind, r.text)
        assert client.get(r.json()["url"]).status_code == 200


def test_chats_crud():
    h = {"X-Session-Id": "test-session-1"}
    r = client.post("/api/chats", json={"title": "My Chat", "language": "en"}, headers=h)
    assert r.status_code == 200
    cid = r.json()["id"]
    # list
    assert any(c["id"] == cid for c in client.get("/api/chats", headers=h).json())
    # isolation: another session should not see it
    assert all(c["id"] != cid for c in client.get("/api/chats", headers={"X-Session-Id": "other"}).json())
    # update
    r = client.put("/api/chats/%s" % cid, json={"title": "Renamed", "messages": [{"role": "user", "content": "hi"}]}, headers=h)
    assert r.status_code == 200 and r.json()["title"] == "Renamed"
    # delete
    assert client.delete("/api/chats/%s" % cid, headers=h).status_code == 200
    assert all(c["id"] != cid for c in client.get("/api/chats", headers=h).json())


def test_upload_text():
    files = {"file": ("note.txt", io.BytesIO(b"hello world"), "text/plain")}
    r = client.post("/api/upload", files=files)
    assert r.status_code == 200
    body = r.json()
    assert body["kind"] == "text" and "hello world" in body["text"]


def test_upload_image():
    # 1x1 png
    png = bytes.fromhex(
        "89504e470d0a1a0a0000000d494844520000000100000001080600000"
        "01f15c4890000000d49444154789c6360000002000100ffff03000006"
        "0005574bd8b40000000049454e44ae426082"
    )
    files = {"file": ("x.png", io.BytesIO(png), "image/png")}
    r = client.post("/api/upload", files=files)
    assert r.status_code == 200
    assert r.json()["kind"] == "image"