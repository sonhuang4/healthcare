"""Simple in-memory cache for API responses."""
import hashlib
import json
import time
from typing import Any, Dict, Optional
from datetime import datetime, timedelta

# In-memory cache with TTL
_cache: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 3600  # 1 hour cache


def generate_cache_key(data: Dict[str, Any]) -> str:
    """Generate a cache key from input data."""
    # Normalize the data by sorting keys and removing None values
    normalized = {
        k: v for k, v in sorted(data.items()) 
        if v is not None and k not in ['timestamp', 'created_at']
    }
    # Create a hash of the normalized data
    cache_string = json.dumps(normalized, sort_keys=True, default=str)
    return hashlib.md5(cache_string.encode()).hexdigest()


def get_cached(key: str) -> Optional[Dict[str, Any]]:
    """Get cached result if it exists and hasn't expired."""
    if key not in _cache:
        return None
    
    cached_item = _cache[key]
    expires_at = cached_item.get('expires_at')
    
    # Check if cache has expired
    if expires_at and datetime.now() > expires_at:
        del _cache[key]
        return None
    
    return cached_item.get('data')


def set_cached(key: str, data: Dict[str, Any], ttl: int = CACHE_TTL_SECONDS) -> None:
    """Store data in cache with TTL."""
    expires_at = datetime.now() + timedelta(seconds=ttl)
    _cache[key] = {
        'data': data,
        'expires_at': expires_at,
        'created_at': datetime.now()
    }
    
    # Clean up expired entries periodically (simple cleanup)
    if len(_cache) > 1000:  # Prevent memory bloat
        _cleanup_expired()


def _cleanup_expired() -> None:
    """Remove expired cache entries."""
    now = datetime.now()
    expired_keys = [
        key for key, value in _cache.items()
        if value.get('expires_at') and now > value['expires_at']
    ]
    for key in expired_keys:
        del _cache[key]


def clear_cache() -> None:
    """Clear all cache entries (useful for testing)."""
    _cache.clear()


def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics."""
    _cleanup_expired()
    return {
        'size': len(_cache),
        'max_size': 1000,
        'ttl_seconds': CACHE_TTL_SECONDS
    }

