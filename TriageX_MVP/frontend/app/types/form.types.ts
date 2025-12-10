// Form-related types

export interface FormData {
    age: string;
    gender: string;
    symptom: string;
    temperature: string;
    heart_rate: string;
    spo2: string;
    blood_pressure: string;
    duration: string;
    respiratory_rate: string;
    level_of_consciousness: string;
    onset: string;
    pain_level: string;
    // Adaptive questions - Swollen Leg (DVT)
    leg_redness: string;
    leg_warmth: string;
    leg_duration: string;
    // Adaptive questions - Head Injury
    head_dizziness: string;
    head_vomiting: string;
    head_loss_consciousness: string;
    // Adaptive questions - Chest Pain
    chest_radiation: string;
    chest_shortness_breath: string;
    chest_nausea: string;
    // Medical history
    has_medical_conditions: string;
    medical_conditions: string[];
    medical_conditions_other: string;
    has_medications: string;
    medications: string[];
    medications_other: string;
    is_pregnant: string | null;
    pregnancy_trimester: string | null;
    pregnancy_weeks: string | null;
    is_trauma_related: string;
    trauma_type: string;
    trauma_description: string;
}

export interface MedicalHistoryData {
    has_medical_conditions: string;
    medical_conditions: string[];
    medical_conditions_other: string;
    has_medications: string;
    medications: string[];
    medications_other: string;
    is_pregnant: string | null;
    pregnancy_trimester: string | null;
    pregnancy_weeks: string | null;
    is_trauma_related: string;
    trauma_type: string;
    trauma_description: string;
}

export interface ContactFormData {
    fullName: string;
    workEmail: string;
    organization: string;
    primaryTopic: string;
    message: string;
}

export interface FormErrors {
    [key: string]: string;
}

