# 🚦 AI-Powered Urban Traffic Intelligence Platform

An intelligent urban traffic management and route optimization system built with **FastAPI**, **React (Vite)**, **RandomForest ML**, and **Dijkstra's Shortest Path Algorithm**.

---

## 🌟 Key Features

- **📊 AI Congestion Prediction**: Machine learning predictions based on junction codes, time of day (0-23 hr), day of week, and weather penalties.
- **🗺️ Interactive Route Optimization**: Real-time Leaflet map rendering shortest path polylines, start/destination pins, total distance (km), and ETA.
- **🎨 Futuristic UI/UX**: Dark mode glassmorphic interface with radial congestion meters, Recharts 24-hour traffic trend graphs, location swap button, and peak-hour time sliders.
- **⚡ High-Performance Backend**: FastAPI REST backend powering ML inference and graph routing.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Leaflet (`react-leaflet`), Recharts, Lucide Icons, Glassmorphic CSS.
- **Backend**: Python 3.12, FastAPI, Uvicorn, NetworkX (Dijkstra algorithm), Pydantic.
- **Machine Learning**: Scikit-Learn (RandomForestRegressor), Pandas, NumPy, Joblib.

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
```powershell
# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn backend.main:app --reload
```
*Backend runs on `http://127.0.0.1:8000`*

### 2. Frontend Setup (React + Vite)
```powershell
# Navigate to frontend directory
cd frontend

# Install node packages
npm install

# Run dev server
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📍 Monitored Junctions
Covers 50 major urban transit hubs across Hyderabad including *Hitech City, Gachibowli, Ameerpet, Secunderabad Station, Jubilee Hills, Banjara Hills, LB Nagar, Begumpet, Kukatpally, and Charminar*.
