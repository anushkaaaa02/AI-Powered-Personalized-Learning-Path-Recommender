"""
PathWise Backend — User data, assessment & recommendation routes
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import users_collection
from app.deps import get_current_user
from app.models import AssessmentIn
from app import recommendation as rec_engine

router = APIRouter(prefix="/api", tags=["userdata"])


@router.get("/userdata")
async def get_userdata(current_user: dict = Depends(get_current_user)):
    return {
        "assessment": current_user.get("assessment"),
        "learningPath": current_user.get("learningPath"),
        "progress": current_user.get("progress"),
        "achievements": current_user.get("achievements"),
    }


@router.post("/assessment")
async def save_assessment(payload: AssessmentIn, current_user: dict = Depends(get_current_user)):
    assessment = payload.model_dump()
    # mirror the frontend rule: "I am just starting" clears the skills list
    if "none" in assessment.get("skills", []):
        assessment["skills"] = []

    await users_collection.update_one(
        {"email": current_user["email"]}, {"$set": {"assessment": assessment}}
    )
    return {"assessment": assessment}


@router.post("/recommendation/generate")
async def generate_recommendation(current_user: dict = Depends(get_current_user)):
    assessment = current_user.get("assessment")
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complete the career assessment before requesting a recommendation.",
        )

    result = rec_engine.compute(assessment)
    primary = result["primary"]

    learning_path = {
        "pathId": primary["id"],
        "pathName": primary["name"],
        "matchPercentage": primary["percentage"],
        "duration": result["duration"],
        "reasons": result["reasons"],
        "alternatives": result["alternatives"],
    }

    await users_collection.update_one(
        {"email": current_user["email"]}, {"$set": {"learningPath": learning_path}}
    )
    return learning_path
