"""
Application configuration and settings.
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""
    
    # API Settings
    API_TITLE: str = "Health Risk Analyzer API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "TriageX Health Risk Assessment API"
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    @property
    def cors_origins(self) -> List[str]:
        """Get CORS origins including frontend URL from environment."""
        origins = self.CORS_ORIGINS.copy()
        frontend_url = os.getenv("FRONTEND_URL", "")
        if frontend_url:
            origins.append(frontend_url)
            # Also add without trailing slash
            origins.append(frontend_url.rstrip("/"))
        return origins
    
    # Supabase Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_ASSESSMENTS_TABLE: str = os.getenv("SUPABASE_ASSESSMENTS_TABLE", "assessments")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Server Settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    RELOAD: bool = os.getenv("RELOAD", "true").lower() == "true"
    
    @property
    def is_supabase_configured(self) -> bool:
        """Check if Supabase credentials are configured."""
        return bool(self.SUPABASE_URL and self.SUPABASE_SERVICE_ROLE_KEY)


# Global settings instance
settings = Settings()

