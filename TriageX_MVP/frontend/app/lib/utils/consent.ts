// Consent management utility

const CONSENT_KEY = "triagex-consent";
const CONSENT_TIMESTAMP_KEY = "triagex-consent-timestamp";

/**
 * Check if user has given consent
 */
export const hasConsent = (): boolean => {
    if (typeof window === "undefined") return false;

    const consent = localStorage.getItem(CONSENT_KEY);
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);

    if (!consent || consent !== "true") return false;

    // Optional: Check if consent is still valid (e.g., within 30 days)
    if (timestamp) {
        const consentDate = new Date(parseInt(timestamp));
        const now = new Date();
        const daysSinceConsent = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);

        // Consent expires after 30 days
        if (daysSinceConsent > 30) {
            clearConsent();
            return false;
        }
    }

    return true;
};

/**
 * Save consent to localStorage
 */
export const saveConsent = (): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, Date.now().toString());
};

/**
 * Clear consent from localStorage
 */
export const clearConsent = (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
};

/**
 * Handle navigation to input page with consent check
 * Returns true if navigation should proceed, false if consent is missing
 * If consent is missing, the input page will show the consent modal
 */
export const handleStartAssessment = (
    router: any,
    homeRoute: string = "/"
): boolean => {
    if (hasConsent()) {
        router.push("/input");
        return true;
    } else {
        // Navigate to input page, which will show the consent modal
        router.push("/input");
        return false;
    }
};

