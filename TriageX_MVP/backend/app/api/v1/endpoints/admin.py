"""Admin panel endpoints."""
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.db.database import get_assessments, get_analytics

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/admin/assessments")
async def get_assessments_endpoint(
    start_date: Optional[str] = Query(None, description="Start date filter (ISO format)"),
    end_date: Optional[str] = Query(None, description="End date filter (ISO format)"),
    triage_level: Optional[str] = Query(None, description="Filter by triage level"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
):
    """Get assessments with filtering (Admin Panel)."""
    try:
        assessments = get_assessments(
            start_date=start_date,
            end_date=end_date,
            triage_level=triage_level,
            limit=limit,
            offset=offset
        )
        return {"assessments": assessments, "count": len(assessments)}
    except Exception as e:
        logger.error(f"Error fetching assessments: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/admin/analytics")
async def get_analytics_endpoint(
    start_date: Optional[str] = Query(None, description="Start date filter (ISO format)"),
    end_date: Optional[str] = Query(None, description="End date filter (ISO format)")
):
    """Get analytics summary (Admin Panel)."""
    try:
        analytics = get_analytics(start_date=start_date, end_date=end_date)
        return analytics
    except Exception as e:
        logger.error(f"Error fetching analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

