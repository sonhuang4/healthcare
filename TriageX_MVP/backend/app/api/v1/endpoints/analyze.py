"""Health analysis endpoint."""
import logging
from fastapi import APIRouter, HTTPException

from app.schemas.health import HealthData, HealthResponse, ExplanationTag
from app.services.triage_logic import analyze_health
from app.db.database import log_assessment
from app.utils.cache import generate_cache_key, get_cached, set_cached

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/analyze", response_model=HealthResponse)
async def analyze_health_risk(data: HealthData):
    """Analyze health risk based on symptoms and vitals."""
    try:
        # Generate cache key from input data
        cache_key = generate_cache_key(data.dict())
        
        # Check cache first
        cached_result = get_cached(cache_key)
        if cached_result:
            logger.info(f"Cache HIT for key: {cache_key[:8]}...")
            # Convert explanation_tags dicts to ExplanationTag objects for response
            try:
                if cached_result.get("explanation_tags"):
                    explanation_tags = [ExplanationTag(**tag) for tag in cached_result.get("explanation_tags", [])]
                    cached_result["explanation_tags"] = explanation_tags
                else:
                    cached_result["explanation_tags"] = []
            except Exception as tag_error:
                logger.warning(f"Error converting cached explanation tags: {str(tag_error)}")
                cached_result["explanation_tags"] = []
            return HealthResponse(**cached_result)
        
        logger.info(f"Cache MISS - Processing: {data.symptom[:50]}..., HR: {data.heart_rate}, Temp: {data.temperature}, SpO2: {data.spo2}")
        
        # Process the request
        result = analyze_health(data)
        
        logger.info(f"Analysis result: {result['level']} - {result['message']}")
        
        # Log assessment to database (before converting to ExplanationTag objects)
        try:
            form_data = data.dict()
            log_assessment(form_data, result)
        except Exception as log_error:
            logger.error(f"Failed to log assessment: {str(log_error)}")
            # Don't fail the request if logging fails
        
        # Convert explanation_tags dicts to ExplanationTag objects for response
        try:
            explanation_tags = [ExplanationTag(**tag) for tag in result.get("explanation_tags", [])]
            result["explanation_tags"] = explanation_tags
        except Exception as tag_error:
            logger.warning(f"Error converting explanation tags: {str(tag_error)}")
            result["explanation_tags"] = []
        
        # Cache the result (before converting ExplanationTag objects)
        # result already contains dicts, so we can cache it directly
        set_cached(cache_key, result)
        logger.info(f"Cached result with key: {cache_key[:8]}...")
        
        return HealthResponse(**result)
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error analyzing health data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

