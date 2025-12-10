"""
Enhanced triage logic with medical scenario handlers and proper risk scoring.
"""
from typing import Dict, List, Tuple, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.health import HealthData
else:
    # Import at runtime to avoid circular dependency
    HealthData = None


def check_emergency_indicators(data) -> Optional[Dict]:
    """
    Check for critical emergency indicators that override normal triage.
    Returns emergency result if found, None otherwise.
    """
    # Critical SpO2
    if data.spo2 and data.spo2 < 85:
        return {
            "level": "emergency",
            "confidence": 0.95,
            "message": "Critical low oxygen detected. Seek immediate medical attention.",
            "key_factors": ["Critical low oxygen saturation"],
            "override_reason": "critical_spo2"
        }
    
    # Loss of consciousness
    if data.level_of_consciousness:
        loc_lower = data.level_of_consciousness.lower()
        if "unresponsive" in loc_lower or "coma" in loc_lower:
            return {
                "level": "emergency",
                "confidence": 0.95,
                "message": "Altered consciousness detected. Seek immediate medical attention.",
                "key_factors": ["Altered consciousness"],
                "override_reason": "altered_consciousness"
            }
    
    # Head injury with loss of consciousness
    if data.head_loss_consciousness and data.head_loss_consciousness.lower() in ["yes", "y"]:
        return {
            "level": "emergency",
            "confidence": 0.9,
            "message": "Head injury with loss of consciousness. Seek immediate medical attention.",
            "key_factors": ["Head injury", "Loss of consciousness"],
            "override_reason": "head_injury_loc"
        }
    
    # Trauma + loss of consciousness (from medical history)
    if hasattr(data, 'is_trauma_related') and data.is_trauma_related is True and data.head_loss_consciousness and data.head_loss_consciousness.lower() in ["yes", "y"]:
        return {
            "level": "emergency",
            "confidence": 0.9,
            "message": "Trauma with loss of consciousness. Seek immediate medical attention.",
            "key_factors": ["Trauma", "Loss of consciousness"],
            "override_reason": "trauma_loc"
        }
    
    # Blood thinners + significant trauma/bleeding
    if hasattr(data, 'medications') and data.medications and hasattr(data, 'is_trauma_related') and data.is_trauma_related is True:
        medications_lower = [med.lower() for med in data.medications] if isinstance(data.medications, list) else []
        blood_thinner_keywords = ["warfarin", "noak", "noac", "aspirin", "blood thinner", "blodförtunnande", "blood thinners"]
        has_blood_thinners = any(
            any(keyword in med for keyword in blood_thinner_keywords)
            for med in medications_lower
        )
        if has_blood_thinners:
            symptom_lower = data.symptom.lower() if data.symptom else ""
            if any(word in symptom_lower for word in ["bleeding", "blood", "hemorrhage"]) or (hasattr(data, 'trauma_type') and data.trauma_type):
                return {
                    "level": "emergency",
                    "confidence": 0.85,
                    "message": "Patient on blood thinners with trauma/bleeding. Seek immediate medical attention.",
                    "key_factors": ["Blood thinners", "Trauma/Bleeding"],
                    "override_reason": "blood_thinner_trauma"
                }
    
    return None


def assess_chest_pain(data) -> Tuple[float, List[str]]:
    """
    Assess chest pain scenarios.
    Returns: (risk_adjustment, key_factors)
    """
    risk_adjust = 0.0
    factors = []
    
    symptom_lower = data.symptom.lower()
    
    # Check for chest pain keywords
    if any(word in symptom_lower for word in ["chest pain", "chest discomfort", "pressure", "chest"]):
        risk_adjust += 0.3  # Base chest pain risk
        factors.append("Chest pain")
        
        # Check adaptive questions (case-insensitive)
        if data.chest_radiation and data.chest_radiation.lower() in ["yes", "y"]:
            risk_adjust += 0.2
            factors.append("Radiating pain")
        
        if data.chest_shortness_breath and data.chest_shortness_breath.lower() in ["yes", "y"]:
            risk_adjust += 0.3
            factors.append("Shortness of breath")
        
        if data.chest_nausea and data.chest_nausea.lower() in ["yes", "y"]:
            risk_adjust += 0.1
            factors.append("Nausea")
        
        # Check vitals
        if data.heart_rate and data.heart_rate > 100:
            risk_adjust += 0.15
            factors.append("Elevated heart rate")
        
        if data.spo2 and data.spo2 < 95:
            risk_adjust += 0.25
            factors.append("Low oxygen saturation")
    
    return risk_adjust, factors


