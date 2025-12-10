// Validation rules and constants

export const VALIDATION_RULES = {
    temperature: {
        min: 35,
        max: 45,
        error: "Temperature must be between 35-45°C",
    },
    heart_rate: {
        min: 30,
        max: 220,
        error: "Heart rate must be between 30-220 bpm",
    },
    spo2: {
        min: 70,
        max: 100,
        error: "SpO₂ must be between 70-100%",
    },
    blood_pressure: {
        pattern: /^\d{2,3}\/\d{2,3}$/,
        error: "Blood pressure must be in format: systolic/diastolic (e.g., 120/80)",
    },
} as const;

