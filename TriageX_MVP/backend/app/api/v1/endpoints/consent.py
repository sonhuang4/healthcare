"""Consent tracking endpoint."""
import logging
from fastapi import APIRouter, HTTPException

from app.schemas.consent import ConsentData, ConsentResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/consent", response_model=ConsentResponse)
async def record_consent(data: ConsentData):
    """Record user consent for data processing."""
    try:
        if not data.consent:
            raise HTTPException(status_code=400, detail="Consent is required to proceed")
        
        logger.info(f"Consent recorded: {data.consent}, Locale: {data.locale}")
        
        return ConsentResponse(
            status="accepted",
            message=f"Consent recorded successfully. Locale: {data.locale}"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error recording consent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

