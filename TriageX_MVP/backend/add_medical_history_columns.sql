-- Medical History Migration
-- Run this in Supabase SQL Editor
-- Adds medical history columns to assessments table

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS has_medical_conditions BOOLEAN;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS medical_conditions TEXT[];
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS medical_conditions_other TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS has_medications BOOLEAN;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS medications TEXT[];
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS medications_other TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS is_pregnant BOOLEAN;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS pregnancy_trimester TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS pregnancy_weeks INTEGER;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS is_trauma_related BOOLEAN;

-- All columns are nullable, so existing records won't break