def assess_shortness_breath(data) -> Tuple[float, List[str]]:
    """
    Assess respiratory emergency scenarios.
    Returns: (risk_adjustment, key_factors)
    """
    risk_adjust = 0.0
    factors = []
    
    symptom_lower = data.symptom.lower()
    
    if any(word in symptom_lower for word in ["shortness of breath", "difficulty breathing", "can't breathe", "dyspnea", "sob"]):
        risk_adjust += 0.4  # High base risk for respiratory issues
        factors.append("Shortness of breath")
        
        # Critical: SpO2 is key indicator
        if data.spo2:
            if data.spo2 < 90:
                risk_adjust += 0.4  # Emergency
                factors.append("Critical low oxygen")
            elif data.spo2 < 95:
                risk_adjust += 0.2
                factors.append("Low oxygen saturation")
        
        # Respiratory rate
        if data.respiratory_rate:
            try:
                rr = int(data.respiratory_rate)
                if rr > 24:
                    risk_adjust += 0.2
                    factors.append("Rapid breathing")
                elif rr < 12:
                    risk_adjust += 0.15
                    factors.append("Slow breathing")
            except ValueError:
                pass
        
        # Heart rate elevation
        if data.heart_rate and data.heart_rate > 100:
            risk_adjust += 0.1
            factors.append("Elevated heart rate")
    
    return risk_adjust, factors


def assess_dvt_risk(data) -> Tuple[float, List[str]]:
    """
    Assess Deep Vein Thrombosis (DVT) risk from swollen leg symptoms.
    Returns: (risk_adjustment, key_factors)
    """
    risk_adjust = 0.0
    factors = []
    
    symptom_lower = data.symptom.lower()
    
    if any(word in symptom_lower for word in ["swollen leg", "leg swelling", "dvt", "swollen"]):
        risk_adjust += 0.25  # Base DVT concern
        factors.append("Leg swelling")
        
        # Adaptive questions (case-insensitive check)
        if data.leg_redness and data.leg_redness.lower() in ["yes", "y"]:
            risk_adjust += 0.2
            factors.append("Leg redness")
        
        if data.leg_warmth and data.leg_warmth.lower() in ["yes", "y"]:
            risk_adjust += 0.2
            factors.append("Warm leg")
        
        if data.leg_duration:
            # Recent onset (< 48 hours) increases risk
            if "hour" in data.leg_duration.lower() or "day" in data.leg_duration.lower():
                risk_adjust += 0.15
                factors.append("Recent onset")
        
        # Pain level matters
        if data.pain_level:
            try:
                pain = int(data.pain_level)
                if pain >= 7:
                    risk_adjust += 0.15
                    factors.append("Severe pain")
            except ValueError:
                pass
    
    return risk_adjust, factors


def assess_head_injury(data) -> Tuple[float, List[str]]:
    """
    Assess head injury scenarios.
    Returns: (risk_adjustment, key_factors)
    """
    risk_adjust = 0.0
    factors = []
    
    symptom_lower = data.symptom.lower()
    
    if any(word in symptom_lower for word in ["head injury", "head trauma", "hit head", "concussion"]):
        risk_adjust += 0.3
        factors.append("Head injury")
        
        # Adaptive questions (case-insensitive)
        if data.head_loss_consciousness and data.head_loss_consciousness.lower() in ["yes", "y"]:
            risk_adjust += 0.3
            factors.append("Loss of consciousness")
        
        if data.head_vomiting and data.head_vomiting.lower() in ["yes", "y"]:
            risk_adjust += 0.2
            factors.append("Vomiting")
        
        if data.head_dizziness and data.head_dizziness.lower() in ["yes", "y"]:
            risk_adjust += 0.1
            factors.append("Dizziness")
        
        # Level of consciousness
        if data.level_of_consciousness:
            loc_lower = data.level_of_consciousness.lower()
            if "confused" in loc_lower or "unresponsive" in loc_lower:
                risk_adjust += 0.3
                factors.append("Altered consciousness")
    
    return risk_adjust, factors


