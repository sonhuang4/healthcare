# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TriageX is a medical triage MVP application that assesses health symptoms and provides urgency-level recommendations. It uses a rule-based scoring system with symptom-specific handlers (chest pain, DVT, head injury, respiratory issues) and vital sign analysis.

## Build & Run Commands

### Backend (FastAPI + Python)
```bash
cd TriageX_MVP/backend
pip install -r requirements.txt
python main.py                    # Runs on localhost:8000
```

### Frontend (Next.js + TypeScript)
```bash
cd TriageX_MVP/frontend
npm install
npm run dev                       # Development server on localhost:3000
npm run build                     # Production build
npm run lint                      # ESLint
```

## Architecture

### Backend Structure
- **Entry Point**: `backend/main.py` → imports from `app/main.py`
- **API Routes**: `app/api/v1/router.py` combines all endpoint routers
  - `/api/v1/analyze` - Main health assessment endpoint
  - `/api/v1/questions/adaptive` - Dynamic follow-up questions based on symptoms
  - `/api/v1/admin/*` - Assessment logs and analytics
- **Triage Logic**: `app/services/triage_logic.py` - Core medical assessment
  - `check_emergency_indicators()` - Critical override checks (SpO2 < 85, LOC, etc.)
  - `assess_*()` functions for specific conditions (chest pain, DVT, head injury, respiratory)
  - `analyze_health()` - Main entry point that combines all assessments
- **Adaptive Questions**: `app/services/adaptive_questions.py` - Symptom-driven follow-up questions
- **Data Schemas**: `app/schemas/health.py` - Pydantic models for HealthData/HealthResponse
- **Database**: `app/db/database.py` - Supabase integration for assessment logging

### Frontend Structure
- **Routing**: Next.js App Router with i18n support (`app/[locale]/`)
- **Pages**: Home → Input → Processing → Results flow
- **API Client**: `app/lib/api/client.ts` - Backend endpoint definitions
- **Localization**: `messages/en.json`, `messages/sv.json` (English/Swedish)

### Triage Levels
Four output levels: `self_care`, `primary_care`, `semi_emergency`, `emergency`

### Key Data Flow
1. Frontend collects symptoms + vitals via input form
2. POST to `/api/v1/analyze` with HealthData schema
3. Backend runs triage logic, calculates risk score (0-1) and confidence
4. Response includes level, recommendations, key_factors, explanation_tags
5. Results logged to Supabase (if configured)

## Environment Variables

Backend (`.env` in `backend/`):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` - Database connection
- `FRONTEND_URL` - CORS configuration
- `HOST`, `PORT`, `RELOAD` - Server settings

Frontend:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
