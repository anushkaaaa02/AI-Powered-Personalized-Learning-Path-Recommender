"""
PathWise Backend — FastAPI application entrypoint
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import get_settings
from app.database import ensure_indexes
from app.routers import auth, userdata, progress, content

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for PathWise — an AI-powered personalized learning path recommender.",
    version="1.0.0",
)

origins = ["*"] if settings.CORS_ORIGINS.strip() == "*" else [
    o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first = exc.errors()[0]
    field = ".".join(str(x) for x in first["loc"] if x != "body")
    message = first["msg"]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": f"{field}: {message}" if field else message},
    )


@app.on_event("startup")
async def on_startup():
    await ensure_indexes()


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "service": settings.APP_NAME}


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "healthy"}


app.include_router(auth.router)
app.include_router(userdata.router)
app.include_router(progress.router)
app.include_router(content.router)
