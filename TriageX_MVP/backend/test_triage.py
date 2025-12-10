#!/usr/bin/env python3
"""Quick test script for triage logic"""
import sys
sys.path.insert(0, '.')

# Create a mock HealthData-like object
class MockHealthData:
    def __init__(self):
        self.symptom = "chest pain"
        self.heart_rate = 110
        self.temperature = 37.5
        self.spo2 = 92
        self.blood_pressure = None
        self.respiratory_rate = None
        self.level_of_consciousness = None
        self.duration = None
        self.onset = None
        self.pain_level = None
        self.chest_radiation = "yes"
        self.chest_shortness_breath = "yes"
        self.chest_nausea = None
        self.leg_redness = None
        self.leg_warmth = None
        self.leg_duration = None
        self.head_dizziness = None
        self.head_vomiting = None
        self.head_loss_consciousness = None

try:
    from triage_logic import analyze_health
    data = MockHealthData()
    result = analyze_health(data)
    print("SUCCESS!")
    print(f"Level: {result.get('level')}")
    print(f"Confidence: {result.get('confidence')}")
    print(f"Key factors: {result.get('key_factors', [])}")
    print(f"Has explanation_tags: {'explanation_tags' in result}")
    print(f"Has data_quality: {'data_quality' in result}")
    print(f"All keys: {list(result.keys())}")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

