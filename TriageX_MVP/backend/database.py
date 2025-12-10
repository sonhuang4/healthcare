"""
Supabase-backed data access layer for the TriageX admin panel.
"""
import json
import logging
import os
from collections import Counter
from datetime import datetime
from statistics import mean
from typing import Any, Dict, List, Optional

Client = Any  # Supabase client type (set dynamically at runtime)

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv(
    "SUPABASE_SECRET_KEY"
)
ASSESSMENTS_TABLE = os.getenv("SUPABASE_ASSESSMENTS_TABLE", "assessments")

_supabase_client: Optional[Client] = None
_supabase_create_client = None


class SupabaseNotConfigured(RuntimeError):
    """Raised when Supabase credentials are missing."""


def _ensure_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise SupabaseNotConfigured(
                "Supabase credentials are missing. "
                "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
            )
        _supabase_client = _create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_client


def _create_client(url: str, key: str) -> Client:
    global _supabase_create_client
    if _supabase_create_client is None:
        try:
            from supabase import create_client as supabase_create_client  # type: ignore
        except ImportError as exc:  # pragma: no cover
            raise RuntimeError(
                "supabase-py is not installed. Install dependencies from backend/requirements.txt."
            ) from exc
        _supabase_create_client = supabase_create_client
    return _supabase_create_client(url, key)


def init_database():
    """
    Validate Supabase connectivity. (Table creation is expected to be done via Supabase.)
    """
    try:
        client = _ensure_client()
        response = (
            client.table(ASSESSMENTS_TABLE)
            .select("id")
            .limit(1)
            .execute()
        )
        # New supabase-py version doesn't have response.error, check data instead
        if hasattr(response, 'error') and response.error:
            raise RuntimeError(response.error.message)
        logger.info("Connected to Supabase table '%s'", ASSESSMENTS_TABLE)
    except SupabaseNotConfigured as exc:
        logger.error(str(exc))
        raise
    except Exception as exc:
        logger.error("Failed to verify Supabase connection: %s", exc)
        raise


def _serialize_recommendations(triage_result: Dict[str, Any]) -> str:
    return json.dumps(triage_result.get("recommendations", []))


def _serialize_list(data: List[Any]) -> str:
    """Serialize list to JSON string"""
    return json.dumps(data if data else [])


def _serialize_explanation_tags(tags: List[Dict[str, Any]]) -> str:
    """Serialize explanation tags to JSON string"""
    return json.dumps(tags if tags else [])


def log_assessment(
    form_data: Dict[str, Any],
    triage_result: Dict[str, Any],
) -> int:
    client = _ensure_client()
    payload = {
        "timestamp": datetime.now().isoformat(),
        "age": form_data.get("age"),
        "gender": form_data.get("gender"),
        "symptom": form_data.get("symptom"),
        "temperature": form_data.get("temperature"),
        "heart_rate": form_data.get("heart_rate"),
        "respiratory_rate": form_data.get("respiratory_rate"),
        "blood_pressure": form_data.get("blood_pressure"),
        "spo2": form_data.get("spo2"),
        "level_of_consciousness": form_data.get("level_of_consciousness"),
        "duration": form_data.get("duration"),
        "onset": form_data.get("onset"),
        "pain_level": form_data.get("pain_level"),
        "leg_redness": form_data.get("leg_redness"),
        "leg_warmth": form_data.get("leg_warmth"),
        "leg_duration": form_data.get("leg_duration"),
        "head_dizziness": form_data.get("head_dizziness"),
        "head_vomiting": form_data.get("head_vomiting"),
        "head_loss_consciousness": form_data.get("head_loss_consciousness"),
        "chest_radiation": form_data.get("chest_radiation"),
        "chest_shortness_breath": form_data.get("chest_shortness_breath"),
        "chest_nausea": form_data.get("chest_nausea"),
        "triage_level": triage_result.get("level"),
        "confidence": triage_result.get("confidence"),
        "recommendations": _serialize_recommendations(triage_result),
        # New enhanced fields
        "key_factors": _serialize_list(triage_result.get("key_factors", [])),
        "explanation_tags": _serialize_explanation_tags(triage_result.get("explanation_tags", [])),
        "data_quality": triage_result.get("data_quality", 0.0),
        "low_confidence_warning": triage_result.get("low_confidence_warning", False),
        "ai_enabled": triage_result.get("ai_enabled", False),
        "ai_model_type": triage_result.get("ai_model_type"),
    }

    response = client.table(ASSESSMENTS_TABLE).insert(payload).execute()
    if hasattr(response, 'error') and response.error:
        raise RuntimeError(f"Failed to log assessment: {response.error.message}")

    record = response.data[0]
    logger.info("Assessment logged in Supabase with ID: %s", record.get("id"))
    return record.get("id")


