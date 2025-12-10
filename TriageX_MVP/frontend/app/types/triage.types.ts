// Triage-related types

export type TriageLevel =
    | "self_care"
    | "primary_care"
    | "semi_emergency"
    | "emergency";

export interface ExplanationTag {
    factor: string;
    weight: number;
    category: string;
    impact: string;
}

export interface TriageResult {
    level: TriageLevel;
    confidence: number;
    message: string;
    recommendations: string[];
    safety_note: string;
    key_factors?: string[];
    explanation_tags?: ExplanationTag[];
    data_quality?: number;
    low_confidence_warning?: boolean;
    ai_enabled?: boolean;
}

export interface TriageConfig {
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    title: string;
    description: string;
}

