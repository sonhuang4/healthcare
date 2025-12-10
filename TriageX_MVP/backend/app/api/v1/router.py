"""API v1 router that combines all endpoints."""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    analyze,
    consent,
    info,
    questions,
    explain,
    ai,
    admin,
    health,
)

# Create main API v1 router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(analyze.router, prefix="/api/v1", tags=["Analysis"])
api_router.include_router(consent.router, prefix="/api/v1", tags=["Consent"])
api_router.include_router(info.router, prefix="/api/v1", tags=["Info"])
api_router.include_router(questions.router, prefix="/api/v1", tags=["Questions"])
api_router.include_router(explain.router, prefix="/api/v1", tags=["Explain"])
api_router.include_router(ai.router, prefix="/api/v1", tags=["AI"])
api_router.include_router(admin.router, prefix="/api/v1", tags=["Admin"])

