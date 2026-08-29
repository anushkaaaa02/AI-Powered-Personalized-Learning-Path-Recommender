"""
PathWise Backend — Auth routes
"""
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status, Depends
from pymongo.errors import DuplicateKeyError

from app.database import users_collection
from app.security import hash_password, verify_password, create_access_token
from app.models import SignupIn, LoginIn, TokenOut, UserOut, ProfileUpdateIn
from app.content import default_progress, default_achievements
from app.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _user_out(doc: dict) -> UserOut:
    return UserOut(
        name=doc["name"],
        email=doc["email"],
        education=doc.get("education", ""),
        createdAt=doc.get("createdAt"),
    )


@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupIn):
    email = payload.email.lower()

    doc = {
        "name": payload.name.strip(),
        "email": email,
        "passwordHash": hash_password(payload.password),
        "education": payload.education or "",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "assessment": None,
        "learningPath": None,
        "progress": default_progress(),
        "achievements": default_achievements(),
    }

    try:
        await users_collection.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    token = create_access_token(subject=email)
    return TokenOut(token=token, user=_user_out(doc))


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    email = payload.email.lower()
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No account found with this email.")
    if not verify_password(payload.password, user["passwordHash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password.")

    token = create_access_token(subject=email)
    return TokenOut(token=token, user=_user_out(user))


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return _user_out(current_user)


@router.put("/profile", response_model=UserOut)
async def update_profile(payload: ProfileUpdateIn, current_user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await users_collection.update_one({"email": current_user["email"]}, {"$set": updates})
        current_user.update(updates)
    return _user_out(current_user)