def assess_vital_signs(data) -> Tuple[float, List[str]]:
    """
    Assess vital signs and calculate risk contribution.
    Returns: (risk_score, key_factors)
    """
    risk = 0.0
    factors = []
    
    # Temperature risk (normal: 36.5-37.5°C)
    if data.temperature:
        temp = data.temperature
        if temp < 36.0 or temp > 38.5:
            risk += 0.3
            factors.append("Abnormal temperature")
        elif temp < 36.5 or temp > 37.5:
            risk += 0.15
            factors.append("Slightly abnormal temperature")
    
    # Heart rate risk (normal: 60-100 bpm)
    if data.heart_rate:
        hr = data.heart_rate
        if hr < 50 or hr > 120:
            risk += 0.3
            factors.append("Abnormal heart rate")
        elif hr < 60 or hr > 100:
            risk += 0.15
            factors.append("Elevated heart rate")
    
    # SpO₂ risk (normal: 95-100%)
    if data.spo2:
        spo2 = data.spo2
        if spo2 < 90:
            risk += 0.5
            factors.append("Critical low oxygen")
        elif spo2 < 95:
            risk += 0.2
            factors.append("Low oxygen saturation")
    
    # Respiratory rate
    if data.respiratory_rate:
        try:
            rr = int(data.respiratory_rate)
            if rr > 24 or rr < 12:
                risk += 0.2
                factors.append("Abnormal respiratory rate")
        except ValueError:
            pass
    
    # Blood pressure (basic check)
    if data.blood_pressure:
        try:
            parts = data.blood_pressure.split('/')
            if len(parts) == 2:
                systolic = int(parts[0])
                diastolic = int(parts[1])
                if systolic > 180 or diastolic > 120:
                    risk += 0.2
                    factors.append("High blood pressure")
                elif systolic < 90:
                    risk += 0.15
                    factors.append("Low blood pressure")
        except (ValueError, IndexError):
            pass
    
    return risk, factors


def assess_medical_history(data) -> Tuple[float, List[str]]:
    """
    Assess medical history impact on triage risk.
    Returns: (risk_adjustment, key_factors)
    """
    risk_adjust = 0.0
    factors = []
    
    symptom_lower = data.symptom.lower() if data.symptom else ""
    
    # 1. Pregnancy considerations
    if data.is_pregnant is True:
        factors.append("Pregnancy")
        # Third trimester complications
        if data.pregnancy_trimester == "third":
            risk_adjust += 0.1
            factors.append("Third trimester")
            # Third trimester + chest pain/shortness of breath = higher risk
            if any(word in symptom_lower for word in ["chest pain", "chest discomfort", "shortness of breath", "difficulty breathing"]):
                risk_adjust += 0.2
                factors.append("Pregnancy with respiratory/cardiac symptoms")
        
        # Pregnancy + trauma = higher risk
        if data.is_trauma_related is True:
            risk_adjust += 0.15
            factors.append("Pregnancy with trauma")
    
    # 2. Medication interactions
    if data.medications is not None and len(data.medications) > 0:
        medications_lower = [med.lower() for med in data.medications]
        
        # Check for blood thinners
        blood_thinner_keywords = ["warfarin", "noak", "noac", "aspirin", "blood thinner", "blodförtunnande", "blood thinners"]
        has_blood_thinners = any(
            any(keyword in med for keyword in blood_thinner_keywords)
            for med in medications_lower
        )
        
        if has_blood_thinners:
            factors.append("Blood thinners")
            # Blood thinners + trauma/bleeding = higher risk
            if data.is_trauma_related is True:
                risk_adjust += 0.25
                factors.append("Blood thinners with trauma")
            
            # Blood thinners + bleeding symptoms
            if any(word in symptom_lower for word in ["bleeding", "blood", "hemorrhage"]):
                risk_adjust += 0.2
                factors.append("Blood thinners with bleeding")
        
        # Other medications that may mask symptoms
        masking_meds = ["painkiller", "pain", "analgesic", "opioid", "smärtstillande"]
        has_masking_meds = any(
            any(keyword in med for keyword in masking_meds)
            for med in medications_lower
        )
        if has_masking_meds:
            factors.append("Pain medications (may mask symptoms)")
    
    # 3. Medical conditions context
    if data.has_medical_conditions is True and data.medical_conditions is not None and len(data.medical_conditions) > 0:
        conditions_lower = [cond.lower() for cond in data.medical_conditions]
        factors.append("Pre-existing medical conditions")
        
        # Heart disease + chest pain = higher risk
        if any("heart" in cond or "hjärt" in cond for cond in conditions_lower):
            if any(word in symptom_lower for word in ["chest pain", "chest discomfort", "pressure"]):
                risk_adjust += 0.15
                factors.append("Heart disease with chest pain")
        
        # Diabetes + symptoms = context
        if any("diabetes" in cond for cond in conditions_lower):
            factors.append("Diabetes")
        
        # COPD/Asthma + respiratory symptoms = higher risk
        if any(word in cond for word in ["asthma", "kol", "copd", "respiratory"] for cond in conditions_lower):
            if any(word in symptom_lower for word in ["shortness of breath", "difficulty breathing", "wheezing"]):
                risk_adjust += 0.15
                factors.append("Respiratory condition with breathing difficulty")
        
        # Cancer + new symptoms = context
        if any("cancer" in cond for cond in conditions_lower):
            factors.append("Cancer history")
    
    # 4. Trauma flag and interactions
    if data.is_trauma_related is True:
        risk_adjust += 0.1  # Base trauma risk
        factors.append("Recent trauma/injury")
        
        # Trauma + loss of consciousness = emergency (already checked in emergency indicators)
        if data.head_loss_consciousness and data.head_loss_consciousness.lower() in ["yes", "y"]:
            risk_adjust += 0.3
            factors.append("Trauma with loss of consciousness")
        
        # Trauma type considerations
        if hasattr(data, 'trauma_type') and data.trauma_type:
            trauma_type_lower = data.trauma_type.lower()
            if trauma_type_lower == "head":
                risk_adjust += 0.15
                factors.append("Head trauma")
            elif trauma_type_lower == "chest":
                risk_adjust += 0.2
                factors.append("Chest trauma")
            elif trauma_type_lower == "abdomen":
                risk_adjust += 0.15
                factors.append("Abdominal trauma")
            elif trauma_type_lower == "back":
                risk_adjust += 0.15
                factors.append("Back/spine trauma")
        
        # Trauma + blood thinners (already handled above, but add to factors)
        if data.medications is not None and len(data.medications) > 0:
            medications_lower = [med.lower() for med in data.medications] if isinstance(data.medications, list) else []
            blood_thinner_keywords = ["warfarin", "noak", "noac", "aspirin", "blood thinner", "blodförtunnande"]
            if any(any(keyword in med for keyword in blood_thinner_keywords) for med in medications_lower):
                factors.append("Trauma on blood thinners")
    
    return risk_adjust, factors


