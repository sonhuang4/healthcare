"""
Entry point for running the application.
This file is kept for backward compatibility and runs the app from app.main.
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
