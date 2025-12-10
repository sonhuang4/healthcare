"""AI status endpoint."""
import logging
from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/ai/status")
async def get_ai_status():
    """Get AI model status and availability."""
    try:
        # For now, AI is not enabled
        # This endpoint is prepared for future AI integration
        return {
            "ai_enabled": False,
            "model_type": None,
            "model_loaded": False,
            "status": "AI integration not yet implemented. Using rule-based triage logic."
        }
    except Exception as e:
        logger.error(f"Error getting AI status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