def calculate_data_quality(data) -> float:
    """
    Calculate data quality score (0.0-1.0) based on completeness.
    """
    required_fields = [
        ("symptom", 0.3),  # 30% weight - most important
        ("temperature", 0.15),
        ("heart_rate", 0.15),
        ("spo2", 0.15),
        ("blood_pressure", 0.1),
        ("respiratory_rate", 0.1),
        ("duration", 0.05)
    ]
    
    quality_score = 0.0
    
    for field, weight in required_fields:
        value = getattr(data, field, None)
        if value is not None and value != "":
            quality_score += weight
    
    return min(1.0, quality_score)


def calculate_confidence(
    risk_score: float,
    data_quality: float,
    key_factors: List[str],
    adaptive_questions_answered: bool = False
) -> float:
    """
    Calculate confidence score based on multiple factors.
    """
    base_confidence = 0.5  # Start at 50%
    
    # Data quality contribution (0-0.3)
    quality_contribution = data_quality * 0.3
    base_confidence += quality_contribution
    
    # Key factors contribution (0-0.15)
    # More factors = more confidence (up to 5 factors)
    factors_contribution = min(len(key_factors) / 5.0, 1.0) * 0.15
    base_confidence += factors_contribution
    
    # Adaptive questions contribution (0-0.05)
    if adaptive_questions_answered:
        base_confidence += 0.05
    
    # Risk score certainty (0-0.1)
    # Extreme risk scores (very low or very high) = more certain
    if risk_score < 0.2 or risk_score > 0.8:
        certainty_contribution = 0.1
    elif risk_score < 0.3 or risk_score > 0.7:
        certainty_contribution = 0.05
    else:
        certainty_contribution = 0.0
    base_confidence += certainty_contribution
    
    # Clamp between 0.5 and 0.95 (never 100% confident in medical triage)
    return max(0.5, min(0.95, base_confidence))


