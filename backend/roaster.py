import json
import os

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


def _fallback_result(message: str) -> dict:
    return {
        "overallScore": 0,
        "summary": message,
        "sections": {
            "experience": {"score": 0, "feedback": message, "improvements": []},
            "projects": {"score": 0, "feedback": message, "improvements": []},
            "skills": {"score": 0, "feedback": message, "improvements": []},
            "education": {"score": 0, "feedback": message, "improvements": []},
        },
        "topStrengths": [],
        "criticalIssues": [],
    }


async def analyze_cv(cv_text: str) -> dict:
    if not cv_text.strip():
        return _fallback_result("Empty CV text.")

    if openai_client is None:
        return _fallback_result("OPENAI_API_KEY is not configured.")

    system_prompt = (
        "You are an elite, brutally honest senior tech recruiter with 10+ years of experience. "
        "Be direct and honest, not overly positive. Focus on clarity, measurable impact, technical depth, "
        "and ATS compatibility. Return a single JSON object only. No markdown, no code fences, no extra text. "
        "Score missing sections as 0. Provide highly detailed, in-depth explanations and paragraphs for every "
        "piece of feedback."
    )

    user_prompt = (
        "Analyze the CV in extreme detail. For feedback and improvements, write full, descriptive sentences "
        "(2-3 sentences each) explaining exactly WHY it's bad and HOW to fix it. "
        "Respond with JSON matching this schema exactly:\n"
        "{\n"
        "  \"overallScore\": 85,\n"
        "  \"summary\": \"A detailed 3-4 sentence paragraph summarizing the CV's strengths, weaknesses, and overall impression...\",\n"
        "  \"sections\": {\n"
        "    \"experience\": {\"score\": 80, \"feedback\": \"Detailed paragraph explaining the experience section issues...\", \"improvements\": [\"Actionable step 1 with explanation\", \"Actionable step 2 with explanation\"]},\n"
        "    \"projects\": {\"score\": 90, \"feedback\": \"Detailed paragraph...\", \"improvements\": [\"...\", \"...\"]},\n"
        "    \"skills\": {\"score\": 75, \"feedback\": \"Detailed paragraph...\", \"improvements\": [\"...\", \"...\"]},\n"
        "    \"education\": {\"score\": 70, \"feedback\": \"Detailed paragraph...\", \"improvements\": [\"...\", \"...\"]}\n"
        "  },\n"
        "  \"topStrengths\": [\"Detailed strength 1 with context\", \"Detailed strength 2 with context\"],\n"
        "  \"criticalIssues\": [\"Detailed critical issue 1 with explanation\", \"Detailed critical issue 2 with explanation\"]\n"
        "}\n\n"
        f"CV TEXT:\n{cv_text}"
    )

    response = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )

    response_text = response.choices[0].message.content.strip()

    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        return _fallback_result("Model response was not valid JSON.")
