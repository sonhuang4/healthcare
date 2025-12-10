"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import { FormData, FormErrors } from "../../types";
import { ROUTES, VALIDATION_RULES } from "../../constants";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import PainSlider from "../../components/ui/PainSlider";
import { hasConsent } from "../../lib/utils/consent";
import ConsentModal from "../../components/ConsentModal";
import VitalConfirmationModal from "../../components/VitalConfirmationModal";
import MedicalHistoryModal from "../../components/MedicalHistoryModal";
import Toast from "../../components/ui/Toast";

type Step = 1 | 2 | 3 | 4;

export default function InputForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "",
    symptom: "",
    temperature: "",
    heart_rate: "",
    spo2: "",
    blood_pressure: "",
    duration: "",
    respiratory_rate: "",
    level_of_consciousness: "",
    onset: "",
    pain_level: "",
    // Adaptive questions
    leg_redness: "",
    leg_warmth: "",
    leg_duration: "",
    head_dizziness: "",
    head_vomiting: "",
    head_loss_consciousness: "",
    chest_radiation: "",
    chest_shortness_breath: "",
    chest_nausea: "",
    // Medical history
    has_medical_conditions: "no",
    medical_conditions: [],
    medical_conditions_other: "",
    has_medications: "no",
    medications: [],
    medications_other: "",
    is_pregnant: null,
    pregnancy_trimester: null,
    pregnancy_weeks: null,
    is_trauma_related: "no",
    trauma_type: "",
    trauma_description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
    {}
  );
  const [showVitalConfirmation, setShowVitalConfirmation] = useState(false);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [pendingVital, setPendingVital] = useState<{
    name: string;
    field: string;
    value: string;
    unit: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });
  const router = useRouter();
  const tInput = useTranslations("input");

  const stepLabelKeys = ["age", "gender", "symptoms", "vitals"] as const;
  const stepLabels = stepLabelKeys.map((key) =>
    tInput(`progress.labels.${key}` as any)
  );

  const genderOptions = [
    { value: "Male", label: tInput("steps.gender.options.male") },
    { value: "Female", label: tInput("steps.gender.options.female") },
  ];

  const quickSelectSymptoms = [
    { value: "Headache", label: tInput("steps.symptoms.quickSelect.headache") },
    { value: "Fever", label: tInput("steps.symptoms.quickSelect.fever") },
    {
      value: "Chest Pain",
      label: tInput("steps.symptoms.quickSelect.chestPain"),
    },
    {
      value: "Swollen Leg",
      label: tInput("steps.symptoms.quickSelect.swollenLeg"),
    },
    {
      value: "Shortness of Breath",
      label: tInput("steps.symptoms.quickSelect.shortnessBreath"),
    },
    {
      value: "Dizziness",
      label: tInput("steps.symptoms.quickSelect.dizziness"),
    },
  ];

  const yesNoOptions = [
    { value: "Yes", label: tInput("options.yes") },
    { value: "No", label: tInput("options.no") },
    { value: "Not sure", label: tInput("options.notSure") },
  ];

  const consciousnessOptions = [
    {
      value: "Alert",
      label: tInput("steps.vitals.fields.consciousness.options.alert"),
    },
    {
      value: "Verbal",
      label: tInput("steps.vitals.fields.consciousness.options.verbal"),
    },
    {
      value: "Pain",
      label: tInput("steps.vitals.fields.consciousness.options.pain"),
    },
    {
      value: "Unresponsive",
      label: tInput("steps.vitals.fields.consciousness.options.unresponsive"),
    },
  ];

  const onsetOptions = [
    {
      value: "Sudden",
      label: tInput("steps.vitals.fields.onset.options.sudden"),
    },
    {
      value: "Gradual",
      label: tInput("steps.vitals.fields.onset.options.gradual"),
    },
    {
      value: "Fluctuating",
      label: tInput("steps.vitals.fields.onset.options.fluctuating"),
    },
  ];

  // Check consent on mount and scroll to top
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: "instant" });

    if (typeof window !== "undefined" && !hasConsent()) {
      setShowConsentModal(true);
    }
  }, []);

  useEffect(() => {
    // Calculate progress based on current step (4 steps total = 25% per step)
    const stepProgress = (currentStep / 4) * 100;
    setProgress(stepProgress);
  }, [currentStep]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.age.trim()) {
        newErrors.age = tInput("validation.ageRequired");
      } else {
        const ageNum = parseInt(formData.age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
          newErrors.age = tInput("validation.ageInvalid");
        }
      }
    }

    if (step === 2) {
      if (!formData.gender.trim()) {
        newErrors.gender = tInput("validation.genderRequired");
      }
    }

    if (step === 3) {
      if (!formData.symptom.trim()) {
        newErrors.symptom = tInput("validation.symptomRequired");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.age.trim()) {
      newErrors.age = tInput("validation.ageRequired");
    }
    if (!formData.gender.trim()) {
      newErrors.gender = tInput("validation.genderRequired");
    }
    if (!formData.symptom.trim()) {
      newErrors.symptom = tInput("validation.symptomRequired");
    }

    if (
      formData.temperature &&
      (parseFloat(formData.temperature) < VALIDATION_RULES.temperature.min ||
        parseFloat(formData.temperature) > VALIDATION_RULES.temperature.max)
    ) {
      newErrors.temperature = tInput("validation.temperatureRange", {
        min: VALIDATION_RULES.temperature.min,
        max: VALIDATION_RULES.temperature.max,
      });
    }

    if (
      formData.heart_rate &&
      (parseInt(formData.heart_rate) < VALIDATION_RULES.heart_rate.min ||
        parseInt(formData.heart_rate) > VALIDATION_RULES.heart_rate.max)
    ) {
      newErrors.heart_rate = tInput("validation.heartRateRange", {
        min: VALIDATION_RULES.heart_rate.min,
        max: VALIDATION_RULES.heart_rate.max,
      });
    }

    if (
      formData.spo2 &&
      (parseInt(formData.spo2) < VALIDATION_RULES.spo2.min ||
        parseInt(formData.spo2) > VALIDATION_RULES.spo2.max)
    ) {
      newErrors.spo2 = tInput("validation.spo2Range", {
        min: VALIDATION_RULES.spo2.min,
        max: VALIDATION_RULES.spo2.max,
      });
    }

    if (formData.blood_pressure) {
      if (
        !VALIDATION_RULES.blood_pressure.pattern.test(formData.blood_pressure)
      ) {
        newErrors.blood_pressure = tInput("validation.bloodPressureFormat");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!formData.symptom.trim();
  };

  const validateField = (name: string, value: string): boolean | null => {
    // Return null if field is empty (no validation state yet)
    if (!value || value.trim() === "") {
      return null;
    }

    switch (name) {
      case "age":
        const ageNum = parseInt(value);
        return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
      case "gender":
        return value.trim() !== "";
      case "symptom":
        return value.trim().length >= 3;
      case "temperature":
        const temp = parseFloat(value);
        return !isNaN(temp) && temp >= 30 && temp <= 45;
      case "heart_rate":
        const hr = parseInt(value);
        return !isNaN(hr) && hr >= 30 && hr <= 220;
      case "spo2":
        const spo2 = parseInt(value);
        return !isNaN(spo2) && spo2 >= 70 && spo2 <= 100;
      case "blood_pressure":
        return /^\d{2,3}\/\d{2,3}$/.test(value);
      case "respiratory_rate":
        const rr = parseInt(value);
        return !isNaN(rr) && rr >= 8 && rr <= 40;
      case "level_of_consciousness":
        return value.trim() !== "";
      case "onset":
        return value.trim() !== "";
      case "pain_level":
        const pain = parseInt(value);
        return !isNaN(pain) && pain >= 0 && pain <= 10;
      default:
        return true;
    }
  };

  // Map vital field names to display names and units
  const getVitalInfo = (
    fieldName: string
  ): { name: string; unit: string } | null => {
    const vitalMap: Record<string, { name: string; unit: string }> = {
      temperature: { name: tInput("vitalNames.temperature"), unit: "�C" },
      heart_rate: { name: tInput("vitalNames.heart_rate"), unit: "bpm" },
      spo2: { name: tInput("vitalNames.spo2"), unit: "%" },
      blood_pressure: {
        name: tInput("vitalNames.blood_pressure"),
        unit: "mmHg",
      },
      respiratory_rate: {
        name: tInput("vitalNames.respiratory_rate"),
        unit: "breaths/min",
      },
      pain_level: { name: tInput("vitalNames.pain_level"), unit: "" },
    };
    return vitalMap[fieldName] || null;
  };

  // Check if field is a vital sign that needs confirmation
  const isVitalField = (fieldName: string): boolean => {
    const vitalFields = [
      "temperature",
      "heart_rate",
      "spo2",
      "blood_pressure",
      "respiratory_rate",
      "pain_level",
    ];
    return vitalFields.includes(fieldName);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const previousValue = formData[name as keyof FormData] as string;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation - validate immediately when typing
    if (value && value.trim() !== "") {
      const validationResult = validateField(name, value);
      // validationResult can be true, false, or null
      // We only set state if it's a boolean (true or false), not null
      if (validationResult !== null) {
        setFieldValidity((prev) => ({
          ...prev,
          [name]: validationResult === true, // Store as boolean: true or false
        }));

        // Set error if invalid
        if (validationResult === false) {
          setErrors((prev) => ({
            ...prev,
            [name]: tInput("validation.invalidValue"),
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));

          // Note: Confirmation modal will be triggered on blur, not on every change
        }
      }
    } else {
      // Clear validation state when field is empty
      setFieldValidity((prev) => {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      });
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle blur event for vital signs to show confirmation modal
  const handleVitalBlur = (fieldName: string, value: string) => {
    if (
      isVitalField(fieldName) &&
      value &&
      value.trim() !== "" &&
      currentStep === 4
    ) {
      const validationResult = validateField(fieldName, value);
      if (validationResult === true) {
        const vitalInfo = getVitalInfo(fieldName);
        if (vitalInfo) {
          setPendingVital({
            name: vitalInfo.name,
            field: fieldName,
            value: value,
            unit: vitalInfo.unit,
          });
          setShowVitalConfirmation(true);
        }
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        // After Step 3 (Symptoms), show medical history modal
        setShowMedicalHistoryModal(true);
      } else if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as Step);
      } else {
        handleSubmit();
      }
    } else {
      showToast(tInput("toast.completeFields"), "error");
    }
  };

  const handleMedicalHistoryContinue = (data: {
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
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setShowMedicalHistoryModal(false);
    setCurrentStep(4); // Proceed to vitals
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    } else {
      router.push(ROUTES.HOME);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Store form data in sessionStorage for processing page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("formData", JSON.stringify(formData));
      }
      router.push(ROUTES.PROCESSING);
    } else {
      showToast(tInput("toast.submitError"), "error");
    }
  };

  const InfoModal: React.FC<{ type: string; onClose: () => void }> = ({
    type,
    onClose,
  }) => {
    const infoContent: Record<string, { title: string; description: string }> =
      {
        symptom: {
          title: tInput("info.symptom.title"),
          description: tInput("info.symptom.description"),
        },
        temperature: {
          title: tInput("info.temperature.title"),
          description: tInput("info.temperature.description"),
        },
        heart_rate: {
          title: tInput("info.heart_rate.title"),
          description: tInput("info.heart_rate.description"),
        },
        spo2: {
          title: tInput("info.spo2.title"),
          description: tInput("info.spo2.description"),
        },
        blood_pressure: {
          title: tInput("info.blood_pressure.title"),
          description: tInput("info.blood_pressure.description"),
        },
        duration: {
          title: tInput("info.duration.title"),
          description: tInput("info.duration.description"),
        },
        respiratory_rate: {
          title: tInput("info.respiratory_rate.title"),
          description: tInput("info.respiratory_rate.description"),
        },
        level_of_consciousness: {
          title: tInput("info.level_of_consciousness.title"),
          description: tInput("info.level_of_consciousness.description"),
        },
        onset: {
          title: tInput("info.onset.title"),
          description: tInput("info.onset.description"),
        },
        pain_level: {
          title: tInput("info.pain_level.title"),
          description: tInput("info.pain_level.description"),
        },
      };

    const content = infoContent[type];
    if (!content) return null;

    // Handle scroll locking when modal opens/closes
    useEffect(() => {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = "unset";
        document.body.style.position = "unset";
        document.body.style.top = "unset";
        document.body.style.width = "unset";
        window.scrollTo(0, scrollPosition);
      };
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              id="info-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              {content.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={tInput("info.close")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 leading-relaxed">{content.description}</p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background-DEFAULT flex flex-col">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleToastClose}
      />
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => {
          setShowConsentModal(false);
          router.push(ROUTES.HOME);
        }}
        onConsent={() => {
          setShowConsentModal(false);
        }}
      />
      {/* Header - Using MainHeader component for consistency */}
      <MainHeader />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-DEFAULT">
              {tInput("progress.stepOf", { current: currentStep, total: 4 })}
            </span>
            <span className="text-sm text-gray-500">
              {tInput("progress.assessment")}
            </span>
          </div>

          {/* Progress Stepper with Connecting Lines */}
          <div className="relative flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step, index) => {
              const isActive = currentStep === step;
              const isCompleted = currentStep > step;

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-primary-DEFAULT border-primary-DEFAULT shadow-tech-glow-sm"
                          : isCompleted
                          ? "bg-primary-DEFAULT border-primary-DEFAULT"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span
                          className={`text-xs font-bold ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {step}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium mt-1 ${
                        isActive
                          ? "text-primary-DEFAULT"
                          : isCompleted
                          ? "text-primary-DEFAULT"
                          : "text-gray-500"
                      }`}
                    >
                      {stepLabels[index]}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative">
                      <div
                        className={`absolute top-0 left-0 h-full bg-primary-DEFAULT transition-all duration-300 ${
                          isCompleted ? "w-full" : "w-0"
                        }`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: "#00A876" }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            ></motion.div>
          </div>
          <motion.p
            className="text-sm text-gray-600 text-center font-medium mt-2"
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </div>

        {/* Step Content - Full Screen Card Style */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 mb-6 border border-triageCard-border hover:border-primary-DEFAULT/20 transition-all duration-200 shadow-mobile-card hover:shadow-tech-glow-sm min-h-[400px] flex flex-col"
        >
          {/* Step 1: Age */}
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-DEFAULT"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {tInput("steps.age.title")}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {tInput("steps.age.subtitle")}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    label={tInput("steps.age.label")}
                    value={formData.age}
                    onChange={handleChange}
                    error={errors.age}
                    placeholder={tInput("steps.age.placeholder")}
                    className="text-center text-xl font-semibold"
                    min="0"
                    max="150"
                    required
                    showValidation={true}
                    isValid={fieldValidity.age}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Gender */}
          {currentStep === 2 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-DEFAULT"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {tInput("steps.gender.title")}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {tInput("steps.gender.subtitle")}
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md grid grid-cols-2 gap-4">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          gender: option.value,
                        }));
                        setErrors((prev) => ({ ...prev, gender: "" }));
                        setFieldValidity((prev) => ({
                          ...prev,
                          gender: true,
                        }));
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                        formData.gender === option.value
                          ? "border-primary-DEFAULT bg-primary-soft"
                          : "border-gray-200 hover:border-primary-DEFAULT/50 bg-white"
                      }`}
                    >
                      <span
                        className={`font-semibold text-lg ${
                          formData.gender === option.value
                            ? "text-primary-DEFAULT"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-600 text-sm mt-2 text-center">
                    {errors.gender}
                  </p>
                )}

                {/* Pregnancy questions for biological female - below gender buttons */}
                {formData.gender === "Female" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 w-full max-w-md"
                  >
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {tInput("steps.gender.pregnancy.question")}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex gap-3">
                            {yesNoOptions.slice(0, 2).map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    is_pregnant:
                                      option.value === "Yes" ? "yes" : "no",
                                    pregnancy_weeks:
                                      option.value === "No"
                                        ? null
                                        : prev.pregnancy_weeks,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  (formData.is_pregnant === "yes" &&
                                    option.value === "Yes") ||
                                  (formData.is_pregnant === "no" &&
                                    option.value === "No")
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-900 border-2 border-blue-300 hover:border-blue-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {formData.is_pregnant === "yes" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="block text-sm font-medium text-blue-900 mb-2">
                              {tInput("steps.gender.pregnancy.months")}
                            </label>
                            <Input
                              type="number"
                              id="pregnancy_months"
                              name="pregnancy_months"
                              value={
                                formData.pregnancy_weeks
                                  ? Math.round(
                                      parseInt(formData.pregnancy_weeks) / 4.33
                                    ).toString()
                                  : ""
                              }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                // Allow empty input
                                if (inputValue === "") {
                                  setFormData((prev) => ({
                                    ...prev,
                                    pregnancy_weeks: null,
                                  }));
                                  return;
                                }
                                const months = parseInt(inputValue);
                                // Validate months (0-9)
                                if (isNaN(months) || months < 0 || months > 9) {
                                  return;
                                }
                                // Convert months to weeks (approximate: 1 month = 4.33 weeks)
                                const weeks = Math.round(months * 4.33);
                                setFormData((prev) => ({
                                  ...prev,
                                  pregnancy_weeks: weeks.toString(),
                                }));
                              }}
                              placeholder={tInput(
                                "steps.gender.pregnancy.monthsPlaceholder"
                              )}
                              min="0"
                              max="9"
                              className="w-full"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Symptoms */}
          {currentStep === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {tInput("steps.symptoms.title")}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {tInput("steps.symptoms.subtitle")}
                </p>
              </div>
              <div className="flex-1">
                <div className="space-y-6">
                  {/* Quick-select symptom buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quickSelectSymptoms.map((symptom) => (
                      <button
                        key={symptom.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            symptom: prev.symptom
                              ? `${prev.symptom}, ${symptom.value}`
                              : symptom.value,
                          }));
                        }}
                        className="px-4 py-2 text-sm bg-primary-soft text-primary-DEFAULT rounded-lg hover:bg-primary-light hover:text-white transition-colors border border-primary-DEFAULT/20"
                      >
                        {symptom.label}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    id="symptom"
                    name="symptom"
                    label=""
                    value={formData.symptom}
                    onChange={handleChange}
                    rows={6}
                    error={errors.symptom}
                    infoButton={{
                      onClick: () => setShowInfo("symptom"),
                    }}
                    placeholder={tInput("steps.symptoms.placeholder")}
                    required
                    showValidation={true}
                    isValid={fieldValidity.symptom}
                  />

                  {/* Duration - moved from vitals step */}
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    label={tInput("steps.vitals.fields.duration.label")}
                    value={formData.duration}
                    onChange={handleChange}
                    infoButton={{
                      onClick: () => setShowInfo("duration"),
                    }}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                    placeholder={tInput(
                      "steps.vitals.fields.duration.placeholder"
                    )}
                  />

                  {/* Onset - moved from vitals step */}
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      {tInput("steps.vitals.fields.onset.label")}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowInfo("onset");
                        }}
                        className="w-5 h-5 rounded-full bg-primary-soft text-primary-DEFAULT flex items-center justify-center hover:bg-primary-light hover:text-white transition-colors text-xs font-bold"
                        aria-label={tInput("info.onset.title")}
                      >
                        9
                      </button>
                    </label>
                    <div
                      className="flex gap-3 flex-wrap"
                      role="group"
                      aria-label="Onset selection"
                    >
                      {onsetOptions.map((option) => {
                        const isSelected = formData.onset === option.value;
                        return (
                          <button
                            key={`onset-btn-${option.value}`}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newOnset = option.value;
                              // Use functional update to ensure we get latest state
                              setFormData((prev) => ({
                                ...prev,
                                onset: newOnset,
                              }));
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                              isSelected
                                ? "bg-primary-DEFAULT text-white border-primary-DEFAULT shadow-md"
                                : "bg-white text-gray-800 border-gray-400 hover:border-primary-DEFAULT hover:bg-gray-50 shadow-sm"
                            }`}
                            style={{
                              opacity: 1,
                              visibility: "visible",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: "100px",
                              position: "relative",
                              zIndex: 1,
                              color: isSelected ? "#FFFFFF" : "#1F2937",
                              backgroundColor: isSelected
                                ? "#00A876"
                                : "#FFFFFF",
                              borderColor: isSelected ? "#00A876" : "#9CA3AF",
                            }}
                          >
                            <span
                              style={{
                                color: isSelected ? "#FFFFFF" : "#1F2937",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                              }}
                            >
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Adaptive Questions - Swollen Leg (DVT) */}
                  {(formData.symptom.toLowerCase().includes("swollen leg") ||
                    formData.symptom.toLowerCase().includes("leg swelling") ||
                    formData.symptom.toLowerCase().includes("dvt")) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
                    >
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {tInput("followUps.swollenLeg.title")}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            {tInput("followUps.swollenLeg.questions.redness")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    leg_redness: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.leg_redness === option.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-900 border-2 border-blue-300 hover:border-blue-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            {tInput("followUps.swollenLeg.questions.warmth")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    leg_warmth: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.leg_warmth === option.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-900 border-2 border-blue-300 hover:border-blue-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            {tInput("followUps.swollenLeg.questions.duration")}
                          </label>
                          <Input
                            type="text"
                            id="leg_duration"
                            name="leg_duration"
                            value={formData.leg_duration}
                            onChange={handleChange}
                            placeholder={tInput(
                              "followUps.swollenLeg.placeholder"
                            )}
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Adaptive Questions - Head Injury */}
                  {(formData.symptom.toLowerCase().includes("head injury") ||
                    formData.symptom.toLowerCase().includes("head trauma") ||
                    formData.symptom.toLowerCase().includes("hit head") ||
                    (formData.symptom.toLowerCase().includes("headache") &&
                      (formData.symptom.toLowerCase().includes("fall") ||
                        formData.symptom.toLowerCase().includes("accident") ||
                        formData.symptom
                          .toLowerCase()
                          .includes("trauma")))) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg"
                    >
                      <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {tInput("followUps.headInjury.title")}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-amber-900 mb-2">
                            {tInput("followUps.headInjury.questions.dizziness")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    head_dizziness: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.head_dizziness === option.value
                                    ? "bg-amber-600 text-white"
                                    : "bg-white text-amber-900 border-2 border-amber-300 hover:border-amber-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-900 mb-2">
                            {tInput("followUps.headInjury.questions.vomiting")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    head_vomiting: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.head_vomiting === option.value
                                    ? "bg-amber-600 text-white"
                                    : "bg-white text-amber-900 border-2 border-amber-300 hover:border-amber-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-900 mb-2">
                            {tInput(
                              "followUps.headInjury.questions.consciousness"
                            )}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    head_loss_consciousness: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.head_loss_consciousness ===
                                  option.value
                                    ? "bg-amber-600 text-white"
                                    : "bg-white text-amber-900 border-2 border-amber-300 hover:border-amber-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Adaptive Questions - Chest Pain */}
                  {(formData.symptom.toLowerCase().includes("chest pain") ||
                    formData.symptom
                      .toLowerCase()
                      .includes("chest discomfort") ||
                    formData.symptom
                      .toLowerCase()
                      .includes("chest pressure")) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
                    >
                      <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {tInput("followUps.chestPain.title")}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-red-900 mb-2">
                            {tInput("followUps.chestPain.questions.radiation")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    chest_radiation: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.chest_radiation === option.value
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-red-900 border-2 border-red-300 hover:border-red-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-red-900 mb-2">
                            {tInput("followUps.chestPain.questions.breath")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    chest_shortness_breath: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.chest_shortness_breath ===
                                  option.value
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-red-900 border-2 border-red-300 hover:border-red-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-red-900 mb-2">
                            {tInput("followUps.chestPain.questions.nausea")}
                          </label>
                          <div className="flex gap-3">
                            {yesNoOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    chest_nausea: option.value,
                                  }));
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.chest_nausea === option.value
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-red-900 border-2 border-red-300 hover:border-red-500"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Vitals */}
          {currentStep === 4 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {tInput("steps.vitals.title")}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {tInput("steps.vitals.subtitle")}
                </p>
              </div>
              <div className="flex-1">
                <div className="space-y-6">
                  {/* Device Disclaimer */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="text-sm text-amber-900">
                      <strong>{tInput("steps.vitals.disclaimer.title")}</strong>{" "}
                      {tInput("steps.vitals.disclaimer.body")}
                    </p>
                  </div>

                  {/* Temperature */}
                  <Input
                    type="number"
                    step="0.1"
                    id="temperature"
                    name="temperature"
                    label={tInput("steps.vitals.fields.temperature.label")}
                    value={formData.temperature}
                    onChange={handleChange}
                    onBlur={(e) =>
                      handleVitalBlur("temperature", e.target.value)
                    }
                    error={errors.temperature}
                    infoButton={{
                      onClick: () => setShowInfo("temperature"),
                    }}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3a2 2 0 00-2 2v8.586a3.5 3.5 0 104 0V5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 7v8"
                        />
                      </svg>
                    }
                    normalRange={tInput(
                      "steps.vitals.fields.temperature.normal"
                    )}
                    placeholder={tInput(
                      "steps.vitals.fields.temperature.placeholder"
                    )}
                    showValidation={true}
                    isValid={fieldValidity.temperature}
                  />

                  {/* Heart Rate */}
                  <Input
                    type="number"
                    id="heart_rate"
                    name="heart_rate"
                    label={tInput("steps.vitals.fields.heartRate.label")}
                    value={formData.heart_rate}
                    onChange={handleChange}
                    onBlur={(e) =>
                      handleVitalBlur("heart_rate", e.target.value)
                    }
                    error={errors.heart_rate}
                    infoButton={{
                      onClick: () => setShowInfo("heart_rate"),
                    }}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    }
                    normalRange={tInput("steps.vitals.fields.heartRate.normal")}
                    placeholder={tInput(
                      "steps.vitals.fields.heartRate.placeholder"
                    )}
                    showValidation={true}
                    isValid={fieldValidity.heart_rate}
                  />

                  {/* SpO� */}
                  <Input
                    type="number"
                    id="spo2"
                    name="spo2"
                    label={tInput("steps.vitals.fields.spo2.label")}
                    value={formData.spo2}
                    onChange={handleChange}
                    onBlur={(e) => handleVitalBlur("spo2", e.target.value)}
                    min="70"
                    max="100"
                    error={errors.spo2}
                    infoButton={{
                      onClick: () => setShowInfo("spo2"),
                    }}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    }
                    normalRange={tInput("steps.vitals.fields.spo2.normal")}
                    placeholder={tInput("steps.vitals.fields.spo2.placeholder")}
                    showValidation={true}
                    isValid={fieldValidity.spo2}
                  />

                  {/* Blood Pressure */}
                  <Input
                    type="text"
                    id="blood_pressure"
                    name="blood_pressure"
                    label={tInput("steps.vitals.fields.bloodPressure.label")}
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    onBlur={(e) =>
                      handleVitalBlur("blood_pressure", e.target.value)
                    }
                    error={errors.blood_pressure}
                    infoButton={{
                      onClick: () => setShowInfo("blood_pressure"),
                    }}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    }
                    normalRange={tInput(
                      "steps.vitals.fields.bloodPressure.normal"
                    )}
                    placeholder={tInput(
                      "steps.vitals.fields.bloodPressure.placeholder"
                    )}
                    showValidation={true}
                    isValid={fieldValidity.blood_pressure}
                    mask="blood_pressure"
                  />

                  {/* Respiratory Rate */}
                  <Input
                    type="number"
                    id="respiratory_rate"
                    name="respiratory_rate"
                    label={tInput("steps.vitals.fields.respiratoryRate.label")}
                    value={formData.respiratory_rate}
                    onChange={handleChange}
                    onBlur={(e) =>
                      handleVitalBlur("respiratory_rate", e.target.value)
                    }
                    error={errors.respiratory_rate}
                    infoButton={{
                      onClick: () => setShowInfo("respiratory_rate"),
                    }}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    }
                    normalRange={tInput(
                      "steps.vitals.fields.respiratoryRate.normal"
                    )}
                    placeholder={tInput(
                      "steps.vitals.fields.respiratoryRate.placeholder"
                    )}
                    showValidation={true}
                    isValid={fieldValidity.respiratory_rate}
                  />

                  {/* Level of Consciousness */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      {tInput("steps.vitals.fields.consciousness.label")}
                      <button
                        type="button"
                        onClick={() => setShowInfo("level_of_consciousness")}
                        className="w-5 h-5 rounded-full bg-primary-soft text-primary-DEFAULT flex items-center justify-center hover:bg-primary-light hover:text-white transition-colors text-xs font-bold cursor-help"
                        aria-label="More information"
                      >
                        9
                      </button>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {consciousnessOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              level_of_consciousness: option.value,
                            }));
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                            formData.level_of_consciousness === option.value
                              ? "bg-primary-DEFAULT text-white border-primary-DEFAULT shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary-DEFAULT hover:bg-gray-50"
                          }`}
                          style={
                            formData.level_of_consciousness === option.value
                              ? { backgroundColor: "#00A876" }
                              : {}
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Onset */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      {tInput("steps.vitals.fields.onset.label")}
                      <button
                        type="button"
                        onClick={() => setShowInfo("onset")}
                        className="w-5 h-5 rounded-full bg-primary-soft text-primary-DEFAULT flex items-center justify-center hover:bg-primary-light hover:text-white transition-colors text-xs font-bold cursor-help"
                        aria-label="More information"
                      >
                        9
                      </button>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {onsetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              onset: option.value,
                            }));
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                            formData.onset === option.value
                              ? "bg-primary-DEFAULT text-white border-primary-DEFAULT shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary-DEFAULT hover:bg-gray-50"
                          }`}
                          style={
                            formData.onset === option.value
                              ? { backgroundColor: "#00A876" }
                              : {}
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pain Level - Visual Slider */}
                  <PainSlider
                    value={formData.pain_level}
                    onChange={(value) => {
                      const previousValue = formData.pain_level;
                      setFormData((prev) => ({
                        ...prev,
                        pain_level: value,
                      }));
                      // Update validation state
                      if (value) {
                        const validationResult = validateField(
                          "pain_level",
                          value
                        );
                        setFieldValidity((prev) => ({
                          ...prev,
                          pain_level: validationResult,
                        }));

                        // Show confirmation modal if value changed and is valid
                        if (
                          validationResult === true &&
                          value !== previousValue &&
                          currentStep === 4
                        ) {
                          setPendingVital({
                            name: tInput("vitalNames.pain_level"),
                            field: "pain_level",
                            value: value,
                            unit: "",
                          });
                          setShowVitalConfirmation(true);
                        }
                      }
                    }}
                    label={tInput("steps.vitals.fields.pain.label")}
                    error={errors.pain_level}
                    infoButton={{
                      onClick: () => setShowInfo("pain_level"),
                    }}
                  />

                  {/* Note */}
                  <div className="bg-primary-soft border-l-4 border-primary-DEFAULT p-4 rounded-r-lg">
                    <p className="text-sm text-teal-900">
                      <strong>{tInput("steps.vitals.note.title")}</strong>{" "}
                      {tInput("steps.vitals.note.body")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <Button
              type="button"
              onClick={handleBack}
              variant="secondary"
              size="md"
              className="flex-1"
            >
              {currentStep === 1
                ? tInput("buttons.cancel")
                : tInput("buttons.back")}
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              variant="primary"
              size="md"
              className="flex-1"
            >
              {currentStep === 4
                ? tInput("buttons.submit")
                : tInput("buttons.next")}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <InfoModal type={showInfo} onClose={() => setShowInfo(null)} />
        )}
      </AnimatePresence>

      {/* Medical History Modal */}
      <MedicalHistoryModal
        isOpen={showMedicalHistoryModal}
        onClose={() => {
          // Set defaults and proceed
          handleMedicalHistoryContinue({
            has_medical_conditions: "no",
            medical_conditions: [],
            medical_conditions_other: "",
            has_medications: "no",
            medications: [],
            medications_other: "",
            is_pregnant: formData.gender === "Female" ? "no" : null,
            pregnancy_trimester: null,
            pregnancy_weeks: null,
            is_trauma_related: "no",
            trauma_type: "",
            trauma_description: "",
          });
        }}
        onContinue={handleMedicalHistoryContinue}
        initialData={{
          has_medical_conditions: formData.has_medical_conditions,
          medical_conditions: formData.medical_conditions,
          medical_conditions_other: formData.medical_conditions_other,
          has_medications: formData.has_medications,
          medications: formData.medications,
          medications_other: formData.medications_other,
          is_pregnant: formData.is_pregnant,
          pregnancy_trimester: formData.pregnancy_trimester,
          pregnancy_weeks: formData.pregnancy_weeks,
          is_trauma_related: formData.is_trauma_related,
          trauma_type: formData.trauma_type,
          trauma_description: formData.trauma_description,
        }}
      />

      {/* Vital Confirmation Modal */}
      {pendingVital && (
        <VitalConfirmationModal
          isOpen={showVitalConfirmation}
          onClose={() => {
            setShowVitalConfirmation(false);
            // Optionally clear the field if user closes without confirming
          }}
          onConfirm={() => {
            setShowVitalConfirmation(false);
            setPendingVital(null);
            // Value is already saved, just confirm
          }}
          onReject={() => {
            setShowVitalConfirmation(false);
            // Clear the field value
            setFormData((prev) => ({
              ...prev,
              [pendingVital.field]: "",
            }));
            setFieldValidity((prev) => {
              const newState = { ...prev };
              delete newState[pendingVital.field];
              return newState;
            });
            setPendingVital(null);
          }}
          vitalName={pendingVital.name}
          vitalValue={pendingVital.value}
          vitalUnit={pendingVital.unit}
        />
      )}

      <Footer />
    </div>
  );
}