def generate_explanation_tags(
    risk_score: float,
    key_factors: List[str],
    vital_assessments: Dict,
    scenario_assessments: Dict
) -> List[Dict]:
    """
    Generate SHAP-style explanation tags showing key decision factors.
    """
    tags = []
    
    # Vital signs tags
    for vital, assessment in vital_assessments.items():
        if assessment.get("abnormal", False):
            tags.append({
                "factor": assessment.get("description", vital),
                "weight": assessment.get("risk_contribution", 0.1),
                "category": "vital_signs",
                "impact": "increased_risk" if assessment.get("risk_contribution", 0) > 0 else "decreased_risk"
            })
    
    # Scenario-specific tags
    for scenario, assessment in scenario_assessments.items():
        if assessment.get("risk_contribution", 0) > 0:
            tags.append({
                "factor": assessment.get("description", scenario),
                "weight": assessment.get("risk_contribution", 0.1),
                "category": "symptom_scenario",
                "impact": "increased_risk"
            })
    
    # Key factors tags
    for factor in key_factors:
        # Estimate weight based on factor importance
        weight = 0.15  # Default weight
        if "critical" in factor.lower() or "emergency" in factor.lower():
            weight = 0.3
        elif "severe" in factor.lower() or "high" in factor.lower():
            weight = 0.2
        
        tags.append({
            "factor": factor,
            "weight": weight,
            "category": "general",
            "impact": "increased_risk"
        })
    
    # Sort by weight (descending)
    tags.sort(key=lambda x: x["weight"], reverse=True)
    
    # Return top 5 factors
    return tags[:5]


def determine_triage_level(risk_score: float, key_factors: List[str]) -> Dict:
    """
    Determine triage level based on risk score and key factors.
    """
    # Emergency indicators (override risk score)
    emergency_indicators = [
        "Critical low oxygen",
        "Loss of consciousness",
        "Altered consciousness"
    ]
    
    if any(indicator in key_factors for indicator in emergency_indicators):
        return {
            "level": "emergency",
            "message": "High risk detected. Seek immediate medical attention.",
            "recommendations": [
                "Call emergency services (112) immediately",
                "Do not drive yourself to the hospital",
                "Have someone stay with you",
                "Prepare a list of medications and allergies"
            ],
            "safety_note": "This is a high-risk assessment. If you are experiencing chest pain, difficulty breathing, severe trauma, or loss of consciousness, call emergency services immediately."
        }
    
    # Standard risk-based triage
    if risk_score < 0.25:
        return {
            "level": "self_care",
            "message": "Your symptoms appear mild. Monitor at home and rest.",
            "recommendations": [
                "Rest and stay hydrated",
                "Monitor symptoms for 24-48 hours",
                "Use over-the-counter remedies if appropriate",
                "Contact healthcare if symptoms worsen"
            ],
            "safety_note": "If symptoms worsen or persist beyond 48 hours, contact your primary care provider."
        }
    elif risk_score < 0.5:
        return {
            "level": "primary_care",
            "message": "Non-urgent, but medical review recommended within 24-48 hours.",
            "recommendations": [
                "Schedule an appointment with your primary care provider",
                "Monitor symptoms closely",
                "Keep a symptom diary",
                "Seek care if symptoms worsen"
            ],
            "safety_note": "If symptoms worsen significantly, seek care sooner. Contact emergency services if you experience severe symptoms."
        }
    elif risk_score < 0.75:
        return {
            "level": "semi_emergency",
            "message": "Moderate concern. Seek medical care within hours.",
            "recommendations": [
                "Seek medical attention within 4-6 hours",
                "Consider visiting urgent care or emergency department",
                "Do not delay if symptoms worsen",
                "Have someone accompany you if possible"
            ],
            "safety_note": "If symptoms worsen rapidly or you experience severe pain, difficulty breathing, or confusion, call emergency services immediately."
        }
    else:
        return {
            "level": "emergency",
            "message": "High risk detected. Seek immediate medical attention.",
            "recommendations": [
                "Call emergency services (112) immediately",
                "Do not drive yourself to the hospital",
                "Have someone stay with you",
                "Prepare a list of medications and allergies"
            ],
            "safety_note": "This is a high-risk assessment. If you are experiencing chest pain, difficulty breathing, severe trauma, or loss of consciousness, call emergency services immediately."
        }


