"""Adaptive questions endpoint."""
import logging
from fastapi import APIRouter, HTTPException, Query

from app.services.adaptive_questions import identify_required_questions, get_question_config

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/questions/adaptive")
async def get_adaptive_questions(symptom: str = Query(..., description="Main symptom")):
    """Get adaptive questions based on symptom."""
    try:
        question_types = identify_required_questions(symptom)
        questions = []
        
        for q_type in question_types:
            config = get_question_config(q_type)
            questions.extend(config.get("questions", []))
        
        return {
            "symptom": symptom,
            "required_questions": questions,
            "question_count": len(questions)
        }
    except Exception as e:
        logger.error(f"Error getting adaptive questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

