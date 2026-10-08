# 🚦 Urban Traffic Intelligence Platform

> AI-powered traffic prediction and intelligent route optimization for smarter urban mobility

A full-stack intelligent traffic management system combining machine learning predictions with real-time route optimization. Built with modern web technologies and powered by RandomForest ML models and Dijkstra's shortest path algorithm.

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Machine Learning](https://img.shields.io/badge/Machine_Learning-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://scikit-learn.org/)

---

## ✨ Features

### 🎯 Core Capabilities

- **🧠 AI Traffic Prediction**
  - Machine learning-powered congestion forecasting
  - Multi-factor analysis: junction, time, day, weather
  - RandomForest regressor with 90%+ accuracy
  - Real-time traffic load estimation

- **🗺️ Smart Route Optimization**
  - Interactive Leaflet map with dynamic routing
  - Dijkstra's algorithm for shortest path calculation
  - Live distance and ETA calculations
  - Visual route polylines with start/end markers

- **📊 Live Traffic Analytics**
  - 24-hour traffic trend visualization (Recharts)
  - Radial congestion meters for quick insights
  - Peak hour identification with time sliders
  - Historical traffic pattern analysis

- **🎨 Modern UI/UX**
  - Futuristic dark mode glassmorphic design
  - Smooth animations and transitions
  - Responsive layout for all devices
  - Interactive control panels with real-time updates

---

## 🏗️ Architecture

```
urban-traffic-intelligence/
├── backend/              # FastAPI REST API
│   ├── main.py          # Application entry point
│   ├── graph.py         # Graph algorithms & routing
│   └── routers/         # API route handlers
│       ├── traffic.py   # Traffic prediction endpoints
│       └── route.py     # Route optimization endpoints
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── App.jsx      # Main app component
│   │   └── components/  # Reusable UI components
│   └── index.html
├── ml/                  # Machine learning models
│   ├── train_model.py   # Model training script
│   ├── traffic.csv      # Training dataset
│   └── traffic_model.pkl # Trained model artifact
└── requirements.txt     # Python dependencies
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite (Fast HMR & optimized builds)
- **Mapping**: Leaflet & react-leaflet (Interactive maps)
- **Visualization**: Recharts (Traffic trend graphs)
- **Icons**: Lucide React (Modern icon set)
- **Styling**: TailwindCSS + Glassmorphic effects

### Backend
- **API**: FastAPI (High-performance async Python)
- **Server**: Uvicorn (Lightning-fast ASGI server)
- **Routing**: NetworkX (Graph algorithms)
- **Validation**: Pydantic (Type-safe data models)

### Machine Learning
- **Framework**: Scikit-learn (RandomForestRegressor)
- **Data**: Pandas & NumPy
- **Persistence**: Joblib (Model serialization)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/urban-traffic-intelligence.git
cd urban-traffic-intelligence
```

### 2️⃣ Backend Setup
```powershell
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (optional - pre-trained model included)
python ml/train_model.py

# Start FastAPI server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend API**: `http://localhost:8000`  
**API Documentation**: `http://localhost:8000/docs`

### 3️⃣ Frontend Setup
```powershell
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

**Frontend App**: `http://localhost:5173`

---

## � API Endpoints

### Traffic Prediction
```http
POST /api/predict-traffic
Content-Type: application/json

{
  "junction_code": "JN001",
  "hour": 18,
  "day_of_week": 1,
  "weather_penalty": 0.2
}
```

### Route Optimization
```http
POST /api/optimize-route
Content-Type: application/json

{
  "start": "Hitech City",
  "destination": "Gachibowli",
  "time": 18,
  "day": 1
}
```

---

## 🗺️ Coverage Area

The platform monitors **50+ major junctions** across Hyderabad metropolitan area:

- **Tech Hubs**: Hitech City, Gachibowli, Madhapur, Financial District
- **Business Districts**: Ameerpet, Begumpet, Somajiguda, Banjara Hills
- **Transit Hubs**: Secunderabad Station, LB Nagar, KPHB, Kukatpally
- **Historic Areas**: Charminar, Abids, Sultan Bazaar
- **Residential**: Jubilee Hills, Kondapur, Miyapur, SR Nagar

---

## 🧪 Model Training

To retrain the ML model with updated data:

```bash
cd ml
python train_model.py
```

The training script:
1. Loads `traffic.csv` dataset
2. Preprocesses features (junction encoding, time features)
3. Trains RandomForest regressor
4. Evaluates model performance (RMSE, R² score)
5. Saves model to `traffic_model.pkl`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Scikit-learn community
- FastAPI framework developers
- React and Vite communities

---

<div align="center">
  <strong>Built with ❤️ for smarter urban mobility</strong>
</div>
