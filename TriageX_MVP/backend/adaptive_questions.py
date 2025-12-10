"""
Adaptive questioning system for dynamic follow-up questions.
"""
from typing import Dict, List
from enum import Enum


class QuestionType(Enum):
    DVT = "dvt"
    HEAD_INJURY = "head_injury"
    CHEST_PAIN = "chest_pain"
    RESPIRATORY = "respiratory"
    GENERAL = "general"


def identify_required_questions(symptom: str) -> List[QuestionType]:
    """
    Identify which adaptive questions are needed based on symptom.
    """
    symptom_lower = symptom.lower()
    required = []
    
    # DVT questions
    if any(word in symptom_lower for word in ["swollen leg", "leg swelling", "dvt", "swollen", "leg"]):
        required.append(QuestionType.DVT)
    
    # Head injury questions
    if any(word in symptom_lower for word in ["head injury", "head trauma", "hit head", "concussion", "head"]):
        required.append(QuestionType.HEAD_INJURY)
    
    # Chest pain questions
    if any(word in symptom_lower for word in ["chest pain", "chest discomfort", "pressure", "chest"]):
        required.append(QuestionType.CHEST_PAIN)
    
    # Respiratory questions
    if any(word in symptom_lower for word in ["shortness of breath", "difficulty breathing", "can't breathe", "dyspnea", "sob", "breathing"]):
        required.append(QuestionType.RESPIRATORY)
    
    return required


def get_question_config(question_type: QuestionType) -> Dict:
    """
    Get configuration for adaptive questions.
    """
    configs = {
        QuestionType.DVT: {
            "questions": [
                {
                    "field": "leg_redness",
                    "label": "Is the leg red or discolored?",
                    "type": "yes_no"
                },
                {
                    "field": "leg_warmth",
                    "label": "Is the leg warm to touch?",
                    "type": "yes_no"
                },
                {
                    "field": "leg_duration",
                    "label": "How long has the swelling been present?",
                    "type": "text"
                }
            ]
        },
        QuestionType.HEAD_INJURY: {
            "questions": [
                {
                    "field": "head_dizziness",
                    "label": "Are you experiencing dizziness?",
                    "type": "yes_no"
                },
                {
                    "field": "head_vomiting",
                    "label": "Have you vomited?",
                    "type": "yes_no"
                },
                {
                    "field": "head_loss_consciousness",
                    "label": "Did you lose consciousness?",
                    "type": "yes_no"
                }
            ]
        },
        QuestionType.CHEST_PAIN: {
            "questions": [
                {
                    "field": "chest_radiation",
                    "label": "Does the pain radiate to your arm, jaw, or back?",
                    "type": "yes_no"
                },
                {
                    "field": "chest_shortness_breath",
                    "label": "Are you experiencing shortness of breath?",
                    "type": "yes_no"
                },
                {
                    "field": "chest_nausea",
                    "label": "Are you experiencing nausea?",
                    "type": "yes_no"
                }
            ]
        },
        QuestionType.RESPIRATORY: {
            "questions": [
                {
                    "field": "respiratory_rate",
                    "label": "What is your respiratory rate (breaths per minute)?",
                    "type": "number"
                },
                {
                    "field": "spo2",
                    "label": "What is your oxygen saturation (SpO2)?",
                    "type": "number"
                }
            ]
        }
    }
    
    return configs.get(question_type, {})

