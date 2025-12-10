"""Explanation endpoint."""
import json
import logging
from fastapi import APIRouter, HTTPException

from app.db.database import get_assessments

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/explain/{assessment_id}")
async def get_explanation(assessment_id: int):
    """Get detailed explanation for a specific assessment."""
    try:
        # Fetch assessment from database
        assessments = get_assessments(limit=1000)
        assessment = next((a for a in assessments if a.get("id") == assessment_id), None)
        
        if not assessment:
            raise HTTPException(status_code=404, detail=f"Assessment {assessment_id} not found")
        
        # Parse explanation tags if stored as JSON string
        explanation_tags = assessment.get("explanation_tags", [])
        if isinstance(explanation_tags, str):
            try:
                explanation_tags = json.loads(explanation_tags)
            except json.JSONDecodeError:
                explanation_tags = []
        
        key_factors = assessment.get("key_factors", [])
        if isinstance(key_factors, str):
            try:
                key_factors = json.loads(key_factors)
            except json.JSONDecodeError:
                key_factors = []
        
        return {
            "assessment_id": assessment_id,
            "triage_level": assessment.get("triage_level"),
            "confidence": assessment.get("confidence"),
            "key_factors": key_factors,
            "explanation_tags": explanation_tags,
            "data_quality": assessment.get("data_quality"),
            "low_confidence_warning": assessment.get("low_confidence_warning", False)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting explanation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