def analyze_health(data) -> dict:
    """
    Enhanced triage logic with proper medical scenario handling.
    """
    # 1. Check emergency overrides first
    emergency_result = check_emergency_indicators(data)
    if emergency_result:
        # Complete the emergency result with remaining fields
        risk_score = 0.9  # High risk for emergency
        data_quality = calculate_data_quality(data)
        confidence = calculate_confidence(risk_score, data_quality, emergency_result["key_factors"])
        
        triage_info = determine_triage_level(risk_score, emergency_result["key_factors"])
        
        return {
            **triage_info,
            "confidence": confidence,
            "key_factors": emergency_result["key_factors"],
            "explanation_tags": [{"factor": f, "weight": 0.3, "category": "emergency", "impact": "increased_risk"} for f in emergency_result["key_factors"]],
            "data_quality": data_quality,
            "low_confidence_warning": confidence < 0.7,
            "ai_enabled": False
        }
    
    # 2. Assess medical scenarios
    chest_risk, chest_factors = assess_chest_pain(data)
    dvt_risk, dvt_factors = assess_dvt_risk(data)
    breath_risk, breath_factors = assess_shortness_breath(data)
    head_risk, head_factors = assess_head_injury(data)
    
    # 3. Assess vital signs
    vital_risk, vital_factors = assess_vital_signs(data)
    
    # 4. Assess medical history
    medical_history_risk, medical_history_factors = assess_medical_history(data)
    
    # 5. Calculate comprehensive risk
    risk_score = 0.0
    risk_score += vital_risk
    risk_score += chest_risk
    risk_score += dvt_risk
    risk_score += breath_risk
    risk_score += head_risk
    risk_score += medical_history_risk
    
    # Clamp risk between 0 and 1
    risk_score = max(0.0, min(1.0, risk_score))
    
    # 6. Collect all key factors
    all_factors = []
    all_factors.extend(chest_factors)
    all_factors.extend(dvt_factors)
    all_factors.extend(breath_factors)
    all_factors.extend(head_factors)
    all_factors.extend(vital_factors)
    all_factors.extend(medical_history_factors)
    
    # Remove duplicates
    key_factors = list(set(all_factors))
    
    # 7. Calculate data quality and confidence
    data_quality = calculate_data_quality(data)
    
    # Check if adaptive questions were answered
    adaptive_answered = any([
        data.leg_redness, data.leg_warmth, data.leg_duration,
        data.head_dizziness, data.head_vomiting, data.head_loss_consciousness,
        data.chest_radiation, data.chest_shortness_breath, data.chest_nausea
    ])
    
    # Check if medical history was provided
    medical_history_provided = any([
        data.has_medical_conditions,
        data.has_medications,
        data.is_pregnant,
        data.is_trauma_related
    ])
    
    confidence = calculate_confidence(risk_score, data_quality, key_factors, adaptive_answered or medical_history_provided)
    
    # 8. Determine triage level
    triage_info = determine_triage_level(risk_score, key_factors)
    
    # 9. Apply low confidence fallback
    low_confidence_warning = False
    if confidence < 0.7:
        low_confidence_warning = True
        # Upgrade triage level conservatively
        if triage_info["level"] == "self_care":
            triage_info = determine_triage_level(0.3, key_factors)  # Force to primary_care
            triage_info["safety_note"] = "This assessment has lower confidence due to incomplete information. Please contact a healthcare provider for further assessment."
    
    # 10. Generate explanation tags
    vital_assessments = {
        "temperature": {"abnormal": data.temperature and (data.temperature < 36.0 or data.temperature > 38.5), "description": "Abnormal temperature", "risk_contribution": vital_risk * 0.2 if data.temperature else 0},
        "heart_rate": {"abnormal": data.heart_rate and (data.heart_rate < 50 or data.heart_rate > 120), "description": "Abnormal heart rate", "risk_contribution": vital_risk * 0.2 if data.heart_rate else 0},
        "spo2": {"abnormal": data.spo2 and data.spo2 < 95, "description": "Low oxygen saturation", "risk_contribution": vital_risk * 0.3 if data.spo2 else 0}
    }
    
    scenario_assessments = {
        "chest_pain": {"risk_contribution": chest_risk, "description": "Chest pain assessment"},
        "dvt": {"risk_contribution": dvt_risk, "description": "DVT risk assessment"},
        "sob": {"risk_contribution": breath_risk, "description": "Respiratory assessment"},
        "head_injury": {"risk_contribution": head_risk, "description": "Head injury assessment"}
    }
    
    explanation_tags = generate_explanation_tags(risk_score, key_factors, vital_assessments, scenario_assessments)
    
    # 11. Return complete result
    return {
        **triage_info,
        "confidence": round(confidence, 2),
        "key_factors": key_factors,
        "explanation_tags": explanation_tags,
        "data_quality": round(data_quality, 2),
        "low_confidence_warning": low_confidence_warning,
        "ai_enabled": False
    }

