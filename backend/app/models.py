"""
PathWise Backend — Pydantic schemas (request/response bodies)
"""
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator


# ---------------- Auth ----------------

class SignupIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    education: Optional[str] = ""


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdateIn(BaseModel):
    name: Optional[str] = None
    education: Optional[str] = None


class UserOut(BaseModel):
    name: str
    email: str
    education: str = ""
    createdAt: Optional[str] = None


class TokenOut(BaseModel):
    token: str
    user: UserOut


# ---------------- Assessment ----------------

class AssessmentIn(BaseModel):
    interests: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    experience: Optional[str] = None
    goal: Optional[str] = None
    studyTime: Optional[str] = None

    @field_validator("interests")
    @classmethod
    def must_have_interest(cls, v):
        if not v:
            raise ValueError("At least one interest is required.")
        return v


# ---------------- Progress ----------------

class TopicIn(BaseModel):
    topicId: str


class ProjectIn(BaseModel):
    projectName: str
