-- TriageX Assessments Table
-- Run this in Supabase SQL Editor

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- User demographics
    age TEXT,
    gender TEXT,
    
    -- Symptoms
    symptom TEXT NOT NULL,
    
    -- Vital signs
    temperature NUMERIC,
    heart_rate INTEGER,
    respiratory_rate TEXT,
    blood_pressure TEXT,
    spo2 INTEGER,
    level_of_consciousness TEXT,
    
    -- Additional info
    duration TEXT,
    onset TEXT,
    pain_level TEXT,
    
    -- Adaptive questions
    leg_redness TEXT,
    leg_warmth TEXT,
    leg_duration TEXT,
    head_dizziness TEXT,
    head_vomiting TEXT,
    head_loss_consciousness TEXT,
    chest_radiation TEXT,
    chest_shortness_breath TEXT,
    chest_nausea TEXT,
    
    -- Triage results
    triage_level TEXT NOT NULL,
    confidence NUMERIC NOT NULL,
    recommendations TEXT, -- JSON string
    key_factors TEXT, -- JSON string
    explanation_tags TEXT, -- JSON string
    data_quality NUMERIC,
    low_confidence_warning BOOLEAN DEFAULT FALSE,
    ai_enabled BOOLEAN DEFAULT FALSE,
    ai_model_type TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_timestamp ON assessments(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_triage_level ON assessments(triage_level);
CREATE INDEX IF NOT EXISTS idx_assessments_symptom ON assessments(symptom);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service_role full access
CREATE POLICY "Service role can do everything" ON assessments
    FOR ALL
    USING (true)
    WITH CHECK (true);

