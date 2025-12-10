"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import ConsentModal from "../../components/ConsentModal";
import MainHeader from "../../components/MainHeader";
import { ContactFormData, FormErrors } from "../../types";
import { ROUTES } from "../../constants";
import { hasConsent } from "../../lib/utils/consent";

export default function Contact() {
  const router = useRouter();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "Jordan Carter",
    workEmail: "",
    organization: "Northwind Health",
    primaryTopic: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const t = useTranslations("contact");

  const handleStartClick = () => {
    if (hasConsent()) {
      router.push(ROUTES.INPUT);
    } else {
      setShowConsentModal(true);
    }
  };

  const handleConsentClose = () => {
    setShowConsentModal(false);
  };

  const handleConsentGiven = () => {
    setShowConsentModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("validation.fullNameRequired");
    }

    if (!formData.workEmail.trim()) {
      newErrors.workEmail = t("validation.workEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      newErrors.workEmail = t("validation.workEmailInvalid");
    }

    if (!formData.organization.trim()) {
      newErrors.organization = t("validation.organizationRequired");
    }

    if (!formData.primaryTopic) {
      newErrors.primaryTopic = t("validation.primaryTopicRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("validation.messageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission (placeholder - to be implemented)
      console.log("Form submitted:", formData);
      // Navigate to results page after submission
      router.push(ROUTES.RESULTS);
    }
  };

  return (
    <div className="min-h-screen bg-background-DEFAULT">
      <ConsentModal
        isOpen={showConsentModal}
        onClose={handleConsentClose}
        onConsent={handleConsentGiven}
      />
      <MainHeader onStartAssessmentClick={handleStartClick} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Heading Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-mobile-card border border-triageCard-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t("form.labels.fullName")}
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.fullName
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-triageCard-border hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
                  }`}
                  placeholder={t("form.placeholders.fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label
                  htmlFor="workEmail"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t("form.labels.workEmail")}
                </label>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.workEmail
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-triageCard-border hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
                  }`}
                  placeholder={t("form.placeholders.workEmail")}
                />
                {errors.workEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.workEmail}
                  </p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t("form.labels.organization")}
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.organization
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-triageCard-border hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
                  }`}
                  placeholder={t("form.placeholders.organization")}
                />
                {errors.organization && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organization}
                  </p>
                )}
              </div>

              {/* Primary Topic */}
              <div>
                <label
                  htmlFor="primaryTopic"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t("form.labels.primaryTopic")}
                </label>
                <select
                  id="primaryTopic"
                  name="primaryTopic"
                  value={formData.primaryTopic}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-white ${
                    errors.primaryTopic
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-triageCard-border hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
                  }`}
                >
                  <option value="">{t("form.topics.placeholder")}</option>
                  <option value="clinical-pilot">
                    {t("form.topics.clinicalPilot")}
                  </option>
                  <option value="product-integration">
                    {t("form.topics.productIntegration")}
                  </option>
                  <option value="compliance">
                    {t("form.topics.compliance")}
                  </option>
                  <option value="partnership">
                    {t("form.topics.partnership")}
                  </option>
                  <option value="other">{t("form.topics.other")}</option>
                </select>
                {errors.primaryTopic && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.primaryTopic}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("form.labels.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 resize-none ${
                  errors.message
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 hover:border-primary-DEFAULT focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-soft"
                }`}
                placeholder={t("form.placeholders.message")}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            {/* Disclaimer and Submit Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">{t("form.disclaimer")}</p>
              <button
                type="submit"
                className="w-full sm:w-auto h-12 flex items-center justify-center px-8 rounded-xl font-semibold text-lg text-white bg-primary-DEFAULT shadow-md hover:bg-primary-dark hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-2 focus:ring-primary-soft focus:ring-offset-2 transition-all duration-100 cursor-pointer"
                style={{ backgroundColor: "#00A876" }}
              >
                {t("form.submit")}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
