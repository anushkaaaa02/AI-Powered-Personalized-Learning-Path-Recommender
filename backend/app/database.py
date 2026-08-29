"""
PathWise Backend — MongoDB connection (Motor async driver)
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

_client: AsyncIOMotorClient = AsyncIOMotorClient(settings.MONGO_URI)
db = _client[settings.DB_NAME]

users_collection = db["users"]


async def ensure_indexes():
    """Create required indexes. Called once on app startup."""
    await users_collection.create_index("email", unique=True)


def get_client() -> AsyncIOMotorClient:
    return _client
