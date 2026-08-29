"""
PathWise Backend — Progress routes
Streaks, topic completion, project completion, achievement unlocking.
Ported from frontend/js/progressTracker.js so persistence is authoritative
on the server instead of localStorage.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import users_collection
from app.deps import get_current_user
from app.models import TopicIn, ProjectIn
from app.content import flat_topics, total_topics, ROADMAPS

router = APIRouter(prefix="/api/progress", tags=["progress"])


def _bump_streak(progress: dict) -> dict:
    last_active = progress.get("lastActive")
    now = datetime.now(timezone.utc)
    streak = progress.get("streak") or 0

    if last_active:
        try:
            last = datetime.fromisoformat(last_active)
            if last.tzinfo is None:
                last = last.replace(tzinfo=timezone.utc)
        except ValueError:
            last = None
        if last:
            diff_days = (now.date() - last.date()).days
            if diff_days == 1:
                streak += 1
            elif diff_days > 1:
                streak = 1
            # diff_days == 0 -> same day, keep streak as is
    else:
        streak = 1

    progress["streak"] = streak
    progress["lastActive"] = now.isoformat()
    return progress


def _next_topic(path_id: str, progress: dict):
    for t in flat_topics(path_id):
        if t["id"] not in progress["completedTopics"]:
            return t
    return None


def _check_achievements(user: dict) -> tuple[dict, list]:
    progress = user["progress"]
    achievements = dict(user.get("achievements") or {})
    unlocked = []

    if not achievements.get("firstStep") and len(progress["completedTopics"]) >= 1:
        achievements["firstStep"] = True
        unlocked.append("firstStep")

    if not achievements.get("consistentLearner") and (progress.get("streak") or 0) >= 3:
        achievements["consistentLearner"] = True
        unlocked.append("consistentLearner")

    if not achievements.get("projectBuilder") and len(progress.get("completedProjects") or []) >= 1:
        achievements["projectBuilder"] = True
        unlocked.append("projectBuilder")

    learning_path = user.get("learningPath")
    if not achievements.get("pathExplorer") and learning_path:
        roadmap = ROADMAPS.get(learning_path["pathId"], [])
        phase_one_ids = [t["id"] for t in roadmap[0]["topics"]] if roadmap else []
        phase_one_done = bool(phase_one_ids) and all(
            tid in progress["completedTopics"] for tid in phase_one_ids
        )
        if phase_one_done:
            achievements["pathExplorer"] = True
            unlocked.append("pathExplorer")

    return achievements, unlocked


@router.post("/complete-topic")
async def complete_topic(payload: TopicIn, current_user: dict = Depends(get_current_user)):
    learning_path = current_user.get("learningPath")
    if not learning_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active learning path.")

    path_id = learning_path["pathId"]
    progress = dict(current_user["progress"])

    if payload.topicId not in progress["completedTopics"]:
        progress["completedTopics"] = [*progress["completedTopics"], payload.topicId]

    progress = _bump_streak(progress)

    total = total_topics(path_id)
    progress["progressPercentage"] = round((len(progress["completedTopics"]) / total) * 100) if total else 0

    nxt = _next_topic(path_id, progress)
    progress["currentTopic"] = nxt["id"] if nxt else None

    current_user["progress"] = progress
    achievements, unlocked = _check_achievements(current_user)

    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"progress": progress, "achievements": achievements}},
    )

    return {"progress": progress, "achievements": achievements, "unlocked": unlocked}


@router.post("/complete-project")
async def complete_project(payload: ProjectIn, current_user: dict = Depends(get_current_user)):
    progress = dict(current_user["progress"])
    completed = progress.get("completedProjects") or []
    if payload.projectName not in completed:
        completed = [*completed, payload.projectName]
    progress["completedProjects"] = completed
    progress = _bump_streak(progress)

    current_user["progress"] = progress
    achievements, unlocked = _check_achievements(current_user)

    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"progress": progress, "achievements": achievements}},
    )

    return {"progress": progress, "achievements": achievements, "unlocked": unlocked}


@router.post("/set-current-topic")
async def set_current_topic(payload: TopicIn, current_user: dict = Depends(get_current_user)):
    progress = dict(current_user["progress"])
    progress["currentTopic"] = payload.topicId
    await users_collection.update_one(
        {"email": current_user["email"]}, {"$set": {"progress": progress}}
    )
    return {"progress": progress}
