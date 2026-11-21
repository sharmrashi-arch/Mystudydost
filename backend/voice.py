"""Voice transcription (mic -> text) using Groq Whisper."""
try:
    from .llm import transcribe as _transcribe
except ImportError:
    from llm import transcribe as _transcribe


def transcribe(audio_bytes, filename="audio.webm"):
    return _transcribe(audio_bytes, filename)