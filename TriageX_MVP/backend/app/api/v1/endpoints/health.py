"""Health check endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Health Risk Analyzer API is running", "version": "1.0.0"}


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "health-risk-analyzer-api"}

