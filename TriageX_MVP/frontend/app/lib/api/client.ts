// API client configuration

const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const API_ENDPOINTS = {
    ANALYZE: `${API_BASE_URL}/api/v1/analyze`,
    CONSENT: `${API_BASE_URL}/api/v1/consent`,
    INFO: (infoType: string) => `${API_BASE_URL}/api/v1/info/${infoType}`,
    // Adaptive questions
    ADAPTIVE_QUESTIONS: (symptom: string) => `${API_BASE_URL}/api/v1/questions/adaptive?symptom=${encodeURIComponent(symptom)}`,
    // Explanation
    EXPLAIN: (assessmentId: number) => `${API_BASE_URL}/api/v1/explain/${assessmentId}`,
    // AI status
    AI_STATUS: `${API_BASE_URL}/api/v1/ai/status`,
    // Admin endpoints
    ADMIN_ASSESSMENTS: `${API_BASE_URL}/api/v1/admin/assessments`,
    ADMIN_ANALYTICS: `${API_BASE_URL}/api/v1/admin/analytics`,
} as const;

export default API_ENDPOINTS;

