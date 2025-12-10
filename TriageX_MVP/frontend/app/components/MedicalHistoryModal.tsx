"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MedicalHistoryData } from "../types/form.types";
import Button from "./ui/Button";
import Textarea from "./ui/Textarea";

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (data: MedicalHistoryData) => void;
  gender: string;
  initialData?: Partial<MedicalHistoryData>;
}

export default function MedicalHistoryModal({
  isOpen,
  onClose,
  onContinue,
  gender,
  initialData,
}: MedicalHistoryModalProps) {
  const t = useTranslations("input.medicalHistory");
  const modalContentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Medical conditions list (English)
  const medicalConditions = [
    "Heart disease",
    "Diabetes",
    "High blood pressure",
    "Smoking",
    "Overweight",
    "Asthma/COPD",
    "Cancer",
    "Stroke",
    "Blood clot",
    "Allergy",
    "Immunodeficiency",
    "Kidney disease",
    "Liver disease",
  ];

  // Medications list (English)
  const medications = [
    "Blood thinners (Warfarin, NOAC)",
    "Blood pressure medication",
    "Diabetes medication",
    "Asthma/COPD medication",
    "Heart medication",
    "Painkillers",
    "Antidepressants",
    "Cortisone",
    "Immunosuppressants",
    "Antihistamine",
  ];

  const [hasMedicalConditions, setHasMedicalConditions] = useState<string>("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [conditionsOther, setConditionsOther] = useState<string>("");

  const [hasMedications, setHasMedications] = useState<string>("");
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [medicationsOther, setMedicationsOther] = useState<string>("");

  const [isPregnant, setIsPregnant] = useState<string | null>(null);
  const [pregnancyTrimester, setPregnancyTrimester] = useState<string | null>(
    null
  );
  const [pregnancyWeeks, setPregnancyWeeks] = useState<string>("");

  const [isTraumaRelated, setIsTraumaRelated] = useState<string>("");
  const [traumaType, setTraumaType] = useState<string>("");
  const [traumaDescription, setTraumaDescription] = useState<string>("");

  // Show pregnancy section only for Female/Other/Prefer not to say
  const showPregnancy =
    gender === "Female" || gender === "Other" || gender === "Prefer not to say";

  useEffect(() => {
    if (isOpen) {
      // Initialize from initialData if provided
      if (initialData) {
        setHasMedicalConditions(initialData.has_medical_conditions || "");
        setSelectedConditions(initialData.medical_conditions || []);
        setConditionsOther(initialData.medical_conditions_other || "");
        setHasMedications(initialData.has_medications || "");
        setSelectedMedications(initialData.medications || []);
        setMedicationsOther(initialData.medications_other || "");
        setIsPregnant(initialData.is_pregnant || null);
        setPregnancyTrimester(initialData.pregnancy_trimester || null);
        setPregnancyWeeks(initialData.pregnancy_weeks || "");
        setIsTraumaRelated(initialData.is_trauma_related || "");
        setTraumaType((initialData as any).trauma_type || "");
        setTraumaDescription((initialData as any).trauma_description || "");
      }

      // Save scroll position and prevent body scroll
      scrollPositionRef.current =
        window.pageYOffset || document.documentElement.scrollTop;

      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";

      const timeoutId = setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.focus();
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [isOpen, initialData]);

  const handleConditionToggle = useCallback((condition: string) => {
    setSelectedConditions((prev) => {
      if (prev.includes(condition)) {
        return prev.filter((c) => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  }, []);

  const handleMedicationToggle = useCallback((medication: string) => {
    setSelectedMedications((prev) => {
      if (prev.includes(medication)) {
        return prev.filter((m) => m !== medication);
      } else {
        return [...prev, medication];
      }
    });
  }, []);

  const handleSkip = () => {
    const defaultData: MedicalHistoryData = {
      has_medical_conditions: "no",
      medical_conditions: [],
      medical_conditions_other: "",
      has_medications: "no",
      medications: [],
      medications_other: "",
      is_pregnant: showPregnancy ? "no" : null,
      pregnancy_trimester: null,
      pregnancy_weeks: null,
      is_trauma_related: "no",
      trauma_type: "",
      trauma_description: "",
    };
    onContinue(defaultData);
  };

  const handleContinue = () => {
    // Validation: If Yes selected, require at least one condition/medication or free text
    if (
      hasMedicalConditions === "yes" &&
      selectedConditions.length === 0 &&
      !conditionsOther.trim()
    ) {
      alert(t("validation.selectConditionOrText"));
      return;
    }

    if (
      hasMedications === "yes" &&
      selectedMedications.length === 0 &&
      !medicationsOther.trim()
    ) {
      alert(t("validation.selectMedicationOrText"));
      return;
    }

    if (isPregnant === "yes" && !pregnancyTrimester && !pregnancyWeeks.trim()) {
      alert(t("validation.selectTrimesterOrWeeks"));
      return;
    }

    const data: MedicalHistoryData = {
      has_medical_conditions: hasMedicalConditions || "no",
      medical_conditions: selectedConditions,
      medical_conditions_other: conditionsOther,
      has_medications: hasMedications || "no",
      medications: selectedMedications,
      medications_other: medicationsOther,
      is_pregnant: showPregnancy ? isPregnant || "no" : null,
      pregnancy_trimester: isPregnant === "yes" ? pregnancyTrimester : null,
      pregnancy_weeks:
        isPregnant === "yes" && pregnancyWeeks ? pregnancyWeeks : null,
      is_trauma_related: isTraumaRelated || "no",
      trauma_type: isTraumaRelated === "yes" ? traumaType : "",
      trauma_description: isTraumaRelated === "yes" ? traumaDescription : "",
    };

    onContinue(data);
  };

  const YesNoButtons = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const yesNoOptions = [
      { value: "yes", label: t("yes") },
      { value: "no", label: t("no") },
    ];

    return (
      <div className="flex gap-2 sm:gap-3 mb-4">
        {yesNoOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(option.value);
              }}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                isSelected
                  ? "text-white border-2 border-primary-DEFAULT"
                  : "bg-white text-primary-DEFAULT border-2 border-primary-DEFAULT hover:bg-primary-soft"
              }`}
              style={
                isSelected
                  ? { backgroundColor: "#00A876" }
                  : { backgroundColor: "#FFFFFF" }
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (confirm(t("modal.skipConfirm"))) {
                handleSkip();
              }
            }
          }}
        >
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-mobile-card mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                >
                  {t("modal.title")}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {t("modal.subtitle")}
                </p>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Section 1: Medical Conditions */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  {t("conditions.question")}
                </h3>
                <YesNoButtons
                  value={hasMedicalConditions}
                  onChange={setHasMedicalConditions}
                />

                {hasMedicalConditions === "yes" && (
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {medicalConditions.map((condition, index) => {
                        const isSelected =
                          selectedConditions.includes(condition);
                        return (
                          <button
                            key={`condition-${index}-${condition}`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleConditionToggle(condition);
                            }}
                            className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors border flex-shrink-0 ${
                              isSelected
                                ? "text-white border-primary-DEFAULT"
                                : "bg-primary-soft text-primary-DEFAULT border-primary-DEFAULT/20 hover:bg-primary-light hover:text-white"
                            }`}
                            style={
                              isSelected
                                ? { backgroundColor: "#00A876" }
                                : { backgroundColor: "#D9F5ED" }
                            }
                          >
                            {condition}
                          </button>
                        );
                      })}
                    </div>
                    <Textarea
                      label={t("conditions.otherLabel")}
                      placeholder={t("conditions.otherPlaceholder")}
                      value={conditionsOther}
                      onChange={(e) => setConditionsOther(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                )}
              </div>

              {/* Section 2: Medications */}
              <div>
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {t("medications.title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    {t("medications.description")}
                  </p>
                </div>
                <YesNoButtons
                  value={hasMedications}
                  onChange={setHasMedications}
                />

                {hasMedications === "yes" && (
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {medications.map((medication, index) => {
                        const isSelected =
                          selectedMedications.includes(medication);
                        return (
                          <button
                            key={`medication-${index}-${medication}`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleMedicationToggle(medication);
                            }}
                            className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors border flex-shrink-0 ${
                              isSelected
                                ? "text-white border-primary-DEFAULT"
                                : "bg-primary-soft text-primary-DEFAULT border-primary-DEFAULT/20 hover:bg-primary-light hover:text-white"
                            }`}
                            style={
                              isSelected
                                ? { backgroundColor: "#00A876" }
                                : { backgroundColor: "#D9F5ED" }
                            }
                          >
                            {medication}
                          </button>
                        );
                      })}
                    </div>
                    <Textarea
                      label={t("medications.otherLabel")}
                      placeholder={t("medications.otherPlaceholder")}
                      value={medicationsOther}
                      onChange={(e) => setMedicationsOther(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                )}
              </div>

              {/* Section 3: Pregnancy (conditional) */}
              {showPregnancy && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    {t("pregnancy.question")}
                  </h3>
                  <YesNoButtons
                    value={isPregnant || ""}
                    onChange={(val) => setIsPregnant(val)}
                  />

                  {isPregnant === "yes" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("pregnancy.followUp")}
                        </label>
                        <div className="space-y-2">
                          {["first", "second", "third"].map((trimester) => (
                            <label
                              key={trimester}
                              className="flex items-center space-x-3 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="pregnancy_trimester"
                                value={trimester}
                                checked={pregnancyTrimester === trimester}
                                onChange={(e) =>
                                  setPregnancyTrimester(e.target.value)
                                }
                                className="w-4 h-4 text-primary-DEFAULT border-gray-300 focus:ring-primary-DEFAULT"
                              />
                              <span className="text-sm text-gray-700">
                                {t(`pregnancy.trimester.${trimester}`)}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("pregnancy.weeks")}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="42"
                            value={pregnancyWeeks}
                            onChange={(e) => setPregnancyWeeks(e.target.value)}
                            placeholder={t("pregnancy.weeksPlaceholder")}
                            className="w-full px-4 py-2 border-2 border-triageCard-border rounded-xl focus:outline-none focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 4: Trauma */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  {t("trauma.question")}
                </h3>
                <YesNoButtons
                  value={isTraumaRelated}
                  onChange={setIsTraumaRelated}
                />

                {isTraumaRelated === "yes" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("trauma.type")}
                      </label>
                      <div className="space-y-2">
                        {[
                          "head",
                          "chest",
                          "abdomen",
                          "limb",
                          "back",
                          "other",
                        ].map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="trauma_type"
                              value={type}
                              checked={traumaType === type}
                              onChange={(e) => setTraumaType(e.target.value)}
                              className="w-4 h-4 text-primary-DEFAULT border-gray-300 focus:ring-primary-DEFAULT"
                            />
                            <span className="text-sm text-gray-700">
                              {t(`trauma.types.${type}`)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      label={t("trauma.description")}
                      placeholder={t("trauma.descriptionPlaceholder")}
                      value={traumaDescription}
                      onChange={(e) => setTraumaDescription(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <Button
                onClick={handleSkip}
                variant="secondary"
                size="lg"
                className="w-full sm:flex-1"
              >
                {t("modal.skip")}
              </Button>
              <Button
                onClick={handleContinue}
                variant="primary"
                size="lg"
                className="w-full sm:flex-1"
              >
                {t("modal.continue")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
