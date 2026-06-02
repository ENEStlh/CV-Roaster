import asyncio
import io

import pdfplumber


async def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file provided as bytes."""
    if not file_bytes:
        raise ValueError("Empty PDF file.")

    def _extract() -> str:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        return "\n".join(pages).strip()

    try:
        text = await asyncio.to_thread(_extract)
    except Exception as exc:
        raise ValueError("Unable to read PDF content.") from exc

    if not text:
        raise ValueError("No extractable text in PDF.")

    return text
