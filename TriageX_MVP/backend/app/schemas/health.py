"""Health assessment request and response schemas."""
from pydantic import BaseModel, Field, validator
from typing import List, Optional


class HealthData(BaseModel):
    """Request schema for health assessment."""
    symptom: str = Field(..., min_length=1, max_length=500)
    heart_rate: Optional[int] = Field(None, ge=30, le=220)
    temperature: Optional[float] = Field(None, ge=35.0, le=45.0)
    spo2: Optional[int] = Field(None, ge=70, le=100)
    blood_pressure: Optional[str] = Field(None, min_length=1, max_length=20)
    duration: Optional[str] = Field(None, max_length=100)
    # Additional fields for logging
    age: Optional[str] = None
    gender: Optional[str] = None
    respiratory_rate: Optional[str] = None
    level_of_consciousness: Optional[str] = None
    onset: Optional[str] = None
    pain_level: Optional[str] = None
    # Adaptive questions
    leg_redness: Optional[str] = None
    leg_warmth: Optional[str] = None
    leg_duration: Optional[str] = None
    head_dizziness: Optional[str] = None
    head_vomiting: Optional[str] = None
    head_loss_consciousness: Optional[str] = None
    chest_radiation: Optional[str] = None
    chest_shortness_breath: Optional[str] = None
    chest_nausea: Optional[str] = None
    # Medical history
    has_medical_conditions: Optional[bool] = None
    medical_conditions: Optional[List[str]] = None
    medical_conditions_other: Optional[str] = Field(None, max_length=500)
    has_medications: Optional[bool] = None
    medications: Optional[List[str]] = None
    medications_other: Optional[str] = Field(None, max_length=500)
    is_pregnant: Optional[bool] = None
    pregnancy_trimester: Optional[str] = None
    pregnancy_weeks: Optional[int] = Field(None, ge=0, le=42)
    is_trauma_related: Optional[bool] = None
    trauma_type: Optional[str] = None
    trauma_description: Optional[str] = Field(None, max_length=1000)

    @validator("temperature")
    def validate_temperature(cls, v):
        if v is not None and (v < 35.0 or v > 45.0):
            raise ValueError("Temperature must be between 35-45°C")
        return v

    @validator("spo2")
    def validate_spo2(cls, v):
        if v is not None and (v < 70 or v > 100):
            raise ValueError("SpO₂ must be between 70-100")
        return v

    @validator("blood_pressure")
    def validate_blood_pressure(cls, v):
        if v is not None:
            import re
            if not re.match(r'^\d{2,3}/\d{2,3}$', v):
                raise ValueError("Blood pressure must be in format: systolic/diastolic (e.g., 120/80)")
        return v

    @validator("has_medical_conditions", "has_medications", "is_pregnant", "is_trauma_related", pre=True)
    def convert_yes_no_to_bool(cls, v):
        """Convert 'yes'/'no' strings to boolean, or keep existing bool/None."""
        if v is None:
            return None
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            v_lower = v.lower().strip()
            if v_lower == "yes":
                return True
            elif v_lower == "no":
                return False
        return None


class ExplanationTag(BaseModel):
    """Explanation tag for SHAP-style explanations."""
    factor: str = Field(..., description="Factor name")
    weight: float = Field(..., ge=0.0, le=1.0, description="Impact weight")
    category: str = Field(..., description="Category: vital_signs, symptom_scenario, general")
    impact: str = Field(..., description="Impact: increased_risk, decreased_risk")


class HealthResponse(BaseModel):
    """Response schema for health assessment."""
    level: str = Field(..., description="Triage level: self_care, primary_care, semi_emergency, or emergency")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0.0-1.0)")
    message: str = Field(..., description="Personalized message for the user")
    recommendations: List[str] = Field(..., description="List of care recommendations")
    safety_note: str = Field(..., description="Important safety note")
    key_factors: List[str] = Field(default_factory=list, description="Key decision factors")
    explanation_tags: List[ExplanationTag] = Field(default_factory=list, description="SHAP-style explanation tags")
    data_quality: float = Field(0.0, ge=0.0, le=1.0, description="Data quality score")
    low_confidence_warning: bool = Field(False, description="True if confidence < 0.7")
    ai_enabled: bool = Field(False, description="Whether AI was used in assessment")

