from typing import Dict, List

from pydantic import BaseModel


class SectionAnalysis(BaseModel):
    score: int
    feedback: str
    improvements: List[str]


class CVAnalysis(BaseModel):
    overallScore: int
    summary: str
    sections: Dict[str, SectionAnalysis]
    topStrengths: List[str]
    criticalIssues: List[str]
