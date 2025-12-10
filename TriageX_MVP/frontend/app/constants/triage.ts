// Triage level configurations

import { TriageConfig } from "../types/triage.types";

export const TRIAGE_LEVELS: Record<
    "self_care" | "primary_care" | "semi_emergency" | "emergency",
    TriageConfig
> = {
    self_care: {
        icon: "🟢",
        color: "triage-selfCare",
        bgColor: "bg-triageCard-selfCare",
        borderColor: "border-triageCard-border",
        textColor: "text-green-800",
        title: "Self-Care",
        description: "Mild symptoms, safe to monitor at home.",
    },
    primary_care: {
        icon: "🟡",
        color: "triage-primaryCare",
        bgColor: "bg-triageCard-primaryCare",
        borderColor: "border-triageCard-border",
        textColor: "text-yellow-800",
        title: "Primary Care",
        description: "Non-urgent, see a doctor if symptoms persist.",
    },
    semi_emergency: {
        icon: "🟠",
        color: "triage-semiEmergency",
        bgColor: "bg-triageCard-semiEmergency",
        borderColor: "border-triageCard-border",
        textColor: "text-orange-800",
        title: "Semi-Emergency",
        description: "Possible risk – seek care within hours.",
    },
    emergency: {
        icon: "🔴",
        color: "triage-emergency",
        bgColor: "bg-triageCard-emergency",
        borderColor: "border-triageCard-border",
        textColor: "text-red-800",
        title: "Emergency",
        description: "Critical – seek medical attention immediately.",
    },
};

