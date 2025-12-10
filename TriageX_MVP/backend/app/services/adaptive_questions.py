"""
Adaptive questioning system for dynamic follow-up questions.
"""
from typing import Dict, List, Any


def identify_required_questions(symptom: str) -> List[str]:
    """
    Identify which adaptive questions are needed based on symptom.
    Returns list of question type strings.
    """
    symptom_lower = symptom.lower()
    required = []
    
    # DVT questions
    if any(word in symptom_lower for word in ["swollen leg", "leg swelling", "dvt", "swollen"]):
        required.append("dvt_questions")
    
    # Head injury questions
    if any(word in symptom_lower for word in ["head injury", "head trauma", "hit head", "concussion"]):
        required.append("head_injury_questions")
    
    # Chest pain questions
    if any(word in symptom_lower for word in ["chest pain", "chest discomfort", "pressure"]):
        required.append("chest_pain_questions")
    
    # Respiratory questions
    if any(word in symptom_lower for word in ["shortness of breath", "difficulty breathing", "can't breathe", "dyspnea", "sob"]):
        required.append("respiratory_questions")
    
    return required


def get_question_config(question_type: str) -> Dict[str, Any]:
    """
    Get configuration for adaptive questions.
    """
    configs = {
        "dvt_questions": {
            "title": "Swollen Leg Details",
            "description": "Please provide more details about your swollen leg.",
            "questions": [
                {"field": "leg_redness", "label": "Is there redness?", "type": "radio", "options": ["Yes", "No"]},
                {"field": "leg_warmth", "label": "Is the leg warm to touch?", "type": "radio", "options": ["Yes", "No"]},
                {"field": "leg_duration", "label": "How long has the leg been swollen?", "type": "text"}
            ]
        },
        "head_injury_questions": {
            "title": "Head Injury Details",
            "description": "Please provide more details about your head injury.",
            "questions": [
                {"field": "head_dizziness", "label": "Are you experiencing dizziness?", "type": "radio", "options": ["Yes", "No"]},
                {"field": "head_vomiting", "label": "Have you vomited?", "type": "radio", "options": ["Yes", "No"]},
                {"field": "head_loss_consciousness", "label": "Did you lose consciousness?", "type": "radio", "options": ["Yes", "No"]}
            ]
        },
        "chest_pain_questions": {
            "title": "Chest Pain Details",
            "description": "Please provide more details about your chest pain.",
            "questions": [
                {"field": "chest_radiation", "label": "Does the pain radiate to your arm, jaw, or back?", "type": "radio", "options": ["Yes", "No"]},
                {"field": "chest_shortness_breath", "label": "Are you experiencing shortness of breath?", "type": "radio", "options": ["Yes", "No"]},
                {"field": "chest_nausea", "label": "Are you feeling nauseous?", "type": "radio", "options": ["Yes", "No"]}
            ]
        },
        "respiratory_questions": {
            "title": "Respiratory Symptoms",
            "description": "Please provide more details about your breathing difficulties.",
            "questions": [
                {"field": "respiratory_duration", "label": "How long have you had shortness of breath?", "type": "text"},
                {"field": "respiratory_triggers", "label": "What triggers or worsens your shortness of breath?", "type": "text"},
                {"field": "respiratory_associated_symptoms", "label": "Any other associated symptoms (e.g., cough, wheezing)?", "type": "text"}
            ]
        }
    }
    
    return configs.get(question_type, {"questions": []})
