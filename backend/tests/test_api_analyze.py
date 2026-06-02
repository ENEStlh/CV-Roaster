import httpx
import pytest

import pdf_parser
import roaster
from main import app


SAMPLE_PDF_BYTES = b"%PDF-1.4\n%CV-Roaster sample\n"


@pytest.fixture
async def client():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as async_client:
        yield async_client


@pytest.mark.anyio
async def test_analyze_valid_pdf(client, monkeypatch):
    async def fake_extract_text(_: bytes) -> str:
        return "John Doe CV text"

    async def fake_analyze_cv(_: str) -> dict:
        return {
            "overallScore": 85,
            "summary": "Strong technical depth with clear impact.",
            "sections": {
                "experience": {
                    "score": 80,
                    "feedback": "Impact is clear but could quantify more.",
                    "improvements": ["Add metrics", "Tighten bullet points"],
                },
                "projects": {
                    "score": 90,
                    "feedback": "Projects show ownership and scope.",
                    "improvements": ["Add scale details", "Highlight stack"],
                },
                "skills": {
                    "score": 75,
                    "feedback": "Good coverage but missing tooling depth.",
                    "improvements": ["Add CI/CD", "Group by category"],
                },
                "education": {
                    "score": 70,
                    "feedback": "Include notable coursework.",
                    "improvements": ["Add GPA", "Add honors"],
                },
            },
            "topStrengths": ["Impact", "Ownership", "Clarity"],
            "criticalIssues": ["ATS keywords", "Metrics", "Consistency"],
        }

    monkeypatch.setattr(pdf_parser, "extract_text_from_pdf", fake_extract_text)
    monkeypatch.setattr(roaster, "analyze_cv", fake_analyze_cv)

    files = {
        "file": ("resume.pdf", SAMPLE_PDF_BYTES, "application/pdf"),
    }

    response = await client.post("/api/analyze", files=files)

    assert response.status_code == 200
    data = response.json()

    assert set(data.keys()) == {
        "overallScore",
        "summary",
        "sections",
        "topStrengths",
        "criticalIssues",
    }
    assert "experience" in data["sections"]
    assert isinstance(data["topStrengths"], list)
    assert isinstance(data["criticalIssues"], list)


@pytest.mark.anyio
async def test_analyze_rejects_non_pdf(client):
    files = {
        "file": ("notes.txt", b"not a pdf", "text/plain"),
    }

    response = await client.post("/api/analyze", files=files)

    assert response.status_code == 400


@pytest.mark.anyio
async def test_analyze_rejects_empty_file(client):
    files = {
        "file": ("resume.pdf", b"", "application/pdf"),
    }

    response = await client.post("/api/analyze", files=files)

    assert response.status_code == 422