def get_assessments(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    triage_level: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> List[Dict[str, Any]]:
    client = _ensure_client()
    query = (
        client.table(ASSESSMENTS_TABLE)
        .select("*")
        .order("timestamp", desc=True)
    )

    if start_date:
        query = query.gte("timestamp", start_date)
    if end_date:
        query = query.lte("timestamp", end_date)
    if triage_level:
        query = query.eq("triage_level", triage_level)

    start = max(offset, 0)
    end = start + max(limit, 1) - 1
    query = query.range(start, end)

    response = query.execute()
    if hasattr(response, 'error') and response.error:
        raise RuntimeError(f"Failed to fetch assessments: {response.error.message}")

    assessments: List[Dict[str, Any]] = []
    for row in response.data or []:
        record = dict(row)
        # Parse JSON fields
        recommendations = record.get("recommendations")
        if isinstance(recommendations, str):
            try:
                record["recommendations"] = json.loads(recommendations)
            except json.JSONDecodeError:
                record["recommendations"] = []
        
        key_factors = record.get("key_factors")
        if isinstance(key_factors, str):
            try:
                record["key_factors"] = json.loads(key_factors)
            except json.JSONDecodeError:
                record["key_factors"] = []
        
        explanation_tags = record.get("explanation_tags")
        if isinstance(explanation_tags, str):
            try:
                record["explanation_tags"] = json.loads(explanation_tags)
            except json.JSONDecodeError:
                record["explanation_tags"] = []
        
        assessments.append(record)

    return assessments


def get_analytics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
) -> Dict[str, Any]:
    client = _ensure_client()
    query = (
        client.table(ASSESSMENTS_TABLE)
        .select("triage_level,symptom,age,confidence")
        .order("timestamp", desc=True)
    ).limit(1000)

    if start_date:
        query = query.gte("timestamp", start_date)
    if end_date:
        query = query.lte("timestamp", end_date)

    response = query.execute()
    if hasattr(response, 'error') and response.error:
        raise RuntimeError(f"Failed to fetch analytics: {response.error.message}")

    rows = response.data or []

    total = len(rows)
    level_counts = Counter(row.get("triage_level") for row in rows)

    symptoms_counter = Counter()
    for row in rows:
        symptom = (row.get("symptom") or "").strip()
        if symptom:
            symptoms_counter[symptom] += 1

    numeric_ages = []
    for row in rows:
        age = row.get("age")
        try:
            numeric_ages.append(float(age))
        except (TypeError, ValueError):
            continue

    confidences = [
        row.get("confidence")
        for row in rows
        if isinstance(row.get("confidence"), (int, float))
    ]

    return {
        "total_assessments": total,
        "count_by_level": {
            "self_care": level_counts.get("self_care", 0),
            "primary_care": level_counts.get("primary_care", 0),
            "semi_emergency": level_counts.get("semi_emergency", 0),
            "emergency": level_counts.get("emergency", 0),
        },
        "top_symptoms": [
            {"symptom": symptom, "count": count}
            for symptom, count in symptoms_counter.most_common(10)
        ],
        "average_age": round(mean(numeric_ages), 1) if numeric_ages else None,
        "average_confidence": round(mean(confidences), 2) if confidences else None,
    }


