from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import pandas as pd
from datetime import datetime
import os

router = APIRouter(prefix="/traffic", tags=["Traffic Prediction"])

class TrafficRequest(BaseModel):
    source: str
    destination: str
    hour: int
    weather: str

class TrafficResponse(BaseModel):
    congestion_level: int
    status: str
    estimated_time: int

# ==========================================
# 1. LOAD THE TRAINED AI MODELS
# ==========================================
# We load these outside the function so the server only has to read them once when it boots up.
MODEL_PATH = "ml/traffic_model.pkl"
ENCODER_PATH = "ml/junction_mapping.pkl"

ML_READY = False
if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        le = joblib.load(ENCODER_PATH)
        ML_READY = True
        print("✅ AI Brain successfully loaded into Traffic Router!")
    except Exception as e:
        print(f"⚠️ Error loading ML models: {e}")

# ==========================================
# 2. PREDICTION API ENDPOINT
# ==========================================
@router.post("/predict", response_model=TrafficResponse)
def predict_traffic(data: TrafficRequest):
    
    # If the ML model failed to load, fall back to a safe default
    if not ML_READY:
        return {"congestion_level": 50, "status": "🟠 ML Offline", "estimated_time": 25}

    try:
        # Get the current day of the week (0=Monday, 6=Sunday)
        current_day = datetime.today().weekday()
        
        # Translate the city names (e.g., "JNTU") into the numbers the AI understands
        source_code = le.transform([data.source])[0]
        dest_code = le.transform([data.destination])[0]
        
        # Ask the AI to predict the number of vehicles at the Source
        source_input = pd.DataFrame([{'Hour': data.hour, 'Day': current_day, 'Location_Code': source_code}])
        source_vehicles = model.predict(source_input)[0]
        
        # Ask the AI to predict the number of vehicles at the Destination
        dest_input = pd.DataFrame([{'Hour': data.hour, 'Day': current_day, 'Location_Code': dest_code}])
        dest_vehicles = model.predict(dest_input)[0]
        
        # Average the two locations to get the overall route traffic
        avg_vehicles = (source_vehicles + dest_vehicles) / 2
        
        # Convert vehicle count to a Congestion Percentage (Assuming 150 vehicles = 100% jammed)
        congestion = (avg_vehicles / 150) * 100
        
        # Add the Weather Penalty (Because our base Kaggle dataset didn't include rain/fog)
        if data.weather == "Rainy":
            congestion += 15
        elif data.weather == "Foggy":
            congestion += 10
            
        # Ensure the percentage doesn't go below 0 or above 100
        congestion = int(max(0, min(100, congestion)))
        
        # Set the dynamic status text
        if congestion > 75:
            status = "🔴 JAM PACKED"
        elif congestion > 50:
            status = "🟠 Heavy Traffic"
        else:
            status = "🟢 Route Clear"
            
    except Exception as e:
        print(f"Prediction Error: {e}")
        congestion = 50
        status = "Error calculating"

    return {
        "congestion_level": congestion,
        "status": status,
        "estimated_time": int(congestion // 2) # Sends a rough delay estimation to the UI
    }