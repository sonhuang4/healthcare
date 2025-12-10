"""Information endpoints."""
import logging
from fastapi import APIRouter, HTTPException

from app.schemas.info import InfoResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/info/{info_type}", response_model=InfoResponse)
async def get_info(info_type: str):
    """Get information about measurement guides."""
    try:
        info_content = {
            "temperature": {
                "title": "Temperature",
                "description": "Measure your body temperature using a thermometer. Normal body temperature is around 36.5-37.5°C. Place the thermometer under your tongue or in your armpit for accurate reading.",
                "video_url": None
            },
            "heart_rate": {
                "title": "Heart Rate",
                "description": "Find your pulse on your wrist or neck. Count the beats for 30 seconds and multiply by 2, or count for a full minute. Normal resting heart rate is 60-100 bpm.",
                "video_url": None
            },
            "spo2": {
                "title": "SpO₂ (Oxygen Saturation)",
                "description": "Measure your blood oxygen level using a pulse oximeter. Place the device on your finger and wait for a reading. Normal SpO₂ is 95-100%. Values below 90% may indicate a medical emergency.",
                "video_url": None
            },
            "blood_pressure": {
                "title": "Blood Pressure",
                "description": "Measure your blood pressure using a blood pressure monitor. Normal blood pressure is typically around 120/80 mmHg. Enter in format: systolic/diastolic (e.g., 120/80).",
                "video_url": None
            },
            "symptom": {
                "title": "Main Symptom",
                "description": "Describe your primary symptom or concern. Be as specific as possible (e.g., 'chest pain', 'headache for 3 days', 'fever and cough').",
                "video_url": None
            },
            "duration": {
                "title": "Duration",
                "description": "How long have you been experiencing these symptoms? This helps determine the urgency of care needed.",
                "video_url": None
            }
        }
        
        if info_type not in info_content:
            raise HTTPException(status_code=404, detail=f"Info type '{info_type}' not found")
        
        return InfoResponse(**info_content[info_type])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

