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


def extract_pdf_text(pdf_path):
    if fitz is None:
        raise RuntimeError("PyMuPDF (pymupdf) not installed. Run: pip install -r requirements.txt")
    doc = fitz.open(str(pdf_path))
    pages = []
    i = 0
    for page in doc:
        i += 1
        try:
            text = page.get_text("text") or ""
        except Exception:
            text = ""
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            pages.append({"page": i, "text": text})
    doc.close()
    return pages


def chunk_text(text, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
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


def infer_meta(pdf_path):
    try:
        parts = pdf_path.relative_to(RAW_DATA_DIR).parts
    except Exception:
        parts = pdf_path.parts
    meta = {"board": "Unknown", "class": "Unknown", "subject": "Unknown", "chapter": pdf_path.stem, "source_file": pdf_path.name}
    if len(parts) >= 1:
        meta["board"] = parts[0]
    if len(parts) >= 2:
        meta["class"] = parts[1]
    if len(parts) >= 3:
        meta["subject"] = parts[2]
    return meta


def update_catalog_from_raw():
    if not CATALOG_PATH.exists():
        return
    try:
        with open(str(CATALOG_PATH), "r", encoding="utf-8") as f:
            catalog = json.load(f)
    except Exception:
        return
    catalog.setdefault("ingestion", {})
    catalog["ingestion"]["raw_pdf_count"] = len(list(RAW_DATA_DIR.rglob("*.pdf"))) if RAW_DATA_DIR.exists() else 0
    catalog["ingestion"]["db_path"] = str(DB_DIR)
    try:
        with open(str(CATALOG_PATH), "w", encoding="utf-8") as f:
            json.dump(catalog, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


def main():
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    DB_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = list(RAW_DATA_DIR.rglob("*.pdf"))
    if not pdfs:
        update_catalog_from_raw()
        print("No PDFs found in data/raw. Run: python scripts/download_data.py (aur agar hub se direct PDF na mile to data/sources.json me direct PDF URLs add karo).")
        return

    try:
        import chromadb
        from chromadb.utils import embedding_functions
    except Exception as e:
        raise RuntimeError("chromadb/sentence-transformers not ready: %s. Install requirements first (pip install -r requirements.txt)." % e)

    client = chromadb.PersistentClient(path=str(DB_DIR))
    ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    collection = client.get_or_create_collection(name="brainbuddy", embedding_function=ef, metadata={"hnsw:space": "cosine"})

    total_chunks = 0
    for pdf in pdfs:
        meta_base = infer_meta(pdf)
        try:
            pages = extract_pdf_text(pdf)
        except Exception as e:
            print("Skip %s: %s" % (pdf, e))
            continue
        for page in pages:
            chunks = chunk_text(page["text"])
            for idx, chunk in enumerate(chunks):
                doc_id = "%s|%s|%s|%s|p%s|%s" % (
                    meta_base.get("board", ""), meta_base.get("class", ""), meta_base.get("subject", ""),
                    pdf.stem, page["page"], idx
                )
                doc_id = re.sub(r"\s+", "_", doc_id)[:500]
                metadata = dict(meta_base)
                metadata["page"] = page["page"]
                metadata["chunk_index"] = idx
                metadata["source_path"] = str(pdf)
                collection.upsert(ids=[doc_id], documents=[chunk], metadatas=[metadata])
                total_chunks += 1
        print("Processed: %s (%s pages)" % (pdf, len(pages)))

    update_catalog_from_raw()
    print("Done. Stored chunks: %s in %s" % (total_chunks, DB_DIR))


if __name__ == "__main__":
    main()
