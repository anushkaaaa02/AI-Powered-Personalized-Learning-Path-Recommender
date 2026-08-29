"""
PathWise Backend — Content routes
Serves the static reference data (career paths, roadmaps, projects,
achievements) from the server, so the frontend and any future client
(mobile app, admin panel, etc.) share one source of truth.
"""
from fastapi import APIRouter, HTTPException, status

from app.content import CAREER_PATHS, ROADMAPS, PROJECTS, ACHIEVEMENTS

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("/paths")
async def get_paths():
    return CAREER_PATHS


@router.get("/roadmap/{path_id}")
async def get_roadmap(path_id: str):
    roadmap = ROADMAPS.get(path_id)
    if roadmap is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown career path.")
    return roadmap


@router.get("/projects")
async def get_projects():
    return PROJECTS


@router.get("/achievements")
async def get_achievements():
    return ACHIEVEMENTS
