from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 👇 IMPORT THE SPECIALISTS (Crucial!)
from backend.routers import traffic, route

app = FastAPI(
    title="Urban Traffic Intelligence API",
    description="Backend services for traffic prediction and route optimization",
    version="1.0.0"
)

# CORS (Allows Streamlit to talk to FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 CONNECT THE SPECIALISTS (This fixes the 404 Error)
# This tells the main app: "If someone asks for /traffic, send them to traffic.py"
app.include_router(traffic.router)
app.include_router(route.router)

@app.get("/")
def root():
    return {
        "message": "Urban Traffic Intelligence Backend is running 🚀",
        "modules": ["Traffic Prediction", "Route Optimization"]
    }

@app.get("/health")
def health_check():
    return {"status": "OK"}