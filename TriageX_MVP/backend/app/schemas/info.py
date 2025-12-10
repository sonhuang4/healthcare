"""Information response schemas."""
from pydantic import BaseModel, Field
from typing import Optional


class InfoResponse(BaseModel):
    """Response schema for information endpoints."""
    title: str = Field(..., description="Info title")
    description: str = Field(..., description="Info description")
    video_url: Optional[str] = Field(None, description="Optional video URL")

