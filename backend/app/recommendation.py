"""
PathWise Backend — Recommendation Engine
Rule-based scoring system, ported 1:1 from frontend/js/recommendation.js so
the server is authoritative. Kept as a pure function of assessment -> ranked
paths, so it can be swapped for a real ML model later without touching any
route or the frontend contract.
"""
from app.content import CAREER_PATHS

INTEREST_MAP = {
    "web": "web",
    "ai": "ai",
    "data": "data",
    "cyber": "cyber",
    "mobile": "mobile",
    "uiux": "web",
}

DURATION_MAP = {
    "30min": "8-10 months",
    "1hr": "6-8 months",
    "2hr": "4-6 months",
    "2plus": "3-4 months",
}


def _score_path(path: dict, assessment: dict) -> int:
    score = 0

    interests = assessment.get("interests", [])
    interest_hit = any(INTEREST_MAP.get(i) == path["interests"][0] for i in interests)
    if interest_hit:
        score += 40

    skills = assessment.get("skills", [])
    skill_hits = [s for s in skills if s in path["relatedSkills"]]
    score += len(skill_hits) * 10

    if assessment.get("experience"):
        score += 10

    if assessment.get("goal") in path["goals"]:
        score += 10

    return score


def _estimate_duration(study_time: str) -> str:
    return DURATION_MAP.get(study_time, "4-6 months")


def _build_reasons(primary: dict, assessment: dict) -> list:
    path = CAREER_PATHS[primary["id"]]
    reasons = []
    interests = assessment.get("interests", [])
    if any(INTEREST_MAP.get(i) == path["interests"][0] for i in interests):
        reasons.append("Matches your interests")
    skills = assessment.get("skills", [])
    if any(s in path["relatedSkills"] for s in skills):
        reasons.append("Matches your existing skills")
    reasons.append("Suitable for your experience level")
    if assessment.get("goal") in path["goals"]:
        reasons.append("Supports your career goal")
    return reasons


def compute(assessment: dict) -> dict:
    paths = list(CAREER_PATHS.values())
    raw_scores = [{"path": p, "raw": _score_path(p, assessment)} for p in paths]

    skills = assessment.get("skills", [])
    max_possible = 40 + (len(skills) * 10 or 10) + 10 + 10

    ranked = []
    for r in raw_scores:
        p = r["path"]
        pct = round((r["raw"] / max_possible) * 100)
        pct = max(8, min(97, pct))
        ranked.append({
            "id": p["id"],
            "name": p["name"],
            "icon": p["icon"],
            "skills": p["skills"],
            "raw": r["raw"],
            "percentage": pct,
        })
    ranked.sort(key=lambda x: x["percentage"], reverse=True)

    primary = ranked[0]
    alternatives = ranked[1:3]

    return {
        "primary": primary,
        "alternatives": alternatives,
        "duration": _estimate_duration(assessment.get("studyTime")),
        "reasons": _build_reasons(primary, assessment),
    }
