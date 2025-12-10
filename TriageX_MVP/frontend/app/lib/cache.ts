// Frontend caching utilities for API responses

const CACHE_PREFIX = "triagex_cache_";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
    data: any;
    timestamp: number;
}

/**
 * Generate a cache key from payload data
 */
export function generateCacheKey(payload: Record<string, any>): string {
    // Normalize payload by sorting keys and removing null/undefined
    const normalized = Object.keys(payload)
        .sort()
        .reduce((acc, key) => {
            const value = payload[key];
            if (value !== null && value !== undefined && value !== "") {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, any>);

    // Create a simple hash (for browser compatibility)
    const str = JSON.stringify(normalized);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `${CACHE_PREFIX}${Math.abs(hash).toString(36)}`;
}

/**
 * Get cached data if it exists and hasn't expired
 */
export function getCached(key: string): any | null {
    if (typeof window === "undefined") return null;

    try {
        const cached = sessionStorage.getItem(key);
        if (!cached) return null;

        const entry: CacheEntry = JSON.parse(cached);
        const now = Date.now();

        // Check if cache has expired
        if (now - entry.timestamp > CACHE_TTL_MS) {
            sessionStorage.removeItem(key);
            return null;
        }

        return entry.data;
    } catch (error) {
        console.warn("Error reading cache:", error);
        return null;
    }
}

/**
 * Store data in cache
 */
export function setCached(key: string, data: any): void {
    if (typeof window === "undefined") return;

    try {
        const entry: CacheEntry = {
            data,
            timestamp: Date.now(),
        };
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
        // Handle quota exceeded errors gracefully
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
            console.warn("Cache storage quota exceeded, clearing old entries");
            clearExpiredCache();
            // Try once more
            try {
                sessionStorage.setItem(key, JSON.stringify(entry));
            } catch (retryError) {
                console.warn("Failed to cache after cleanup:", retryError);
            }
        } else {
            console.warn("Error setting cache:", error);
        }
    }
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache(): void {
    if (typeof window === "undefined") return;

    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(CACHE_PREFIX)) {
            try {
                const cached = sessionStorage.getItem(key);
                if (cached) {
                    const entry: CacheEntry = JSON.parse(cached);
                    if (now - entry.timestamp > CACHE_TTL_MS) {
                        keysToRemove.push(key);
                    }
                }
            } catch (error) {
                // Invalid cache entry, remove it
                if (key) keysToRemove.push(key);
            }
        }
    }

    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
    if (typeof window === "undefined") return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

