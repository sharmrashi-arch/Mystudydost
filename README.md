# MyStudyDost

Free study assistant app for students (CBSE, HBSE aur aage aur boards). Goal: jin students ke paas books/resources nahi hain unhe free me syllabus, chapters, explanations, questions aur quiz mil sake.

## Abhi tak kya bana (Step 1 foundation)
- Project folder structure
- FastAPI backend skeleton (`/health`, `/`, `/chat`)
- Config via `.env` (`GROQ_API_KEY`, `SERP_API_KEY`, `GROQ_MODEL`)
- Starter `data/sources.json` and `data/catalog.json`
- App-like frontend UI (home + chat) with PWA basics (manifest/service worker)

## Run commands (Windows PowerShell)
```powershell
cd C:\Users\pc\MyStudyDost
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# .env me apni GROQ_API_KEY aur SERP_API_KEY bharo (kabhi chat/frontend me paste mat karo)
uvicorn backend.main:app --reload
```
Open: http://127.0.0.1:8000

## Agle steps
1. `scripts/download_data.py`: official NCERT/CBSE/HBSE sources se PDFs download
2. `scripts/ingest.py`: PyMuPDF chunking + ChromaDB + catalog build
3. `backend/rag.py`, `groq_client.py`, `prompts.py`, `/api/chat`
4. `backend/serp_client.py`, `cache.py` fallback (official sites only, 7-day cache)
5. Quiz endpoint/UI, testing, deploy

## Suraksha
- Keys sirf `.env` me, frontend me nahi
- Sirf official/free sources use karo aur source dikhाओ
- Galat/unknown info invent mat karo
