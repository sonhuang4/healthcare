"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";
import { ROUTES, TRIAGE_LEVELS } from "../../constants";
import { API_ENDPOINTS } from "../../lib/api/client";
import Toast from "../../components/ui/Toast";

interface Assessment {
  id: number;
  timestamp: string;
  age: string;
  gender: string;
  symptom: string;
  temperature: string;
  heart_rate: string;
  respiratory_rate: string;
  blood_pressure: string;
  spo2: string;
  level_of_consciousness: string;
  duration: string;
  onset: string;
  pain_level: string;
  triage_level: string;
  confidence: number;
  recommendations: string[];
}

interface Analytics {
  total_assessments: number;
  count_by_level: {
    self_care: number;
    primary_care: number;
    semi_emergency: number;
    emergency: number;
  };
  top_symptoms: Array<{ symptom: string; count: number }>;
  average_age: number | null;
  average_confidence: number | null;
}

export default function AdminPanel() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [triageLevelFilter, setTriageLevelFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const router = useRouter();

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const fetchData = async (overrides?: {
    startDate?: string;
    endDate?: string;
    triageLevelFilter?: string;
    currentPage?: number;
  }) => {
    try {
      setFilterLoading(true);

      // Use overrides if provided, otherwise use state values
      const effectiveStartDate =
        overrides?.startDate !== undefined ? overrides.startDate : startDate;
      const effectiveEndDate =
        overrides?.endDate !== undefined ? overrides.endDate : endDate;
      const effectiveTriageLevelFilter =
        overrides?.triageLevelFilter !== undefined
          ? overrides.triageLevelFilter
          : triageLevelFilter;
      const effectiveCurrentPage =
        overrides?.currentPage !== undefined
          ? overrides.currentPage
          : currentPage;

      // Build query parameters
      const params = new URLSearchParams();
      if (effectiveStartDate) params.append("start_date", effectiveStartDate);
      if (effectiveEndDate) params.append("end_date", effectiveEndDate);
      if (effectiveTriageLevelFilter)
        params.append("triage_level", effectiveTriageLevelFilter);
      params.append("limit", itemsPerPage.toString());
      params.append(
        "offset",
        ((effectiveCurrentPage - 1) * itemsPerPage).toString()
      );

      // Fetch assessments
      try {
        const assessmentsResponse = await fetch(
          `${API_ENDPOINTS.ADMIN_ASSESSMENTS}?${params.toString()}`
        );
        if (!assessmentsResponse.ok) {
          const errorText = await assessmentsResponse.text();
          console.error(
            "Assessments API error:",
            assessmentsResponse.status,
            errorText
          );
          setAssessments([]);
          if (assessmentsResponse.status === 404) {
            showToast(
              "Admin endpoints not found. Please restart the backend server.",
              "error"
            );
          } else {
            showToast(
              `Failed to fetch assessments: ${assessmentsResponse.status}`,
              "error"
            );
          }
        } else {
          const assessmentsData = await assessmentsResponse.json();
          setAssessments(assessmentsData.assessments || []);
          // If API returns total count, use it; otherwise estimate from analytics
          if (assessmentsData.total !== undefined) {
            setTotalCount(assessmentsData.total);
          }
        }
      } catch (fetchError) {
        console.error("Network error fetching assessments:", fetchError);
        setAssessments([]);
        showToast("Cannot connect to backend. Is the server running?", "error");
      }

      // Fetch analytics
      try {
        const analyticsParams = new URLSearchParams();
        if (effectiveStartDate)
          analyticsParams.append("start_date", effectiveStartDate);
        if (effectiveEndDate)
          analyticsParams.append("end_date", effectiveEndDate);

        const analyticsResponse = await fetch(
          `${API_ENDPOINTS.ADMIN_ANALYTICS}?${analyticsParams.toString()}`
        );
        if (!analyticsResponse.ok) {
          const errorText = await analyticsResponse.text();
          console.error(
            "Analytics API error:",
            analyticsResponse.status,
            errorText
          );
          // Set default analytics instead of throwing
          setAnalytics({
            total_assessments: 0,
            count_by_level: {
              self_care: 0,
              primary_care: 0,
              semi_emergency: 0,
              emergency: 0,
            },
            top_symptoms: [],
            average_age: null,
            average_confidence: null,
          });
          if (analyticsResponse.status === 404) {
            // Don't show duplicate error if assessments already showed it
            if (assessments.length === 0) {
              showToast(
                "Admin endpoints not found. Please restart the backend server.",
                "error"
              );
            }
          }
        } else {
          const analyticsData = await analyticsResponse.json();
          setAnalytics(analyticsData);
          // Use analytics total as fallback for pagination if not set
          if (totalCount === null && analyticsData.total_assessments) {
            setTotalCount(analyticsData.total_assessments);
          }
        }
      } catch (fetchError) {
        console.error("Network error fetching analytics:", fetchError);
        // Set default analytics
        setAnalytics({
          total_assessments: 0,
          count_by_level: {
            self_care: 0,
            primary_care: 0,
            semi_emergency: 0,
            emergency: 0,
          },
          top_symptoms: [],
          average_age: null,
          average_confidence: null,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setTriageLevelFilter("");
    setCurrentPage(1);
    setTotalCount(null); // Reset total count when filters are cleared
    // Pass cleared values directly to fetchData to avoid state update race condition
    fetchData({
      startDate: "",
      endDate: "",
      triageLevelFilter: "",
      currentPage: 1,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getTriageConfig = (level: string) => {
    return (
      TRIAGE_LEVELS[level as keyof typeof TRIAGE_LEVELS] ||
      TRIAGE_LEVELS.primary_care
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-DEFAULT border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-textSecondary">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  // Default analytics if null
  const displayAnalytics = analytics || {
    total_assessments: 0,
    count_by_level: {
      self_care: 0,
      primary_care: 0,
      semi_emergency: 0,
      emergency: 0,
    },
    top_symptoms: [],
    average_age: null,
    average_confidence: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleToastClose}
      />

      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center">
              <Logo
                height={32}
                width={112}
                className="h-4 sm:h-5 md:h-6 lg:h-8 w-16 sm:w-20 md:w-24 lg:w-32 max-w-full"
              />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Monitor assessments and analytics
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => router.push(ROUTES.HOME)}
                className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-primary-DEFAULT px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Overview
          </h2>
          <p className="text-gray-600">
            Real-time insights into TriageX assessments and usage patterns
          </p>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 justify-items-center sm:justify-items-stretch">
          {/* Total Assessments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group w-full max-w-sm sm:max-w-none"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-DEFAULT/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-DEFAULT to-primary-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Assessments
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {displayAnalytics.total_assessments.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>
          </motion.div>

          {/* Self-Care */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group w-full max-w-sm sm:max-w-none"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-DEFAULT/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: "#00A876" }}
                >
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Self-Care
              </p>
              <p
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "#00A876" }}
              >
                {displayAnalytics.count_by_level.self_care}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {displayAnalytics.total_assessments > 0
                  ? `${Math.round(
                      (displayAnalytics.count_by_level.self_care /
                        displayAnalytics.total_assessments) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </motion.div>

          {/* Primary Care */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group w-full max-w-sm sm:max-w-none"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning-DEFAULT/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: "#FACC15" }}
                >
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Primary Care
              </p>
              <p
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "#FACC15" }}
              >
                {displayAnalytics.count_by_level.primary_care}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {displayAnalytics.total_assessments > 0
                  ? `${Math.round(
                      (displayAnalytics.count_by_level.primary_care /
                        displayAnalytics.total_assessments) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </motion.div>

          {/* Urgent Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group w-full max-w-sm sm:max-w-none"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-risk-DEFAULT/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: "#FB923C" }}
                >
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Urgent Cases
              </p>
              <p
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "#FB923C" }}
              >
                {displayAnalytics.count_by_level.semi_emergency +
                  displayAnalytics.count_by_level.emergency}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Semi-Emergency + Emergency
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 justify-items-center md:justify-items-stretch">
          {/* Average Age */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 w-full max-w-sm md:max-w-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Age</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayAnalytics.average_age
                    ? `${Math.round(displayAnalytics.average_age)} years`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Average Confidence */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 w-full max-w-sm md:max-w-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Confidence
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayAnalytics.average_confidence
                    ? `${(displayAnalytics.average_confidence * 100).toFixed(
                        1
                      )}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Top Symptom */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 w-full max-w-sm md:max-w-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
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
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Top Symptom</p>
                {displayAnalytics.top_symptoms.length > 0 ? (
                  <div>
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {displayAnalytics.top_symptoms[0].symptom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {displayAnalytics.top_symptoms[0].count} cases
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-gray-400">No data</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Filters</h2>
              <p className="text-sm text-gray-600">
                Filter assessments by date range and triage level
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-all duration-200 bg-white text-gray-900"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-all duration-200 bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Triage Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Triage Level
              </label>
              <select
                value={triageLevelFilter}
                onChange={(e) => setTriageLevelFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">All Levels</option>
                <option value="self_care">Self-Care</option>
                <option value="primary_care">Primary Care</option>
                <option value="semi_emergency">Semi-Emergency</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                disabled={filterLoading}
                className="flex-1 bg-primary-DEFAULT text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: "#00A876" }}
              >
                {filterLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Apply Filters
                  </>
                )}
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Usage Log Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Usage Log</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed assessment records
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {assessments.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No assessments found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Complete an assessment to see data here. All assessments are
                    automatically logged.
                  </p>
                  <button
                    onClick={() => router.push(ROUTES.INPUT)}
                    className="inline-flex items-center gap-2 bg-primary-DEFAULT text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: "#00A876" }}
                  >
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Start Assessment
                  </button>
                </div>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Age / Gender
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Symptom
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Vitals
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Recommendation
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assessments.map((assessment) => {
                      const triageConfig = getTriageConfig(
                        assessment.triage_level
                      );
                      return (
                        <tr
                          key={assessment.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(assessment.timestamp).split(",")[0]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(assessment.timestamp).split(",")[1]}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assessment.age || "N/A"} /{" "}
                              {assessment.gender || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {assessment.symptom || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 space-y-1">
                              {assessment.temperature && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">🌡️</span>
                                  <span>{assessment.temperature}°C</span>
                                </div>
                              )}
                              {assessment.heart_rate && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">❤️</span>
                                  <span>{assessment.heart_rate} bpm</span>
                                </div>
                              )}
                              {assessment.spo2 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">🫁</span>
                                  <span>{assessment.spo2}%</span>
                                </div>
                              )}
                              {!assessment.temperature &&
                                !assessment.heart_rate &&
                                !assessment.spo2 && (
                                  <span className="text-gray-400">N/A</span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                              style={{
                                backgroundColor: triageConfig.bgColor,
                                color: triageConfig.textColor,
                              }}
                            >
                              {triageConfig.title}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary-DEFAULT to-primary-dark rounded-full"
                                  style={{
                                    width: `${
                                      assessment.confidence
                                        ? assessment.confidence * 100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                                {assessment.confidence
                                  ? `${(assessment.confidence * 100).toFixed(
                                      0
                                    )}%`
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: Results count and page size selector */}
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                          {assessments.length > 0
                            ? (currentPage - 1) * itemsPerPage + 1
                            : 0}
                        </span>
                        {" - "}
                        <span className="font-semibold text-gray-900">
                          {(currentPage - 1) * itemsPerPage +
                            assessments.length}
                        </span>
                        {totalCount !== null && (
                          <>
                            {" of "}
                            <span className="font-semibold text-gray-900">
                              {totalCount}
                            </span>
                          </>
                        )}
                        {" results"}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">
                          Per page:
                        </label>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-all duration-200"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>

                    {/* Right: Page navigation */}
                    <div className="flex items-center gap-2">
                      {/* Previous button */}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Previous
                      </button>

                      {/* Page numbers */}
                      {(() => {
                        const totalPages =
                          totalCount !== null
                            ? Math.ceil(totalCount / itemsPerPage)
                            : assessments.length === itemsPerPage
                            ? currentPage + 1
                            : currentPage;

                        const pages: (number | string)[] = [];
                        const maxVisiblePages = 7;

                        if (totalPages <= maxVisiblePages) {
                          // Show all pages if total is small
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          // Show first page
                          pages.push(1);

                          if (currentPage > 3) {
                            pages.push("...");
                          }

                          // Show pages around current page
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);

                          for (let i = start; i <= end; i++) {
                            pages.push(i);
                          }

                          if (currentPage < totalPages - 2) {
                            pages.push("...");
                          }

                          // Show last page
                          pages.push(totalPages);
                        }

                        return pages.map((page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }

                          const pageNum = page as number;
                          const isActive = pageNum === currentPage;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-primary-DEFAULT text-white border-primary-DEFAULT shadow-md"
                                  : "border-gray-300 text-gray-700 hover:bg-white"
                              }`}
                              style={
                                isActive ? { backgroundColor: "#00A876" } : {}
                              }
                            >
                              {pageNum}
                            </button>
                          );
                        });
                      })()}

                      {/* Next button */}
                      <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={
                          totalCount !== null
                            ? currentPage >=
                              Math.ceil(totalCount / itemsPerPage)
                            : assessments.length < itemsPerPage
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
