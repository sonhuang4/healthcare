"""Consent request and response schemas."""
from pydantic import BaseModel, Field


class ConsentData(BaseModel):
    """Request schema for consent tracking."""
    consent: bool = Field(..., description="User consent for data processing")
    locale: str = Field("EN", description="User locale (EN or SV)")


class ConsentResponse(BaseModel):
    """Response schema for consent."""
    status: str = Field(..., description="Consent status")
    message: str = Field(..., description="Response message")

