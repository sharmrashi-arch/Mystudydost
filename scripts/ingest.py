import json
import re
from pathlib import Path

try:
    import fitz  # PyMuPDF
except Exception:
    fitz = None

try:
    from backend.config import BASE_DIR, RAW_DATA_DIR, CATALOG_PATH, DB_DIR
except Exception:
    BASE_DIR = Path(__file__).resolve().parent.parent
    RAW_DATA_DIR = BASE_DIR / "data" / "raw"
    CATALOG_PATH = BASE_DIR / "data" / "catalog.json"
    DB_DIR = BASE_DIR / "db"

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def extract_pdf_text(pdf_path: Path) -> list[dict]:
    if fitz is None:
        raise RuntimeError("PyMuPDF (pymupdf) not installed. Run: pip install -r requirements.txt")
    doc = fitz.open(pdf_path)
    pages = []
    for i, page in enumerate(doc, start=1):
        text = page.get_text("text") or ""
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            pages.append({"page": i, "text": text})
    doc.close()
    return pages


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    chunks = []
    start = 0
    n = len(text)
    while start < n:
        end = min(start + size, n)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == n:
            break
        start = max(0, end - overlap)
    return chunks


def infer_meta(pdf_path: Path) -> dict:
    # Expected: data/raw/<board>/<class>/<subject>/<file>.pdf
    parts = pdf_path.relative_to(RAW_DATA_DIR).parts
    meta = {"board": "Unknown", "class": "Unknown", "subject": "Unknown", "chapter": pdf_path.stem, "source_file": pdf_path.name}
    if len(parts) >= 1:
        meta["board"] = parts[0]
    if len(parts) >= 2:
        meta["class"] = parts[1]
    if len(parts) >= 3:
        meta["subject"] = parts[2]
    return meta


def main():
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    DB_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = list(RAW_DATA_DIR.rglob("*.pdf"))
    if not pdfs:
        print("No PDFs found in data/raw. Run scripts/download_data.py after adding direct PDF URLs to data/sources.json.")
        return

    try:
        import chromadb
        from chromadb.utils import embedding_functions
    except Exception as e:
        raise RuntimeError(f"chromadb/sentence-transformers not ready: {e}. Install requirements first.")

    client = chromadb.PersistentClient(path=str(DB_DIR))
    ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    collection = client.get_or_create_collection(name="mystudydost", embedding_function=ef, metadata={"hnsw:space": "cosine"})

    total_chunks = 0
    for pdf in pdfs:
        meta_base = infer_meta(pdf)
        pages = extract_pdf_text(pdf)
        for page in pages:
            chunks = chunk_text(page["text"])
            for idx, chunk in enumerate(chunks):
                doc_id = f"{meta_base['board']}|{meta_base['class']}|{meta_base['subject']}|{pdf.stem}|p{page['page']}|{idx}"
                metadata = {**meta_base, "page": page["page"], "chunk_index": idx, "source_path": str(pdf)}
                collection.upsert(ids=[doc_id], documents=[chunk], metadatas=[metadata])
                total_chunks += 1
        print(f"Processed: {pdf} ({len(pages)} pages)")

    print(f"Done. Stored chunks: {total_chunks} in {DB_DIR}")
    if not CATALOG_PATH.exists():
        print("catalog.json missing; create/update catalog after verifying subjects/chapters.")
    else:
        print(f"Catalog present: {CATALOG_PATH} (enrich chapter lists from ingested content as needed).")


if __name__ == "__main__":
    main()
